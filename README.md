# AskTheVideo — Frontend

React frontend for [AskTheVideo](https://github.com/kgiwojno/askthevideo), an AI-powered app that lets you ask questions about YouTube videos and get intelligent, context-aware answers.

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Vite 7** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** (Radix UI) — component library
- **Framer Motion** — animations
- **React Router** — client-side routing
- **TanStack React Query** — server state management
- **React Hook Form** + **Zod** — form handling & validation
- **Recharts** — admin dashboard charts

## Features

- **YouTube Video Loading** — paste a URL, load transcript context (up to 5 videos)
- **AI Chat Interface** — ask questions about loaded videos with streaming (SSE) responses
- **Voice Input/Output** — dictate questions via mic, listen to answers via speech synthesis
- **Markdown Responses** — AI answers rendered as rich markdown
- **Chat Export** — download conversation history as `.md`
- **Access Key System** — free tier with usage limits, unlimited with access key
- **Admin Dashboard** (`/admin`) — session metrics, cost tracking, Pinecone stats, event log
- **Demo Mode** — press `D` for keyboard shortcuts to quickly load demo videos & questions
- **Offline Handling** — connection status banner with retry logic (exponential backoff)
- **Mobile Responsive** — drawer sidebar, touch-friendly UI

## Project Structure

```
src/
├── pages/                 # Route pages (Index, Admin, NotFound)
├── components/
│   ├── app/               # App-specific components (ChatArea, AppSidebar, etc.)
│   ├── admin/             # Admin dashboard components
│   ├── ui/                # shadcn/ui base components
│   └── ErrorBoundary.tsx  # Crash recovery UI
├── lib/
│   ├── api.ts             # API client, SSE streaming, retry logic, timing monitor
│   ├── admin-api.ts       # Admin auth & metrics API
│   └── demo-config.ts     # Demo presets (videos & questions)
├── hooks/                 # Custom hooks (speech, mobile detection, toast)
├── types/                 # TypeScript interfaces (Video, ChatMessage, Limits)
└── test/                  # Vitest test setup

docs/                      # All project documentation
├── HANDOFF_*.md           # Presentation handoff document
├── CHANGELOG.md           # Change log
├── FUTURE_IMPROVEMENTS.md # Tracked issues & improvements
└── spec/                  # Original planning specs & Streamlit prototype
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or bun

### Installation

```bash
git clone https://github.com/kgiwojno/askthevideo-frontend.git
cd askthevideo-frontend
npm install
```

### Development

```bash
npm run dev
```

Starts the dev server at `http://localhost:8080`.

The frontend expects the [backend API](https://github.com/kgiwojno/askthevideo) to be available at the same origin (all requests go to `/api/*`).

### Build & Deploy

The frontend is **not deployed independently**. It is built as static files and copied into the [backend repository](https://github.com/kgiwojno/askthevideo), which serves them from its Docker container. Both repos should be cloned side by side:

```
FinalProject/
├── askthevideo/            # backend (Docker)
│   └── frontend/           # ← built frontend files go here
└── askthevideo-frontend/   # this repo
```

A convenience script `update_frontend.sh` automates this:

```bash
./update_frontend.sh
```

It pulls the latest changes, runs a production build, and copies the `dist/` output into `../askthevideo/frontend/`. After that, rebuild and redeploy the backend Docker container to pick up the new frontend.

You can also run the steps manually:

```bash
npm run build                          # production build → dist/
cp -r dist/* ../askthevideo/frontend/  # copy into backend repo
```

Other build commands:

```bash
npm run build:dev   # development mode build
npm run preview     # preview the production build locally
```

### Lint & Test

```bash
npm run lint
npm run test
npm run test:watch
```

## API Endpoints (consumed)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/status` | Get session limits |
| `POST` | `/api/videos` | Load a video |
| `GET` | `/api/videos` | List loaded videos |
| `DELETE` | `/api/videos/:id` | Remove a video |
| `PATCH` | `/api/videos/:id` | Toggle video selection |
| `POST` | `/api/ask/stream` | Stream AI answer (SSE) |
| `POST` | `/api/ask` | Non-streaming fallback |
| `GET` | `/api/history` | Fetch chat history |
| `POST` | `/api/auth` | Validate access key |
| `POST` | `/api/admin/auth` | Admin login |
| `GET` | `/api/admin/metrics` | Admin dashboard metrics |

## Debugging

All API calls log timing to the browser console:

```
[API] POST /api/videos — 1234ms (ok)
[API] STREAM /api/ask/stream — 5678ms (ok)
```

Full timing history is available in DevTools via `window.__apiTimings`.

## Related

- **Backend**: [kgiwojno/askthevideo](https://github.com/kgiwojno/askthevideo)
