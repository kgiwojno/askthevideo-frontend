# AskTheVideo — Streamlit Deliverables

This folder contains all the visual layer assets needed to style the Streamlit app (`app.askthevideo.com`) to match the landing page design.

---

## 📁 Folder Contents

| File | Description |
|------|-------------|
| `app.py` | Ready-to-run Streamlit app skeleton — wires together CSS, HTML snippets, sidebar, chat area, and placeholder backend functions |
| `.streamlit/config.toml` | Streamlit theme configuration (colors, font, server settings) |
| `css_overrides.py` | CSS override block injected via `st.markdown()` — covers chat bubbles, inputs, buttons, scrollbar, hidden Streamlit defaults |
| `html_snippets.py` | Ready-to-use HTML strings for sidebar title, BMC button, feedback link, footer, welcome screen, video items, badges |
| `favicon.png` | App favicon used as `page_icon` in `st.set_page_config()` |
| `LAYOUT_GUIDE.md` | Complete layout reference with code examples, state table, and Streamlit-specific tips |
| `DESIGN_TOKENS.md` | Color palette, typography, spacing, border radius, and shadows — all with hex/HSL values |

---

## 🚀 How to Use

### 1. Copy `.streamlit/config.toml`

Place the `.streamlit/` folder at the **root** of your Streamlit project (next to `app.py`):

```
your-project/
├── .streamlit/
│   └── config.toml
├── app.py
├── css_overrides.py
├── html_snippets.py
└── ...
```

Streamlit reads this file automatically on startup. No import needed.

### 2. Import CSS overrides

At the top of `app.py`, right after `st.set_page_config()`:

```python
from css_overrides import inject_custom_css

st.set_page_config(
    page_title="AskTheVideo — AI Video Q&A",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)

inject_custom_css()  # Must come right after set_page_config
```

### 3. Use HTML snippets

Import and use wherever needed:

```python
from html_snippets import (
    SIDEBAR_TITLE,
    BMC_BUTTON,
    FEEDBACK_LINK,
    SIDEBAR_FOOTER,
    WELCOME_MESSAGE,
    UNLIMITED_BADGE,
    limit_warning_html,
    video_item_html,
)

# Sidebar title
st.sidebar.markdown(SIDEBAR_TITLE, unsafe_allow_html=True)

# Welcome screen (when no videos loaded)
st.markdown(WELCOME_MESSAGE, unsafe_allow_html=True)

# Footer
st.sidebar.markdown(SIDEBAR_FOOTER, unsafe_allow_html=True)
```

### 4. Reference docs

- **`LAYOUT_GUIDE.md`** — Full sidebar and main area structure with copy-paste code blocks and a state-driven UI table
- **`DESIGN_TOKENS.md`** — Use as a reference when building custom components or adding new UI elements

---

## ⚠️ Notes

- The CSS overrides use `!important` where needed to override Streamlit's built-in styles
- HTML snippets use inline styles to avoid dependency on the CSS block for standalone rendering
- The `timestamp-link` CSS class is available for styling timestamp badges in chat responses
- Sidebar width is **not** overridden via CSS — Streamlit handles this natively and CSS overrides can break mobile responsiveness
- Streamlit's default header, footer, and hamburger menu are hidden via CSS
