# Future Improvements

## Planned

- **Bundle Size Optimization**: The production JS bundle exceeds 500 KB (593 KB). Add `build.rollupOptions.output.manualChunks` in `vite.config.ts` to split heavy dependencies (`recharts`, `react-markdown`, `framer-motion`, `@radix-ui/*`) into separate chunks for better loading performance.
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
