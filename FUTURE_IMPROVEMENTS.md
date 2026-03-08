# Future Improvements

## UI / UX

- **Export Chat as Markdown**: Download button that exports chat history as a `.md` file. Pure frontend, no API needed. Useful for saving research sessions.
- **Video Thumbnail Display**: Show thumbnail next to each video in the sidebar. Fetch client-side via YouTube oEmbed endpoint (no API dependency).
- **Voice Input**: Mic button next to chat input using Web Speech API (`SpeechRecognition`). Transcript fills the input field. Graceful degradation — button only shown if browser supports it (Chrome/Edge/Safari). Firefox users simply don't see it.
- **Voice Output (Read Aloud)**: Small speaker icon on each assistant message bubble using `SpeechSynthesis` API. Free TTS, no backend. Graceful degradation like voice input.
- **Streaming Responses (SSE)**: Stream answers word-by-word via Server-Sent Events instead of waiting for full response. Frontend consumes `EventSource`/`fetch` stream from `POST /api/ask`. Backend (FastAPI) SSE support handled separately by user.

## Done ✅

- ~~**"Maximum 5 Videos" Warning**~~: Visible warning banner when video limit reached.
- ~~**Connection Status Indicator**~~: "Backend unreachable" banner on offline mode.
- ~~**Loading Skeleton**~~: "Connecting…" screen on initial session load.
- ~~**Retry Logic**~~: Exponential backoff (2 retries) for transient API failures.
- ~~**Welcome Screen Enhancements**~~: Staggered animations, clickable example prompts, step indicator, radial gradient background.
