# Future Improvements

## UI / UX

- **Welcome Screen**: Replace feature grid with simpler text-based instructions matching the original spec (paste URL → ask questions flow).
- **"Maximum 5 Videos" Warning**: Add a visible warning banner when 5 videos are loaded, instead of only disabling the button silently.

## API Integration

- **Connection Status Indicator**: Show a visual indicator when the FastAPI backend is unreachable (degraded mode).
- **Loading Skeleton**: Add a skeleton/spinner on initial app load while the session is being established via `GET /api/status`.
- **Retry Logic**: Add automatic retry with exponential backoff for transient API failures.

## Cleanup

- Remove `streamlit/` directory and related files (`STREAMLIT_APP_SPEC`, `STREAMLIT_DESIGN_SPEC`, etc.) — no longer needed after switching to React + FastAPI.
