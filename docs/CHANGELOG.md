# Changelog

## 2026-03-10

### Documentation
- **Created `README.md`**: Full project README for GitHub with tech stack, features, project structure, setup instructions, API endpoints, and link to backend repo.
- **Added build & deploy workflow to README**: Documented that the frontend must be built and copied into the backend repo for Docker deployment, including the `update_frontend.sh` script and expected directory layout.
- **Documented project findings in `FUTURE_IMPROVEMENTS.md`**: Added categorized list of issues and improvements (Critical, Worth Fixing, Cleanup, Minor) after a full project review.
- **Created `CHANGELOG.md`**: This file, to track changes made to the project.

### Features
- **Hide Access Key section when unlimited** (`src/components/app/AppSidebar.tsx`): The entire Access Key collapsible section is now hidden once the user has unlimited access, instead of staying visible.
- **Added 2 demo videos** (`src/lib/demo-config.ts`): Added "Andrej Karpathy - Intro to Large Language Models" and "Andrej Karpathy - Let's build GPT: from scra..." to demo shortcuts.
- **Added demo label character limit comment** (`src/lib/demo-config.ts`): Documented the 52-character max for video labels to prevent overflow in the DemoModal.

### Updates
- **Updated "Powered by" footer** (`src/components/app/AppSidebar.tsx`): Changed from "Powered by Claude Sonnet 4.6 & Pinecone" to a two-line format: "Powered by Claude Sonnet 4.6 · Pinecone / LangChain · LangGraph · Koyeb".
- **Updated browserslist database**: Ran `npm update caniuse-lite` to suppress the outdated browserslist build warning.
- **Moved completed items in `FUTURE_IMPROVEMENTS.md`**: All items under Planned were already done — moved them to the Done section.

### Bug Fixes
- **Added Error Boundary** (`src/components/ErrorBoundary.tsx`, `src/App.tsx`): Wraps all routes so a component crash shows a recovery UI with a reload button instead of a white screen.
- **Fixed thumbnail alt text** (`src/components/app/AppSidebar.tsx`): YouTube thumbnails now use `video.title` as alt text instead of empty string.
- **Added thumbnail fallback** (`src/components/app/AppSidebar.tsx`): Shows a YouTube icon on muted background when thumbnail fails to load.
- **Removed `console.error` in NotFound** (`src/pages/NotFound.tsx`): Removed unnecessary logging and unused imports.
- **localStorage try-catch** (`src/pages/Index.tsx`): Wrapped localStorage calls to handle disabled/full storage gracefully.
- **Added 60s fetch timeout** (`src/lib/api.ts`): All API calls now abort after 60 seconds. For SSE streams, timeout covers connection only — streaming runs without limit.
- **API timing monitor** (`src/lib/api.ts`): All API calls log timing to console as `[API] METHOD /path — Xms (status)`. Full history available in DevTools via `window.__apiTimings`.

### Housekeeping
- **Updated `.gitignore`**: Added `tmp/`, `bun.lock`, `bun.lockb`, and `.env*` entries.
- **Removed unused `NavLink` component**: Deleted `src/components/NavLink.tsx` — was never imported anywhere.
- **Deleted `README_lovable.md`**: Removed auto-generated Lovable boilerplate with placeholder URLs, redundant with the proper `README.md`.
- **Updated `README.md`**: Added `ErrorBoundary` to project structure, documented `docs/` and `streamlit/` directories, added Debugging section for API timing monitor.
- **Created `HANDOFF_ASKTHEVIDEO_FRONTEND.md`**: Comprehensive handoff document for final presentation preparation, covering project evolution, features, deviations from specs, what worked/didn't, technical debt, and demo talking points.
- **Reorganised documentation into `docs/`**: Moved all project docs (`CHANGELOG.md`, `FUTURE_IMPROVEMENTS.md`, `HANDOFF_ASKTHEVIDEO_FRONTEND.md`) into `docs/`. Moved original specs into `docs/spec/`. Moved Streamlit prototype and draft specs from `tmp/` into `docs/spec/streamlit/`. Removed old `streamlit/` and `tmp/` directories. Created `docs/README.md` as documentation index.
- **Deleted stale files**: Removed `bun.lock`, `bun.lockb`, `.DS_Store`, and `.README.md.swp`.

## 2026-03-15

### Features
- **Landing page links** (`src/components/app/AppSidebar.tsx`, `src/components/app/ChatArea.tsx`): Logo in sidebar now links to askthevideo.com (opens in new tab, no visual change). Welcome screen has "Learn more about AskTheVideo →" link below the subtitle.
- **Admin version info** (`src/components/admin/AdminDashboard.tsx`): Footer shows commit hash and deployment ID fetched from `/health` endpoint.
- **Deploy script** (`deploy.sh`): Interactive deploy script with menu: commit only, build & copy, commit + build, or full pipeline with Koyeb deploy. Added to `.gitignore`.

