# Future Improvements

## UI / UX

- **Export Chat as Markdown**: Download button that exports chat history as a `.md` file. Pure frontend, no API needed. Useful for saving research sessions.
## Done ✅

- ~~**Video Thumbnail Display**~~: Show thumbnail next to each video in the sidebar.
- ~~**Voice Input**~~: Mic button next to chat input using Web Speech API.
- ~~**Voice Output (Read Aloud)**~~: Speaker icon on assistant message bubbles using `SpeechSynthesis` API.
- **Streaming Responses (SSE)**: Stream answers word-by-word via Server-Sent Events instead of waiting for full response. Frontend consumes `EventSource`/`fetch` stream from `POST /api/ask`. Backend (FastAPI) SSE support handled separately by user.

## Done ✅

- ~~**"Maximum 5 Videos" Warning**~~: Visible warning banner when video limit reached.
- ~~**Connection Status Indicator**~~: "Backend unreachable" banner on offline mode.
- ~~**Loading Skeleton**~~: "Connecting…" screen on initial session load.
- ~~**Retry Logic**~~: Exponential backoff (2 retries) for transient API failures.
- ~~**Welcome Screen Enhancements**~~: Staggered animations, clickable example prompts, step indicator, radial gradient background.
