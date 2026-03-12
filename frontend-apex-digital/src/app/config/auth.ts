import { apiUrl, getApiErrorMessage, type ApiErrorPayload } from './api';

const TOKEN_KEY = 'apex_admin_token';
const SESSION_KEY = 'apex_session';
const RATE_LIMIT_KEY = 'apex_rate_limit';

export const AUTH_CONFIG = {
  SESSION_TTL: 2 * 60 * 60 * 1000,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 2 * 60 * 1000,
};

interface SessionData {
  username: string;
  displayName?: string;
  token: string;
  timestamp: number;
  expiresAt: number;
}

interface RateLimitData {
  attempts: number;
  lockedUntil: number | null;
}

interface LoginResponse {
  token: string;
  expiresIn: number;
  displayName: string;
}

export function createSession(username: string, token: string, expiresInSeconds: number, displayName?: string): void {
  const now = Date.now();
  const expiresAt = now + expiresInSeconds * 1000;

  const session: SessionData = {
    username,
    displayName,
    token,
    timestamp: now,
    expiresAt,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: SessionData = JSON.parse(raw);

    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function getToken(): string | null {
  const session = getSession();
  return session?.token || sessionStorage.getItem(TOKEN_KEY);
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getSession();
}

export async function loginAdmin(login: string, password: string): Promise<LoginResponse> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  const result = (await response.json().catch(() => null)) as LoginResponse | ApiErrorPayload | null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(result as ApiErrorPayload | null, 'РћС€РёР±РєР° РІС…РѕРґР°'));
  }

  const data = result as LoginResponse;
  createSession(login, data.token, data.expiresIn, data.displayName);
  return data;
}

export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getToken();

  if (!token) {
    clearSession();
    throw new Error('РЎРµСЃСЃРёСЏ РёСЃС‚РµРєР»Р°. Р’РѕР№РґРёС‚Рµ СЃРЅРѕРІР°.');
  }

  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const isFormData = init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input.startsWith('http') ? input : apiUrl(input), {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearSession();
    throw new Error('РЎРµСЃСЃРёСЏ РёСЃС‚РµРєР»Р°. Р’РѕР№РґРёС‚Рµ СЃРЅРѕРІР°.');
  }

  return response;
}

export async function downloadProtectedFile(url: string, fileName?: string) {
  const response = await authFetch(url, { method: 'GET' });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РєСЂС‹С‚СЊ С„Р°Р№Р»');
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName || 'file';
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export function checkRateLimit(): { allowed: boolean; remainingTime?: number } {
  const data = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();

  if (!data) return { allowed: true };

  const rateLimit: RateLimitData = JSON.parse(data);

  if (rateLimit.lockedUntil && now < rateLimit.lockedUntil) {
    return {
      allowed: false,
      remainingTime: Math.ceil((rateLimit.lockedUntil - now) / 1000),
    };
  }

  if (rateLimit.lockedUntil && now >= rateLimit.lockedUntil) {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { allowed: true };
  }

  if (rateLimit.attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
    const lockedUntil = now + AUTH_CONFIG.LOCKOUT_DURATION;
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: rateLimit.attempts, lockedUntil }),
    );
    return {
      allowed: false,
      remainingTime: Math.ceil(AUTH_CONFIG.LOCKOUT_DURATION / 1000),
    };
  }

  return { allowed: true };
}

export function recordFailedAttempt(): void {
  const data = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();

  if (!data) {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: 1, lockedUntil: null }),
    );
    return;
  }

  const rateLimit: RateLimitData = JSON.parse(data);
  const newAttempts = rateLimit.attempts + 1;

  if (newAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: newAttempts, lockedUntil: now + AUTH_CONFIG.LOCKOUT_DURATION }),
    );
  } else {
    localStorage.setItem(
      RATE_LIMIT_KEY,
      JSON.stringify({ attempts: newAttempts, lockedUntil: null }),
    );
  }
}

export function clearRateLimit(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}
