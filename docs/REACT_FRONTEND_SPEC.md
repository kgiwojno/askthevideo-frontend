# AskTheVideo -- React Frontend API Integration

## For: Lovable / Claude (update React app to use real API)

---

## 1. Overview

The React frontend needs to communicate with a FastAPI backend running on the same domain. All API endpoints are under `/api/`. The React app is served as static files from the same container, so there are no CORS issues.

**Base URL:** same origin (no prefix needed, just `/api/...`)

---

## 2. Session management

The backend tracks sessions using an ID passed in a header. The frontend must:

1. On first load, call `GET /api/status` (no session header)
2. Store the `session_id` from the response
3. Send it on every subsequent request as a header

```typescript
// Store in React state or context
const [sessionId, setSessionId] = useState<string | null>(null);

// On app mount
useEffect(() => {
  fetch('/api/status')
    .then(res => res.json())
    .then(data => setSessionId(data.session_id));
}, []);

// Helper for all API calls
async function apiCall(method: string, path: string, body?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['X-Session-ID'] = sessionId;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // Capture session ID from first response
  if (data.session_id && !sessionId) {
    setSessionId(data.session_id);
  }

  if (!res.ok) {
    throw { status: res.status, ...data };
  }

  return data;
}
```

---

## 3. API endpoints

### 3.1 GET /api/status

**When to call:** on app mount, and to check if the backend is awake.

**Request:** no body, optional `X-Session-ID` header.

**Response (no session):**
```json
{
  "status": "ok",
  "app": "AskTheVideo"
}
```

**Response (with session):**
```json
{
  "session_id": "abc-123",
  "status": "ok",
  "limits": {
    "videos_loaded": 2,
    "videos_max": 5,
    "questions_used": 3,
    "questions_max": 10,
    "unlimited": false
  }
}
```

---

### 3.2 POST /api/videos

**When to call:** user submits a YouTube URL.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response (success):**
```json
{
  "session_id": "abc-123",
  "video": {
    "video_id": "dQw4w9WgXcQ",
    "title": "Never Gonna Give You Up (Official Video) (4K Remaster)",
    "channel": "Rick Astley",
    "duration_display": "3:31",
    "chunk_count": 2,
    "status": "ingested"
  },
  "limits": {
    "videos_loaded": 1,
    "videos_max": 5,
    "questions_used": 0,
    "questions_max": 10,
    "unlimited": false
  }
}
```

**Timing:** this can take 2-20 seconds depending on video length. Show a loading indicator.

`status` is either `"ingested"` (fresh, took time) or `"cached"` (instant, already in the system).

**Error response (all errors follow this shape):**
```json
{
  "error": "No transcript available for this video.",
  "code": "NO_TRANSCRIPT"
}
```

**Error codes and HTTP statuses:**

| Code | HTTP | Meaning |
|---|---|---|
| `INVALID_URL` | 400 | Not a valid YouTube URL |
| `NO_TRANSCRIPT` | 400 | Video has no captions |
| `VIDEO_UNAVAILABLE` | 400 | Video removed or private |
| `DURATION_EXCEEDED` | 403 | Video longer than 60 min (free tier) |
| `VIDEO_LIMIT` | 403 | 5 videos already loaded |
| `INTERNAL_ERROR` | 500 | Unexpected failure |

---

### 3.3 GET /api/videos

**When to call:** to refresh the video list (after load, delete, or on reconnect).

**Response:**
```json
{
  "session_id": "abc-123",
  "videos": [
    {
      "video_id": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "channel": "Rick Astley",
      "duration_display": "3:31",
      "selected": true
    },
    {
      "video_id": "e-gwvmhyU7A",
      "title": "Aravind Srinivas: Perplexity CEO...",
      "channel": "Lex Fridman",
      "duration_display": "3:02:06",
      "selected": true
    }
  ],
  "limits": {
    "videos_loaded": 2,
    "videos_max": 5,
    "questions_used": 3,
    "questions_max": 10,
    "unlimited": false
  }
}
```

---

### 3.4 DELETE /api/videos/{video_id}

**When to call:** user clicks remove/delete on a video.

**Response:**
```json
{
  "session_id": "abc-123",
  "removed": "dQw4w9WgXcQ",
  "limits": {
    "videos_loaded": 1,
    "videos_max": 5,
    "questions_used": 3,
    "questions_max": 10,
    "unlimited": false
  }
}
```

---

### 3.5 PATCH /api/videos/{video_id}

**When to call:** user toggles a video checkbox (select/deselect which videos to query).

**Request:**
```json
{
  "selected": false
}
```

**Response:**
```json
{
  "session_id": "abc-123",
  "video_id": "dQw4w9WgXcQ",
  "selected": false
}
```

---

### 3.6 POST /api/ask

**When to call:** user submits a question in the chat input.

**Request:**
```json
{
  "question": "What do they say about Perplexity AI?"
}
```

**Response:**
```json
{
  "session_id": "abc-123",
  "answer": "Based on the video, at [1:53](https://youtu.be/e-gwvmhyU7A?t=113) they describe Perplexity as an \"answer engine\" that combines search with LLMs...",
  "tool_used": "vector_search",
  "limits": {
    "videos_loaded": 1,
    "videos_max": 5,
    "questions_used": 4,
    "questions_max": 10,
    "unlimited": false
  }
}
```

