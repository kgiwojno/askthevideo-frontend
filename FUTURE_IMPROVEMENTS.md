# Future Improvements

## Planned

### Critical

_All critical items resolved._

### Worth Fixing

_All worth-fixing items resolved._

### Cleanup
- **Unused shadcn/ui components**: ~40+ UI components installed but never used (accordion, calendar, carousel, checkbox, etc.). Adds to bundle size.
- **TypeScript strict mode disabled**: `tsconfig.json` has `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters` all set to `false`.
- **ESLint `no-unused-vars` disabled**: `eslint.config.js:23` — unused variables won't be detected.
- **No real tests**: `src/test/example.test.ts` only contains a dummy test. No coverage for API, components, or app logic.

### Minor

_All minor items reviewed and deferred — no action needed._

- **Hardcoded Google Analytics ID**: `index.html:26` — deferred, GA ID is always the same since frontend is bundled into the backend Docker container.
- **Hardcoded external URLs in admin**: `AdminDashboard.tsx` — deferred, these are stable service links only visible in admin panel.
- **Legacy directories**: `streamlit/` and `docs/` — kept intentionally to preserve project history from earlier design phases.

## Done ✅

- ~~**Streaming Responses (SSE)**~~: Word-by-word streaming via SSE with automatic fallback to non-streaming.
- ~~**Export Chat as Markdown**~~: Download button that exports chat history as a `.md` file.
- ~~**Video Thumbnail Display**~~: Show thumbnail next to each video in the sidebar.
- ~~**Voice Input**~~: Mic button next to chat input using Web Speech API.
- ~~**Voice Output (Read Aloud)**~~: Speaker icon on assistant message bubbles using `SpeechSynthesis` API.
- ~~**"Maximum 5 Videos" Warning**~~: Visible warning banner when video limit reached.
- ~~**Connection Status Indicator**~~: "Backend unreachable" banner on offline mode.
- ~~**Loading Skeleton**~~: "Connecting…" screen on initial session load.
- ~~**Retry Logic**~~: Exponential backoff (2 retries) for transient API failures.
- ~~**Welcome Screen Enhancements**~~: Staggered animations, clickable example prompts, step indicator, radial gradient background.
- ~~**Video Selection UX Documentation**~~: Added helper text above the video list and a one-time toast notification explaining the click-to-select feature.
- ~~**Video Selection Backend Bug**~~: Fixed — the API now filters by `selected: true` videos when sending context to the AI.
- ~~**Bundle Size Optimization**~~: Added `manualChunks` in `vite.config.ts` to split `recharts`, `react-markdown`, `framer-motion`, and `@radix-ui/*` into separate chunks.
- ~~**Update Browserslist DB**~~: Updated `caniuse-lite` database to suppress the outdated browserslist build warning.
- ~~**Error Boundary**~~: Added `ErrorBoundary` component wrapping main routes in `App.tsx`. Displays a recovery UI with reload button on crash.
- ~~**Unused `NavLink` component**~~: Removed `src/components/NavLink.tsx` — was never imported anywhere.
- ~~**Thumbnail alt text**~~: `AppSidebar.tsx` now uses `video.title` as alt text on YouTube thumbnails for accessibility.
- ~~**Remove `console.error` in NotFound**~~: Removed unnecessary `console.error` and unused `useEffect`/`useLocation` from `NotFound.tsx`.
- ~~**localStorage without try-catch**~~: Wrapped `localStorage` calls in `Index.tsx` with try-catch to handle disabled/full storage gracefully.
- ~~**SSE stream missing `[DONE]` handling**~~: Already handled — `api.ts:168` calls `onDone(accumulated)` when stream ends without `[DONE]`. No change needed.
- ~~**No fetch request timeouts**~~: Added 60s timeout to all API calls via `AbortController`. For SSE streams, timeout applies to connection only — once streaming starts, it runs without limit.
- ~~**API timing monitor**~~: All API calls now log timing to console (`[API] METHOD /path — Xms`) and store entries in `window.__apiTimings` for review in DevTools.
