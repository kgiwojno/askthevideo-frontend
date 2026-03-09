# Future Improvements

## Planned

_No planned improvements at this time._

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
