import { ApiError } from "@/types/app";

let sessionId: string | null = null;

export function getSessionId() {
  return sessionId;
}

export function setSessionId(id: string) {
  sessionId = id;
}

export async function apiCall<T = any>(
  method: string,
  path: string,
  body?: any
): Promise<T> {
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
}
