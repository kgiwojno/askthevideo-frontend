# AskTheVideo Frontend — Project Handoff

This document summarises the frontend development of **AskTheVideo**, an AI-powered YouTube video Q&A application. Use this as context for preparing the final presentation and commercial materials.

---

## 1. Project Overview

**AskTheVideo** lets users paste YouTube video URLs and ask AI-powered questions about video content. The AI uses video transcripts stored in a Pinecone vector database and answers with context-aware responses including clickable timestamp links.

- **Frontend repo**: https://github.com/kgiwojno/askthevideo-frontend
- **Backend repo**: https://github.com/kgiwojno/askthevideo

### Architecture

The frontend is a React SPA that is built as static files and bundled into the backend's Docker container. The backend (FastAPI) serves both the API and the frontend from a single Koyeb deployment.

```
User Browser
    ↓
Koyeb (Docker Container)
    ├── FastAPI backend (/api/*)
    │   ├── Claude Sonnet 4.6 (LLM via LangChain/LangGraph)
    │   └── Pinecone (vector DB for transcripts)
    └── React frontend (static files)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Animations | Framer Motion |
| Routing | React Router |
| AI/LLM | Claude Sonnet 4.6 (via backend) |
| Vector DB | Pinecone (via backend) |
| Orchestration | LangChain + LangGraph (via backend) |
| Hosting | Koyeb (Docker) |
| Analytics | Google Analytics |

---

## 2. Evolution of the Frontend

The frontend went through three distinct phases:

### Phase 1: Streamlit Prototype
- Initial prototype built with Streamlit (Python), chosen for fast prototyping with the same language as the FastAPI backend
- Delivered a working app skeleton (`app.py`), custom CSS overrides, HTML snippets, design tokens, and layout guides
- Validated the core concept: paste a YouTube URL, ask questions, get AI answers
- **Why it was abandoned**:
  - No SSE streaming support — could not show word-by-word AI responses
  - Limited layout control — sidebar/chat layout was rigid, no custom component placement
  - No voice I/O — Web Speech API not accessible from Streamlit
  - Poor mobile experience — responsive design options were minimal
  - CSS workarounds — required extensive `!important` overrides and injected HTML for basic styling
  - No client-side routing — could not support a separate `/admin` dashboard route
- All Streamlit assets preserved in `docs/spec/streamlit/` for project history

### Phase 2: React Scaffold via Lovable
- Used Lovable (AI code generation tool) to scaffold the React app
- Generated the initial component structure, routing, and shadcn/ui setup
- Provided a working starting point but required significant manual work
- Side effect: scaffolded ~40+ shadcn/ui components that were never used (still present as file clutter, but tree-shaken from the bundle)
- The auto-generated `README_lovable.md` was later removed as it was outdated

### Phase 3: Manual Development & Polish
- All feature implementation done manually with Claude Code assistance
- API integration written from scratch based on custom specs (`docs/spec/REACT_FRONTEND_SPEC.md`, `docs/spec/ADMIN_PANEL_FRONTEND_SPEC.md`)
- Iterative improvements tracked in `docs/FUTURE_IMPROVEMENTS.md`
- Final hardening pass (error boundary, timeouts, accessibility, timing monitor)
- Documentation consolidated into `docs/` with original specs in `docs/spec/`

---

## 3. Features Implemented

### Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| YouTube Video Loading | Paste URL, extract transcript, show thumbnail | Done |
| AI Chat Interface | Ask questions, get markdown answers with timestamps | Done |
| Streaming Responses (SSE) | Word-by-word streaming with automatic fallback to non-streaming | Done |
| Video Selection | Click videos to select/deselect which ones the AI uses as context | Done |
| Access Key System | Free tier (5 videos, 10 questions) with unlimited access key | Done |
| Chat Export | Download conversation history as `.md` file | Done |

### UX Features
| Feature | Description | Status |
|---------|-------------|--------|
| Voice Input | Mic button using Web Speech API for dictation | Done |
| Voice Output | Speaker icon to read AI answers aloud via SpeechSynthesis | Done |
| Demo Mode | Press `D` for keyboard shortcuts to quickly load preset videos/questions | Done |
| Mobile Responsive | Drawer sidebar, touch-friendly UI, responsive breakpoints | Done |
| Welcome Screen | Animated landing with clickable example prompts, step indicators, and link to landing page | Done |
| Offline Handling | Connection status banner with retry logic (exponential backoff) | Done |

### Admin Dashboard (`/admin`)
| Feature | Description | Status |
|---------|-------------|--------|
| Token Auth | Token-based login, persisted in sessionStorage across reloads, rate-limited (3 attempts / 30s lockout) | Done |
| Real-time Metrics | Active sessions, CPU, RAM, uptime | Done |
| Session Stats | Total queries, videos loaded, errors, alerts | Done |
| User Stats | Total users, returning users, avg sessions/user, avg questions/user | Done |
| Cost Tracking | Token usage, estimated cost, cycle-based budget with progress bar | Done |
| Pinecone Stats | Cached videos, total vectors, index fullness | Done |
| Event Log | Enriched log with filter tabs, sortable latency, tokens, cost, summary bar | Done |
| External Links | Quick access to LangSmith, Koyeb, GA, Discord | Done |
| Auto-refresh | Polls metrics every 30 seconds | Done |
| Version Info | Footer shows commit hash and deployment ID from `/health` endpoint | Done |

### Session Persistence
| Feature | Description | Status |
|---------|-------------|--------|
| User Session | Session ID stored in sessionStorage; reloads restore videos, chat, limits, access key | Done |
| Admin Session | Admin token stored in sessionStorage; re-validated on reload | Done |
| Stale Session Handling | If backend doesn't recognise session ID, clears storage and starts fresh | Done |
| Anonymous User Tracking | UUID (`atv_uid`) in localStorage, sent as `X-User-ID` header for analytics | Done |

### Resilience & Monitoring
| Feature | Description | Status |
|---------|-------------|--------|
| Error Boundary | Crash recovery UI with reload button | Done |
| 60s Fetch Timeout | All API calls abort after 60 seconds | Done |
| API Timing Monitor | Console logging + `window.__apiTimings` for debugging | Done |
| Retry Logic | Exponential backoff (2 retries, 1s base delay) | Done |
| Thumbnail Fallback | YouTube icon shown when thumbnail fails to load | Done |
| Input Field Identity | Question input has `autoComplete="off"`, `name`, `id`, `aria-label` to prevent password manager misdetection | Done |

### SEO & Cross-linking
| Feature | Description | Status |
|---------|-------------|--------|
| Meta Tags | Title, description, canonical, og:url, og:site_name, robots | Done |
| Logo Link | Sidebar logo links to askthevideo.com landing page (new tab) | Done |
| Welcome Link | "Learn more about AskTheVideo →" on welcome screen | Done |

---

## 4. Deviations from Original Specs

### From Streamlit to React
- **Original plan**: Streamlit frontend
- **What changed**: Switched to React for better UX, streaming support, and mobile responsiveness
- **Impact**: Significantly better product but required more development time

### From Original Frontend Spec
- **Spec said `GET /api/status`**: Implementation uses `POST /api/status` instead
- **Spec suggested `useState` for session ID**: Implementation uses a module-level variable in `api.ts` for simpler cross-component access
- **Spec didn't mention SSE streaming**: Added `POST /api/ask/stream` endpoint with SSE and automatic fallback to `POST /api/ask`
- **Spec didn't mention voice features**: Added voice input (speech recognition) and voice output (speech synthesis) as UX enhancements
- **Spec didn't mention demo mode**: Added keyboard shortcut system for presentations
- **Spec said British English**: Mixed usage in practice (not strictly enforced)

### From Admin Panel Spec
- **Spec included Pinecone link**: Implementation added additional external links (LangSmith, Koyeb, Discord)
- **Spec said "no data export"**: Chat export was added for the main app (not admin)
- **Spec said "no persistent sessions"**: Admin token is now persisted in sessionStorage for convenience
- **Spec didn't include enriched event log**: Added Tool, Latency, Tokens, Cost columns; filter tabs; summary bar; sortable columns
- **Spec didn't include user tracking**: Added anonymous user tracking (`X-User-ID` header) and Users card in admin dashboard
- **Spec used flat budget**: Replaced with cycle-based budget system ($5 cycles with progress bar)

---

## 5. What Worked Well

- **SSE Streaming**: Dramatically improves perceived performance. Users see the answer forming word-by-word instead of waiting 5-40 seconds for a full response.
- **Demo Mode**: Invaluable for presentations. Press `D`, then number keys to quickly load videos and fire questions without typing URLs.
- **shadcn/ui + Tailwind**: Fast UI development with consistent styling. Dark theme out of the box.
- **Vite**: Fast builds (~2.3s production build), great DX with hot reload.
- **Video Selection UX**: Clicking videos to toggle context is intuitive once explained via the one-time toast tip.
- **Error Boundary**: Simple addition that prevents the entire app from crashing on unexpected errors.
- **API Timing Monitor**: Zero-overhead debugging tool that logs all API call durations to the console.

---

## 6. What Didn't Work / Challenges

- **Streamlit prototype**: Abandoned after building a working skeleton with custom CSS and HTML injection. While it validated the concept quickly, the lack of SSE streaming, voice APIs, client-side routing, and mobile responsiveness made it unsuitable for production. The switch to React required rewriting the entire frontend but resulted in a significantly better product. All Streamlit work is preserved in `docs/spec/streamlit/`.
- **Lovable scaffold**: Generated ~40+ unused shadcn/ui components that add file clutter (not bundle size, since Vite tree-shakes them). The boilerplate README was outdated and had to be removed.
- **Web Speech API**: Browser support is inconsistent. Works well in Chrome, limited or unavailable in Firefox/Safari. No graceful degradation was built.
- **`browserslist-db` update tool**: Tried `npx update-browserslist-db@latest` but it failed because it detected the `bun.lock` file and tried to use bun (not installed). Workaround: used `npm update caniuse-lite` directly.
- **TypeScript strict mode**: Disabled (`noImplicitAny: false`, `strictNullChecks: false`) to move faster. This reduces type safety but was a deliberate trade-off for development speed.
- **Test coverage**: Only a dummy test exists. No unit or integration tests were written due to time constraints. This is a known gap.

---

## 7. Known Limitations & Technical Debt

### Deferred Cleanup (not blocking, low priority)
- ~40+ unused shadcn/ui component files in `src/components/ui/`
- TypeScript strict mode and ESLint `no-unused-vars` are disabled
- No real test coverage
- Google Analytics ID and external admin URLs are hardcoded (acceptable for single-deployment setup)

### Browser Compatibility
- Voice features depend on Web Speech API (Chrome-centric)
- Uses `crypto.randomUUID()` (not available in older browsers)
- No explicit polyfills or browser support matrix defined

---

## 8. Key Metrics & Numbers

- **Production build size**: ~671 KB total JS (gzipped: ~207 KB), split across 6 chunks
- **Build time**: ~2.3 seconds
- **API timeout**: 60 seconds (connection), unlimited for SSE streaming
- **Free tier limits**: 5 videos, 10 questions per session
- **Admin auto-refresh**: Every 30 seconds
- **Retry logic**: 2 retries with exponential backoff (1s, 2s delays)
- **Demo shortcuts**: 10 preset videos, 7 preset questions

---

## 9. Documentation Structure

All documentation lives in `docs/`, with original planning specs in `docs/spec/`. See `docs/README.md` for a full guide.

```
docs/
├── README.md                           # Documentation index
├── HANDOFF_ASKTHEVIDEO_FRONTEND.md     # This document
├── CHANGELOG.md                        # All changes made during development
├── FUTURE_IMPROVEMENTS.md              # Tracked issues, completed items, deferred decisions
└── spec/                               # Original planning documents (pre-build)
    ├── REACT_FRONTEND_SPEC.md          # Frontend API integration spec (11 endpoints)
    ├── ADMIN_PANEL_FRONTEND_SPEC.md    # Admin dashboard spec
    └── streamlit/                      # Abandoned Streamlit prototype
        ├── app.py                      # Working app skeleton
        ├── css_overrides.py            # CSS injection for Streamlit
        ├── html_snippets.py            # HTML template strings
        ├── favicon.png                 # App favicon
        ├── .streamlit/config.toml      # Theme config
        ├── DESIGN_TOKENS.md            # Colour palette, typography
        ├── LAYOUT_GUIDE.md             # Layout reference
        ├── STREAMLIT_APP_SPEC-2.md     # Draft app spec (v2)
        └── STREAMLIT_DESIGN_SPEC-2.md  # Draft design spec (v2)
