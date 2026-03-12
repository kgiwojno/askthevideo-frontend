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

## 2026-03-12

### Features
- **Added 2 demo videos** (`src/lib/demo-config.ts`): Added "Tim Minchin - UWA Address" (pos 2) and "3Blue1Brown - Gradient descent, how neural..." (between the two existing 3Blue1Brown entries).
- **Admin event log local timezone** (`src/components/admin/EventLog.tsx`): Timestamps are now converted from UTC to the user's local timezone. Displays in friendly format (e.g., "Mar 12 10:12:31" instead of raw ISO 8601).
- **Admin event log table header** (`src/components/admin/EventLog.tsx`): Added column headers (Time, Type, Subtype, IP, Detail) with the user's timezone shown in the Time column (e.g., "Time (Europe/Warsaw)").