### Updates
- **SEO improvements** (`index.html`): Updated title to "AskTheVideo App — AI Video Q&A", rewrote meta description, added canonical URL, `og:url`, `og:site_name`, and `robots` meta tag.

### Bug Fixes
- **Favicon meta tag** (`index.html`): Removed incorrect `sizes="32x32"` from `.ico` link — `.ico` is a multi-size container and should not specify a single size.

## 2026-03-14

## 2026-03-13

### Features
- **Admin login rate limiting** (`src/components/admin/AdminLogin.tsx`): After 3 failed login attempts, the form locks for 30 seconds with a visible countdown. Shows "X attempts remaining" warning after first failure. Fail count and lockout expiry persisted in sessionStorage so refreshing the page doesn't bypass the lockout.
- **Author credit in sidebar** (`src/components/app/AppSidebar.tsx`): Added "Built by Krzysztof Giwojno" with LinkedIn profile link below the "Powered by" footer.
- **MIT License** (`LICENSE`): Added standard MIT License file.
- **Demo modal scroll** (`src/components/app/DemoModal.tsx`): Content area now scrolls on small screens (`max-h-[70vh] overflow-y-auto`).

### Updates
- **Updated demo questions** (`src/lib/demo-config.ts`): Renamed "Technical Details" to "Technical Concepts". Added "Compare Neurons" (compare how both videos explain what a neuron does) and "Metadata" (give me info on the videos). Total demo questions: 7.
- **Updated README** (`README.md`): Added Author, Related Repositories, AI Assistance, and License sections. Removed unused tech stack entries (React Hook Form, Zod, Recharts). Fixed `/api/status` method. Updated project structure listing.

## 2026-03-12

### Features
- **Added 2 demo videos** (`src/lib/demo-config.ts`): Added "Tim Minchin - UWA Address" (pos 2) and "3Blue1Brown - Gradient descent, how neural..." (between the two existing 3Blue1Brown entries).
- **Admin event log local timezone** (`src/components/admin/EventLog.tsx`): Timestamps are now converted from UTC to the user's local timezone. Displays in friendly format (e.g., "Mar 12 10:12:31" instead of raw ISO 8601).
- **Admin event log table header** (`src/components/admin/EventLog.tsx`): Added column headers (Time, Type, Subtype, IP, Detail) with the user's timezone shown in the Time column (e.g., "Time (Europe/Warsaw)").
- **Admin enriched event log** (`src/components/admin/EventLog.tsx`, `src/types/admin.ts`): Rewrote the event log to support enriched event objects from the backend. New columns: Tool, Latency (color-coded: green <5s, yellow 5-15s, red >15s), Tokens (formatted as "8.7k/0.5k"), Cost (computed as "$0.03"). Added TOOL event type. Smart detail rendering per event type (VIDEO shows video_id/duration/chunks, SESSION shows tier/questions/videos). Latency column is sortable (click to toggle asc/desc/off). Summary bar above the table shows avg query latency, total tokens, total query cost, and cache hit rate.
- **Admin event log filter tabs** (`src/components/admin/EventLog.tsx`): Added filter tabs above the events table: All, Queries (QUERY + KEY), Videos, Errors, Sessions. Default to All.
- **Admin cost/budget redesign** (`src/components/admin/AdminDashboard.tsx`, `src/types/admin.ts`): Replaced old budget_total/budget_remaining fields with new cycle-based budget. Shows progress bar for current $5 cycle (color-coded: green <60%, yellow 60-80%, red >80%), with cumulative total spend and total loaded below. Updated AdminCostMetrics type to match new API fields.
- **Anonymous user tracking** (`src/lib/api.ts`): On first visit, generates a UUID stored in localStorage as `atv_uid`. Sent as `X-User-ID` header on all API requests (`/api/videos`, `/api/ask`, `/api/ask/stream`) alongside the existing `X-Session-ID`.
- **Admin Users card** (`src/components/admin/AdminDashboard.tsx`, `src/types/admin.ts`): New "Users" section in admin dashboard showing Total Users, Returning Users, Avg Sessions/User, and Avg Questions/User. Added `AdminUserStats` type.
- **Admin session persistence** (`src/pages/Admin.tsx`): Admin token is now stored in `sessionStorage`. Survives page reloads without re-entering the password; cleared when the browser tab is closed. Token is re-validated with the backend on restore.
- **User session persistence** (`src/lib/api.ts`, `src/pages/Index.tsx`): Session ID is now stored in `sessionStorage`. On reload, the frontend sends the same session ID so the backend restores loaded videos, chat history, limits, and access key status. Cleared when the tab is closed. Stale sessions are detected and cleared automatically.

### Bug Fixes
- **Question input password manager misdetection** (`src/components/app/ChatArea.tsx`): Added `autoComplete="off"`, `name="question"`, `id="question-input"`, and `aria-label` to the question input field to prevent LastPass and other password managers from flagging it as a payment card field.
