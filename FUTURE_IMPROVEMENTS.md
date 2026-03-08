# Future Improvements

## UI / UX

- **Welcome Screen**: Replace feature grid with simpler text-based instructions matching the original spec (paste URL → ask questions flow).

## Cleanup

- Remove `streamlit/` directory and related files (`STREAMLIT_APP_SPEC`, `STREAMLIT_DESIGN_SPEC`, etc.) — no longer needed after switching to React + FastAPI.

## Done ✅

- ~~**"Maximum 5 Videos" Warning**~~: Visible warning banner when video limit reached.
- ~~**Connection Status Indicator**~~: "Backend unreachable" banner on offline mode.
- ~~**Loading Skeleton**~~: "Connecting…" screen on initial session load.
- ~~**Retry Logic**~~: Exponential backoff (2 retries) for transient API failures.
