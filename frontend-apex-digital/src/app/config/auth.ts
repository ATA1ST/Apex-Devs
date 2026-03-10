// Frontend authentication configuration
// В реальном проекте это должно быть в .env и на backend

// Захардкоженные учетные данные для демо
export const AUTH_CONFIG = {
  LOGIN: 'apex_admin',
  PASSWORD: 'ApexDigital2026!',
  
  // Session TTL (2 часа в миллисекундах)
  SESSION_TTL: 2 * 60 * 60 * 1000,
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 2 * 60 * 1000, // 2 минуты
};

// Функция для получения логина
export function getLogin(): string {
  return AUTH_CONFIG.LOGIN;
}

// Проверка пароля (упрощенная для демо)
export async function verifyPassword(password: string): Promise<boolean> {
  // В демо версии просто сравниваем напрямую
  return password === AUTH_CONFIG.PASSWORD;
}

// Session management
interface SessionData {
  username: string;
  timestamp: number;
  expiresAt: number;
}

export function createSession(username: string): void {
  const now = Date.now();
  const session: SessionData = {
    username,
    timestamp: now,
    expiresAt: now + AUTH_CONFIG.SESSION_TTL,
  };
  sessionStorage.setItem('apex_session', JSON.stringify(session));
}

export function getSession(): SessionData | null {
  try {
    const data = sessionStorage.getItem('apex_session');
    if (!data) return null;
    
    const session: SessionData = JSON.parse(data);
    
    // Проверка истечения сессии
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem('apex_session');
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Rate limiting
interface RateLimitData {
  attempts: number;
  lockedUntil: number | null;
}

const RATE_LIMIT_KEY = 'apex_rate_limit';

export function checkRateLimit(): { allowed: boolean; remainingTime?: number } {
  const data = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  
  if (!data) {
    return { allowed: true };
  }
  
  const rateLimit: RateLimitData = JSON.parse(data);
  
  // Проверка блокировки
  if (rateLimit.lockedUntil && now < rateLimit.lockedUntil) {
    const remainingTime = Math.ceil((rateLimit.lockedUntil - now) / 1000);
    return { allowed: false, remainingTime };
  }
  
  // Разблокировка если время прошло
  if (rateLimit.lockedUntil && now >= rateLimit.lockedUntil) {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { allowed: true };
  }
  
  // Проверка количества попыток
  if (rateLimit.attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
    const lockedUntil = now + AUTH_CONFIG.LOCKOUT_DURATION;
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: rateLimit.attempts, lockedUntil })
    );
    const remainingTime = Math.ceil(AUTH_CONFIG.LOCKOUT_DURATION / 1000);
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
}

export function recordFailedAttempt(): void {
  const data = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  
  if (!data) {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: 1, lockedUntil: null })
    );
    return;
  }
  
  const rateLimit: RateLimitData = JSON.parse(data);
  const newAttempts = rateLimit.attempts + 1;
  
  if (newAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
    const lockedUntil = now + AUTH_CONFIG.LOCKOUT_DURATION;
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: newAttempts, lockedUntil })
    );
  } else {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: newAttempts, lockedUntil: null })
    );
  }
}

export function clearRateLimit(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}