# AskTheVideo — Streamlit Design Specification

This document defines the visual design system for the Streamlit app to ensure consistency with the landing page at askthevideo.com.

---

## 1. Color Palette

| Token              | HSL                  | Hex       | Usage                              |
|---------------------|----------------------|-----------|------------------------------------|
| Background          | 228 15% 7%          | `#0f1117` | Page background                    |
| Surface / Card      | 228 15% 10%         | `#161921` | Cards, containers, sidebar         |
| Secondary           | 228 12% 14%         | `#1f2231` | Input fields, secondary surfaces   |
| Muted               | 228 10% 18%         | `#282c3a` | Borders, dividers, hover states    |
| Primary             | 217 100% 66%        | `#60a5fa` | Buttons, links, active states      |
| Foreground          | 228 14% 90%         | `#e0e2ea` | Primary text                       |
| Muted Foreground    | 228 10% 55%         | `#808594` | Secondary text, placeholders       |
| Warm Accent         | 30 90% 55%          | `#e8922a` | Highlights, badges, warnings       |
| Success             | 142 70% 45%         | `#22c55e` | Success states, confirmations      |
| Destructive         | 0 84% 60%           | `#ef4444` | Errors, destructive actions        |

---

## 2. Typography

- **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Headings**: Bold (700), tracking tight
- **Body**: Regular (400), `#e0e2ea`
- **Secondary text**: `#808594`
- **Links**: `#60a5fa`, no underline, underline on hover

### Scale
| Element       | Size   | Weight |
|---------------|--------|--------|
| Page title    | 24px   | 700    |
| Section title | 18px   | 600    |
| Body          | 14-16px| 400    |
| Caption/label | 12-13px| 500    |

---

## 3. Streamlit Theme Config (`.streamlit/config.toml`)

```toml
[theme]
base = "dark"
primaryColor = "#60a5fa"
backgroundColor = "#0f1117"
secondaryBackgroundColor = "#161921"
textColor = "#e0e2ea"
font = "sans serif"
```

---

## 4. Custom CSS Overrides

Inject via `st.markdown(unsafe_allow_html=True)` at the top of the app:

```css
<style>
  /* Import Inter font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  /* Global font */
  html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* Main container background */
  .stApp {
    background-color: #0f1117;
  }

  /* Sidebar */
  [data-testid="stSidebar"] {
    background-color: #161921;
    border-right: 1px solid #282c3a;
  }

  /* Input fields */
  .stTextInput input,
  .stTextArea textarea,
  .stSelectbox > div > div {
    background-color: #1f2231 !important;
    border: 1px solid #282c3a !important;
    color: #e0e2ea !important;
    border-radius: 8px !important;
  }

  .stTextInput input:focus,
  .stTextArea textarea:focus {
    border-color: #60a5fa !important;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.15) !important;
  }

  /* Buttons — Primary */
  .stButton > button[kind="primary"],
  .stButton > button {
    background-color: #60a5fa !important;
    color: #0f1117 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.5rem 1.25rem !important;
    transition: opacity 0.2s ease !important;
  }

  .stButton > button:hover {
    opacity: 0.85 !important;
  }

  /* Secondary/outline buttons */
  .stButton > button[kind="secondary"] {
    background-color: transparent !important;
    color: #e0e2ea !important;
    border: 1px solid #282c3a !important;
  }

  .stButton > button[kind="secondary"]:hover {
    border-color: #60a5fa !important;
    color: #60a5fa !important;
  }

  /* Cards / Expanders */
  [data-testid="stExpander"] {
    background-color: #161921;
    border: 1px solid #282c3a;
    border-radius: 12px;
  }

  /* Tabs */
  .stTabs [data-baseweb="tab-list"] {
    gap: 4px;
    border-bottom: 1px solid #282c3a;
  }

  .stTabs [data-baseweb="tab"] {
    color: #808594;
    font-weight: 500;
    border-radius: 8px 8px 0 0;
  }

  .stTabs [aria-selected="true"] {
    color: #60a5fa !important;
    border-bottom: 2px solid #60a5fa;
  }

  /* Metrics */
  [data-testid="stMetricValue"] {
    color: #60a5fa;
    font-weight: 700;
  }

  [data-testid="stMetricLabel"] {
    color: #808594;
  }

  /* Dividers */
  hr {
    border-color: #282c3a;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #0f1117;
  }

  ::-webkit-scrollbar-thumb {
    background: #282c3a;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #808594;
  }

  /* Toast / Alerts */
  .stAlert {
    border-radius: 10px !important;
    border: 1px solid #282c3a !important;
  }

  /* Links */
  a {
    color: #60a5fa !important;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Markdown code blocks */
  code {
    background-color: #1f2231;
    color: #e0e2ea;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Spinner */
  .stSpinner > div {
    border-top-color: #60a5fa !important;
  }

  /* Progress bar */
  .stProgress > div > div {
    background-color: #60a5fa !important;
  }

  /* Chat messages (if using st.chat_message) */
  [data-testid="stChatMessage"] {
    background-color: #161921;
    border: 1px solid #282c3a;
    border-radius: 12px;
    padding: 1rem;
  }

  /* Timestamp links (app-specific) */
  .timestamp-link {
    color: #60a5fa;
    font-weight: 500;
    cursor: pointer;
    padding: 2px 6px;
    background: rgba(96, 165, 250, 0.1);
    border-radius: 4px;
    font-size: 13px;
  }

  .timestamp-link:hover {
    background: rgba(96, 165, 250, 0.2);
  }
</style>
```

---

## 5. Component Patterns

### Video URL Input
- Full-width text input with placeholder: `"Paste a YouTube URL…"`
- Submit button aligned right, primary style
- Validation error shown as inline red text (`#ef4444`)

### Answer Cards
- Background: `#161921`
- Border: `1px solid #282c3a`
- Border-radius: `12px`
- Padding: `1rem 1.25rem`
- Timestamp badges: pill-shaped, `background: rgba(96, 165, 250, 0.1)`, text `#60a5fa`

### Sidebar (Video List)
- Each video item: title truncated, subtle hover highlight (`#1f2231`)
- Active video: left border accent `#60a5fa`, background `#1f2231`
- Session counter at bottom in muted text

### Loading States
- Use Streamlit spinner with custom blue color
- Skeleton-style placeholder text in `#282c3a` where possible

### Pricing / Limits Banner
- Background: `#161921`
- Warm accent (`#e8922a`) for limit warnings
- "Buy Me a Coffee" link styled as warm-colored button

---

## 6. Border Radius Scale

| Usage            | Radius |
|------------------|--------|
| Buttons          | 10px   |
| Cards/Containers | 12px   |
| Inputs           | 8px    |
| Badges/Pills     | 9999px |

---

## 7. Shadows

Use sparingly on dark backgrounds:
- Card hover: `0 4px 20px rgba(96, 165, 250, 0.05)`
- Primary button: `0 4px 12px rgba(96, 165, 250, 0.2)`

---

## 8. Spacing

Follow a 4px base grid:
- Section padding: `24px`
- Card padding: `16–20px`
- Element gap: `8–16px`
- Input padding: `8px 12px`

---

## 9. Favicon & Branding

- Use the same `favicon.png` from the landing page
- Page title: `"AskTheVideo — AI Video Q&A"`
- Set via `st.set_page_config(page_title="AskTheVideo — AI Video Q&A", page_icon="favicon.png", layout="wide")`
