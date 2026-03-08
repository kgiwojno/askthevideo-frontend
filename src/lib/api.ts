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

/**
 * Stream a POST request via SSE (Server-Sent Events).
 * The backend sends `data: {"token":"..."}` lines, and a final `data: [DONE]`.
 * Falls back to regular `/api/ask` if the stream endpoint fails to connect.
 */
export async function apiStreamCall(
  path: string,
  body: any,
  onToken: (token: string) => void,
  onDone: (fullText: string, data?: any) => void,
  onError: (err: any) => void,
  abortSignal?: AbortSignal
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  try {
    const res = await fetch(path, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: abortSignal,
    });

    // If stream endpoint doesn't exist (404/405), fall back
    if (res.status === 404 || res.status === 405) {
      throw { fallback: true };
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw { error: errData.error || "Stream request failed", code: errData.code };
    }

    if (!res.body) {
      throw { fallback: true };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const payload = trimmed.slice(6);

        if (payload === "[DONE]") {
          onDone(accumulated);
          return;
        }

        try {
          const parsed = JSON.parse(payload);

          // Capture session ID
          if (parsed.session_id) {
            sessionId = parsed.session_id;
          }

          if (parsed.token) {
            accumulated += parsed.token;
            onToken(accumulated);
          }

          // Final message with limits
          if (parsed.limits) {
            onDone(accumulated, parsed);
            return;
          }
        } catch {
          // Skip malformed lines
        }
      }
    }

    // Stream ended without [DONE] — still complete
    onDone(accumulated);
  } catch (err: any) {
    if (err?.fallback) {
      // Fallback to non-streaming endpoint
      try {
        const data = await apiCall("POST", "/api/ask", body);
        onToken(data.answer);
        onDone(data.answer, data);
      } catch (fallbackErr) {
        onError(fallbackErr);
      }
    } else {
      onError(err);
    }
  }
}