**Timing:** 5-40 seconds depending on the tool used. Show a "thinking" indicator.

**The `answer` field contains markdown** with clickable timestamp links like `[3:00-4:30](https://youtu.be/...?t=180)`. Render this as markdown in the chat bubble.

**Possible `tool_used` values:** `vector_search`, `summarize_video`, `list_topics`, `compare_videos`, `get_metadata`.

**Error codes:**

| Code | HTTP | Meaning |
|---|---|---|
| `QUESTION_LIMIT` | 403 | 10 questions reached |
| `NO_VIDEOS` | 400 | No videos loaded |
| `QUESTION_TOO_LONG` | 400 | Over 500 characters |
| `INTERNAL_ERROR` | 500 | Agent failure |

---

### 3.7 POST /api/auth

**When to call:** user enters an access key.

**Request:**
```json
{
  "key": "ASKTHEVIDEO2026"
}
```

**Response (valid):**
```json
{
  "session_id": "abc-123",
  "valid": true,
  "limits": {
    "videos_loaded": 1,
    "videos_max": null,
    "questions_used": 4,
    "questions_max": null,
    "unlimited": true
  }
}
```

When `unlimited` is `true`, `videos_max` and `questions_max` are `null` (no limit). The UI should show "Unlimited" instead of "X/10".

**Response (invalid):**
```json
{
  "session_id": "abc-123",
  "valid": false
}
```

Do not show a specific error message for invalid keys. Just indicate the key was not accepted.

---

### 3.8 GET /api/history

**When to call:** on reconnect or page refresh (if session still alive).

**Response:**
```json
{
  "session_id": "abc-123",
  "messages": [
    { "role": "user", "content": "What is this video about?" },
    { "role": "assistant", "content": "This video covers..." }
  ]
}
```

Returns empty `messages` array if no history.

---

## 4. Limits object

Every response that modifies state includes a `limits` object. Use this to update the UI counters.

```typescript
interface Limits {
  videos_loaded: number;
  videos_max: number | null;    // null = unlimited
  questions_used: number;
  questions_max: number | null;  // null = unlimited
  unlimited: boolean;
}
```

### UI rules based on limits

| Condition | UI behaviour |
|---|---|
| `videos_loaded >= videos_max` (and not unlimited) | Disable "Load Video" button, show message |
| `questions_used >= questions_max` (and not unlimited) | Disable chat input, show upgrade prompt |
| `unlimited === true` | Show "Unlimited" badge, no counters |
| `questions_max - questions_used <= 2` | Show warning "2 questions remaining" |

---

## 5. UI states and corresponding API calls

### App startup
1. `GET /api/status` -- wake backend, get session ID
2. If session exists: `GET /api/videos` + `GET /api/history` to restore state
3. If no session: show welcome screen

### User loads a video
1. Show loading spinner
2. `POST /api/videos` with URL
3. On success: add video to sidebar list, update limits
4. On error: show error message (use `error` field from response)

### User asks a question
1. Add user message to chat immediately (optimistic UI)
2. Show "thinking" indicator in assistant bubble
3. `POST /api/ask` with question
4. On success: replace thinking indicator with answer, update limits
5. On error: show error in chat

### User removes a video
1. `DELETE /api/videos/{video_id}`
2. On success: remove from sidebar, update limits

### User toggles video selection
1. `PATCH /api/videos/{video_id}` with `{ "selected": true/false }`
2. Update checkbox state

### User enters access key
1. `POST /api/auth` with key
2. If valid: update limits display, show "Unlimited" badge
3. If invalid: subtle feedback (shake animation or brief message), clear input

---

## 6. Markdown rendering in chat

Assistant responses contain markdown with timestamp links. Example:

```markdown
Based on the video at [1:53-3:45](https://youtu.be/e-gwvmhyU7A?t=113), the speaker explains that Perplexity works as an "answer engine."

Key points:
1. **Citation-backed answers** [5:58](https://youtu.be/e-gwvmhyU7A?t=358)
2. **Knowledge discovery** rather than search [7:14](https://youtu.be/e-gwvmhyU7A?t=434)
```

Requirements:
- Render markdown (bold, lists, headings)
- Timestamp links must be clickable and open in a new tab (`target="_blank"`)
- Link colour should be the accent colour from the design system
- Code blocks and inline code should be styled if they appear

Recommended: use a markdown rendering library like `react-markdown` or `marked`.

---

## 7. Error handling pattern

```typescript
try {
  const data = await apiCall('POST', '/api/ask', { question });
  // Handle success
} catch (err) {
  if (err.code === 'QUESTION_LIMIT') {
    // Show upgrade prompt
  } else if (err.code === 'NO_VIDEOS') {
    // Prompt user to load a video
  } else {
    // Generic error display using err.error message
  }
}
```

All errors return `{ "error": "...", "code": "..." }`. The `error` field is human-readable and safe to display. The `code` field is for programmatic handling.

---

## 8. Design consistency notes

- The landing page and this app share the same colour palette
- Dark theme throughout, no light mode
- Accent colour for interactive elements (buttons, links, active states)
- Chat timestamp links should use the accent colour
- Loading spinners should use the accent colour
- British English in all UI copy ("summarise", "colour", etc.)
- Never use em dashes in any text
