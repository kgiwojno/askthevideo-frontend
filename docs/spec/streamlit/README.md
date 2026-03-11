# AskTheVideo — Streamlit Prototype (Abandoned)

> **Status: Abandoned.** This was the initial frontend prototype, replaced by the React frontend that is now in production.

## Why Streamlit Was Chosen Initially

Streamlit offered a fast way to prototype a chat-style UI with Python, matching the FastAPI backend language. It was used to validate the core concept: paste a YouTube URL, ask questions, get AI answers.

## Why It Was Abandoned

Streamlit's limitations became clear as requirements grew:

- **No SSE streaming support** — could not show word-by-word AI responses
- **Limited layout control** — sidebar/chat layout was rigid, no custom component placement
- **No voice I/O** — Web Speech API not accessible from Streamlit
- **Poor mobile experience** — responsive design options were minimal
- **CSS workarounds** — required extensive `!important` overrides and injected HTML to achieve basic styling
- **No client-side routing** — could not support a separate `/admin` dashboard route

The React frontend solved all of these and enabled features like demo mode, keyboard shortcuts, framer-motion animations, and a full admin dashboard.

## What's in This Folder

These files represent the work done during the Streamlit phase, preserved for project history.

### Code
| File | Description |
|------|-------------|
| `app.py` | Streamlit app skeleton with sidebar, chat area, and placeholder backend calls |
| `css_overrides.py` | CSS overrides injected via `st.markdown()` to restyle Streamlit defaults |
| `html_snippets.py` | HTML template strings for sidebar title, footer, welcome screen, video items, badges |
| `favicon.png` | App favicon |
| `.streamlit/config.toml` | Streamlit theme configuration (colours, font, server settings) |

### Design Specs
| File | Description |
|------|-------------|
| `DESIGN_TOKENS.md` | Colour palette, typography, spacing, border radius, and shadows |
| `LAYOUT_GUIDE.md` | Layout reference with code examples and state-driven UI table |
| `STREAMLIT_APP_SPEC-2.md` | Draft app specification (v2) |
| `STREAMLIT_DESIGN_SPEC-2.md` | Draft design specification (v2) |
