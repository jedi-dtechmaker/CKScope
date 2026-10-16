import type { ApiResponse } from '@ckscope/shared';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Single fetch wrapper all hooks share. Vite dev server proxies /api to the
// Hono backend, so no CORS configuration is needed.
export async function api<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<ApiResponse<T>>;
}