```

### Other Root Files

| File | Purpose |
|------|---------|
| `README.md` | Project documentation for GitHub |
| `update_frontend.sh` | Build and copy script for deploying to backend repo |

---

## 10. Presentation Talking Points

### Value Proposition
- Ask natural language questions about any YouTube video
- Get AI-powered answers with clickable timestamp links
- Multi-video context: load up to 5 videos and compare them
- Real-time streaming responses for immediate feedback

### Technical Highlights
- Full-stack AI application: React + FastAPI + Claude + Pinecone + LangGraph
- Production-grade: error handling, timeouts, retry logic, monitoring
- SSE streaming for real-time AI responses
- Voice I/O for hands-free interaction
- Admin dashboard for live monitoring and cost tracking
- Deployed as a single Docker container on Koyeb

### Demo Flow (Recommended)
1. Open the app, show the welcome screen
2. Press `D` to open demo shortcuts
3. Load a video (e.g., key `1` for Rick Astley or key `3` for Andrej Karpathy)
4. Ask a question (e.g., key `4` for summary)
5. Show the streaming response with timestamp links
6. Load a second video, demonstrate video selection (click to toggle)
7. Ask a comparison question (key `8`)
8. Show voice input (mic button) and voice output (speaker icon)
9. Export chat as markdown
10. Show admin dashboard at `/admin`
