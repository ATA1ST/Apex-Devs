const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/+$/, '')
  : '';

export interface ApiErrorPayload {
  message?: string;
  Message?: string;
  errors?: Record<string, string[]>;
  Errors?: Record<string, string[]>;
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

export function getApiErrorMessage(
  payload: ApiErrorPayload | null | undefined,
  fallback: string,
) {
  return payload?.message || payload?.Message || fallback;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  fallbackMessage = 'Request failed',
): Promise<T> {
  const response = await fetch(apiUrl(path), init);
  const payload = (await response.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload as ApiErrorPayload | null, fallbackMessage));
  }

  return payload as T;
}
