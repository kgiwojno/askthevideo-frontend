import { ApiError } from "@/types/app";

let sessionId: string | null = null;

export function getSessionId() {
  return sessionId;
}

export function setSessionId(id: string) {
  sessionId = id;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiCall<T = any>(
  method: string,
  path: string,
  body?: any,
  options?: { retries?: number; retryDelayMs?: number }
): Promise<T> {
  const maxRetries = options?.retries ?? 2;
  const baseDelay = options?.retryDelayMs ?? 1000;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (sessionId) {
        headers["X-Session-ID"] = sessionId;
      }

      const res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();

      // Capture session ID from response
      if (data.session_id) {
        sessionId = data.session_id;
      }

      if (!res.ok) {
        const err: ApiError = {
          error: data.error || "An unexpected error occurred.",
          code: data.code || "INTERNAL_ERROR",
        };
        throw err;
      }

      return data as T;
    } catch (err: any) {
      lastError = err;

      // Don't retry client errors (4xx) or known API errors with codes
      if (err?.code && err.code !== "INTERNAL_ERROR") {
        throw err;
      }

      // Don't retry on last attempt
      if (attempt < maxRetries) {
        await delay(baseDelay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError;
}
