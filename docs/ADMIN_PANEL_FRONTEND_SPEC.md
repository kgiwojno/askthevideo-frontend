# AskTheVideo -- Admin Panel Frontend Specification

## For: Lovable / Claude (build admin page in React app)

---

## 1. Overview

The admin panel is a protected route (`/admin`) within the React app. It shows real-time application metrics, API costs, session stats, Pinecone status, and an event log. It is for the developer only, not end users.

**Access:** user navigates to `/admin` and enters a token. No link to admin exists anywhere in the main UI.

---

## 2. Authentication

Simple token-based access. No user accounts.

### Flow

1. User navigates to `/admin`
2. Show a token input screen (dark, minimal, just an input field and submit button)
3. User enters the token
4. `POST /api/admin/auth` with the token
5. If valid: show the dashboard, store token in React state (not localStorage)
6. If invalid: show "Invalid token", stay on input screen

```typescript
const [adminToken, setAdminToken] = useState<string | null>(null);
const [authenticated, setAuthenticated] = useState(false);

async function authenticateAdmin(token: string) {
  const res = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  if (data.valid) {
    setAdminToken(token);
    setAuthenticated(true);
  }
}
```

All subsequent admin API calls include the token as a header:
```
X-Admin-Token: dupa.8
```

---

## 3. Dashboard layout

Single page, no sidebar. Full-width. Dark theme matching the main app.

### 3.1 Header

```
🔧 AskTheVideo — Admin Dashboard                    [🔄 Refresh]
```

Manual refresh button in the top right. Auto-refresh every 30 seconds.

### 3.2 Row 1: Real-time metrics (4 cards)

| Card | Value | Format |
|---|---|---|
| Active Sessions | number | e.g., "3" |
| RAM Usage | MB / 512 MB | e.g., "340 / 512 MB" |
| CPU | percentage | e.g., "12.3%" |
| Uptime | hours | e.g., "4.2h" |

### 3.3 Row 2: Session stats (4 cards)

| Card | Value | Format |
|---|---|---|
| Total Queries | number | e.g., "127" |
| Videos Loaded | number | e.g., "34" |
| Key Queries | number | e.g., "15" (unlimited key usage) |
| Errors / Alerts | two numbers | e.g., "2 / 3" |

### 3.4 Row 3: API cost estimate (4 cards)

| Card | Value | Format |
|---|---|---|
| Input Tokens | formatted number | e.g., "245,230" |
| Output Tokens | formatted number | e.g., "38,410" |
| Estimated Cost | USD | e.g., "$1.31" |
| Budget Remaining | USD with colour | green > $2, yellow > $0.50, red <= $0.50 |

### 3.5 Row 4: Pinecone stats (3 cards)

| Card | Value | Format |
|---|---|---|
| Cached Videos | number | e.g., "42" (namespaces in Pinecone) |
| Total Vectors | formatted number | e.g., "3,150" |
| Index Fullness | percentage | e.g., "1.2%" (of 100K vector limit) |

### 3.6 Row 5: Recent events (table/log)

A scrollable table or monospace log showing the last 50 events. Each row:

```
2026-03-09 14:25:01 | QUERY   | free   | 83.12.x.x  | "what does the video say ab..."
2026-03-09 14:24:30 | VIDEO   | cache  | 83.12.x.x  | "Python Tutorial" | dQw4w9...
2026-03-09 14:23:55 | SESSION | start  | 83.12.x.x  | active=4
2026-03-09 14:20:10 | KEY     | query  | 91.45.x.x  | "compare videos on..." | count=5
2026-03-09 14:15:22 | ERROR   | TRANS  | 83.12.x.x  | PineconeException: timeout
2026-03-09 14:15:22 | ALERT   | disc.  | —          | Pinecone timeout alert sent
```

**Columns:** Timestamp, Type, Subtype, IP, Detail

**Event types and colour coding:**

| Type | Colour | Meaning |
|---|---|---|
| QUERY | default/white | Normal user question |
| VIDEO | blue/accent | Video loaded (cache or new) |
| SESSION | grey/muted | Session start/end |
| KEY | yellow/amber | Unlimited key usage |
| ERROR | red | Error occurred |
| ALERT | orange | Discord alert sent |

### 3.7 Row 6: External dashboard links

A row of buttons/links opening in new tabs:

- [LangSmith](https://eu.smith.langchain.com) -- traces and agent debugging
- [Koyeb](https://app.koyeb.com) -- container health and deploys
- [Google Analytics](https://analytics.google.com) -- traffic
- [Discord](https://discord.com) -- alerts channel

### 3.8 Footer

```
Auto-refresh: 30s | Last updated: 14:25:01
```

Small, muted text at the bottom.

---

## 4. Auto-refresh

Poll `GET /api/admin/metrics` every 30 seconds. Update all cards and the event log.

```typescript
useEffect(() => {
  if (!authenticated) return;

  const fetchMetrics = async () => {
    const data = await fetch('/api/admin/metrics', {
      headers: { 'X-Admin-Token': adminToken },
    }).then(r => r.json());
    setMetrics(data);
  };

  fetchMetrics();
  const interval = setInterval(fetchMetrics, 30000);
  return () => clearInterval(interval);
}, [authenticated, adminToken]);
```

The manual refresh button calls the same fetch immediately.

---

## 5. API endpoints

### POST /api/admin/auth

**Request:**
```json
{
  "token": "dupa.8"
}
```

**Response (valid):**
```json
{
  "valid": true
}
```

**Response (invalid):**
```json
{
  "valid": false
}
```

### GET /api/admin/metrics

**Headers:** `X-Admin-Token: dupa.8`

**Response:**
```json
{
  "realtime": {
    "active_sessions": 3,
    "ram_mb": 340.5,
    "ram_max_mb": 512,
    "cpu_percent": 12.3,
    "uptime_hours": 4.2
  },
  "sessions": {
    "total_queries": 127,
    "total_videos_loaded": 34,
    "key_queries": 15,
    "error_count": 2,
    "alert_count": 3
  },
  "cost": {
    "total_input_tokens": 245230,
    "total_output_tokens": 38410,
    "estimated_cost": 1.31,
    "budget_total": 5.00,
    "budget_remaining": 3.69
  },
  "pinecone": {
    "cached_videos": 42,
    "total_vectors": 3150,
    "index_fullness_percent": 1.2
  },
  "events": [
    {
      "timestamp": "2026-03-09 14:25:01",
      "type": "QUERY",
      "subtype": "free",
      "ip": "83.12.x.x",
      "detail": "\"what does the video say ab...\""
    }
  ],
  "last_updated": "2026-03-09T14:25:01Z"
}
```

**If token is invalid:** returns `403 Forbidden`.

---

## 6. Design

- Same dark theme as the main app
- Use cards/tiles for metric groups (rows 1-4)
- Cards should be compact, with the value large and the label smaller
- Event log: use a monospace font, scrollable container, max height ~400px
- Budget remaining card: conditional background or text colour based on value
- Responsive: on mobile, cards stack 2x2 instead of 4-across
- No animations needed, keep it simple and fast
- Admin token input screen: centred on page, minimal, just the input and a button

---

## 7. Route structure

```
/              → Main app (chat UI)
/admin         → Admin panel (token-protected)
```

Use React Router. The `/admin` route is completely separate from the main app layout (no sidebar, no chat).

---

## 8. What NOT to build

- No user management or permissions (single token only)
- No data export from admin panel
- No ability to modify settings from admin panel (read-only)
- No persistent admin sessions (token cleared on page refresh)
- No link to admin from the main app UI
