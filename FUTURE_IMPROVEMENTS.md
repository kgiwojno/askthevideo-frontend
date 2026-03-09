# Future Improvements

## Planned

- **Video Selection UX Documentation**: The blue highlight on videos in the sidebar indicates "selected" videos used as context for questions. Currently there is no UI hint or tooltip explaining this to users. Add a tooltip, helper text, or onboarding hint to clarify the selection feature.
- ~~**Video Selection Backend Bug**~~: Fixed — the API now filters by `selected: true` videos when sending context to the AI.
- ~~**Bundle Size Optimization**~~: Added `manualChunks` in `vite.config.ts` to split `recharts`, `react-markdown`, `framer-motion`, and `@radix-ui/*` into separate chunks.
- **Update Browserslist DB**: Run `npx update-browserslist-db@latest` to refresh the `caniuse-lite` database and suppress the outdated browserslist build warning.

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
