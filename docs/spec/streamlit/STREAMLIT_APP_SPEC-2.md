# AskTheVideo -- Streamlit App Technical Specification

## For: Lovable / Claude (layout, theme, CSS overrides)

---

## 1. What this document covers

The Streamlit app backend (Python logic, API calls, agent routing) is being built separately. This spec is for the **visual layer only**: theme configuration, CSS overrides, layout structure, and component styling that make the app feel consistent with the landing page design.

**Your deliverables:**
1. `.streamlit/config.toml` with final theme values
2. A CSS override block (injected via `st.markdown`) for components Streamlit cannot theme natively
3. Layout guidance: which Streamlit components to use and how to arrange them
4. Any custom HTML snippets for elements Streamlit cannot render natively (footer, badges, etc.)

---

## 2. App architecture (for context)

```
askthevideo.com          -->  Static landing page (OVH)
app.askthevideo.com      -->  Streamlit app (Koyeb, Docker, 512MB RAM)
```

The app is a single-page Streamlit application (`app.py`) with a sidebar and a chat interface. It connects to:
- **Pinecone** (vector database) for storing and retrieving transcript chunks
- **Anthropic API** (Claude Sonnet 4.6) for answering questions
- **YouTube** (oEmbed API) for video metadata

Users paste a YouTube URL, the app ingests the transcript, and they chat with an AI agent about the video content. Answers include clickable timestamp links.

---

## 3. Page configuration

```python
st.set_page_config(
    page_title="AskTheVideo",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)
```

---

## 4. Theme configuration (.streamlit/config.toml)

These values must be consistent with the landing page palette. Propose final values based on the landing page design. Starting point:

```toml
[theme]
primaryColor = "#4f8fff"
backgroundColor = "#0f1117"
secondaryBackgroundColor = "#1a1b26"
textColor = "#e2e4ea"
font = "sans serif"
```

If you adjusted the landing page colours, update these to match. The key relationships:
- `backgroundColor` = main chat area background = landing page body background
- `secondaryBackgroundColor` = sidebar background = landing page card/section background
- `primaryColor` = buttons, links, active states = landing page accent colour
- `textColor` = primary text = landing page body text

### Additional server config (do not change, included for reference)

```toml
[server]
maxUploadSize = 5
maxMessageSize = 50
enableXsrfProtection = true
runOnSave = false
fileWatcherType = "none"

[client]
showErrorDetails = false

[browser]
gatherUsageStats = false
```

---

## 5. App layout

### 5.1 Overall structure

```
+--------------------+------------------------------------------+
| SIDEBAR (300px)    | MAIN AREA                                |
|                    |                                          |
| Logo/title         | Chat messages                            |
| URL input + button |   (scrollable)                           |
| Video library      |                                          |
| Limits display     |                                          |
| Access key input   |                                          |
| Links              | Chat input                               |
|                    |   (fixed at bottom)                      |
+--------------------+------------------------------------------+
```

### 5.2 Sidebar components (top to bottom)

**1. App title**
```python
st.sidebar.markdown("## 🎬 AskTheVideo")
```
Style: larger than default, accent colour on the emoji or title text. Consider a custom HTML header here for more control.

**2. Video input section**
```python
st.sidebar.markdown("#### Add Video")
url = st.sidebar.text_input("YouTube URL", placeholder="https://youtube.com/watch?v=...")
load_btn = st.sidebar.button("Load Video", type="primary", use_container_width=True)
```
The "Load Video" button should use the primary accent colour. `use_container_width=True` makes it full-width in the sidebar.

**3. Loaded videos section**
```python
st.sidebar.markdown("#### Loaded Videos")
# For each loaded video:
#   - Checkbox (selected for querying)
#   - Video title (truncated if long)
#   - Small "x" button to remove
```
Each video is a row with a checkbox and title. Consider using `st.sidebar.checkbox()` per video, or a custom HTML block for tighter layout.

Video titles come from YouTube oEmbed and can be long. Truncate to ~40 characters with ellipsis in the sidebar display.

**4. Limits display**
```python
st.sidebar.markdown("---")
st.sidebar.caption(f"📊 {video_count}/5 videos loaded")
st.sidebar.caption(f"📊 {questions_remaining}/10 questions remaining")
# Or if unlimited:
st.sidebar.caption("📊 Unlimited access ✅")
```
Small, muted text. Not the focus, but always visible. Use `st.caption()` for small grey text.

**5. Access key**
```python
st.sidebar.markdown("---")
with st.sidebar.expander("🔑 Access Key"):
    key = st.text_input("Enter key", type="password", label_visibility="collapsed")
```
Hidden inside an expander by default. Most users will not need this. `type="password"` masks the input.

**6. Links**
```python
st.sidebar.markdown("---")
st.sidebar.markdown("[☕ Buy Me a Coffee](https://buymeacoffee.com/placeholder)")
st.sidebar.markdown("[📝 Give Feedback](https://forms.google.com/placeholder)")
```
Simple markdown links at the bottom of the sidebar. Consider making the BMC link a styled button instead using custom HTML.

### 5.3 Main area components

**1. Welcome message (shown when no videos loaded)**
```python
if not st.session_state.loaded_videos:
    st.markdown("### Welcome to AskTheVideo 🎬")
    st.markdown("Paste a YouTube URL in the sidebar to get started.")
    st.markdown("You can ask questions, get summaries, compare videos, and more.")
```

**2. Chat history**
```python
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])
```
Uses Streamlit's built-in chat bubbles. User messages appear on the right, assistant on the left. Markdown rendering means timestamp links are clickable automatically.

**3. Chat input**
```python
question = st.chat_input("Ask a question about your videos...")
```
Fixed at the bottom of the main area. Streamlit handles this positioning natively.

**4. Loading states**
```python
# During video ingestion
with st.spinner("Loading video..."):
    result = ingest_video(...)

# During question answering
with st.chat_message("assistant"):
    with st.spinner("Thinking..."):
        response = agent.invoke(...)
    st.markdown(response)
```

**5. Status messages**
```python
st.success("Video loaded: 'How Neural Networks Work' (12:34)")
st.error("Could not load video. No transcript available.")
st.warning("You have 2 questions remaining.")
st.info("Tip: Select which videos to include using the checkboxes in the sidebar.")
```

---

## 6. CSS overrides

Streamlit's native theming handles most colours, but some elements need CSS overrides for a polished look. Inject via:

```python
st.markdown("""
<style>
/* Your CSS overrides here */
</style>
""", unsafe_allow_html=True)
```

### 6.1 Elements that need styling

**Chat message bubbles:** Streamlit's default chat bubbles may not match the dark theme perfectly. Override background colour and border radius.

**Chat input field:** The input at the bottom can look flat. Consider a subtle border or glow in the accent colour.

**Sidebar separator lines:** `st.sidebar.markdown("---")` creates `<hr>` tags. Style them to be subtle (thin, muted colour).

**Buttons:** The primary button gets `primaryColor` automatically, but secondary buttons may need attention.

**Links in chat:** Timestamp links (e.g., `[3:00-4:30](https://youtu.be/...)`) should be clearly clickable. Ensure link colour matches accent.

**Scrollbar:** On dark themes, the default scrollbar can look jarring. Consider styling it to match.

**Expander (access key):** The expander header text and icon should be muted, not prominent.

**Spinner:** Streamlit's spinner uses `primaryColor`. Should work automatically if the theme is set correctly.

**Footer:** Streamlit does not have a native footer component. Use `st.markdown` with custom HTML positioned at the bottom:

```python
st.markdown("""
<div class="app-footer">
    Powered by Claude Sonnet 4.6 & Pinecone
</div>
""", unsafe_allow_html=True)
```

### 6.2 Elements you CANNOT easily style

- Chat bubble layout (user right, assistant left) -- this is fixed
- Chat input position (always bottom) -- this is fixed
- Sidebar width -- partially controllable via CSS but can break responsiveness
- Widget internal styling (selectbox dropdowns, slider tracks) -- limited control
- Streamlit's top header bar (hamburger menu, "Deploy" button) -- can be hidden with CSS

### 6.3 Hiding Streamlit defaults

```css
/* Hide the default Streamlit header and footer */
#MainMenu {visibility: hidden;}
header {visibility: hidden;}
footer {visibility: hidden;}

/* Hide "Made with Streamlit" */
.reportview-container .main footer {visibility: hidden;}
```

### 6.4 Mobile considerations

Streamlit's sidebar collapses into a hamburger menu on mobile. The main chat area takes full width. Ensure:
- Chat bubbles are readable on small screens (no horizontal overflow)
- Timestamp links are tap-friendly (sufficient padding)
- Sidebar content does not overflow when collapsed/expanded

---

## 7. Component reference

### Streamlit components used in the app

| Component | Where | Notes |
|---|---|---|
| `st.set_page_config()` | Top of app.py | Must be first Streamlit call |
| `st.sidebar.markdown()` | Sidebar title, sections | Supports HTML with unsafe_allow_html |
| `st.sidebar.text_input()` | URL input, access key | `placeholder` param for hint text |
| `st.sidebar.button()` | Load Video | `type="primary"` for accent colour |
| `st.sidebar.checkbox()` | Video selection | One per loaded video |
| `st.sidebar.caption()` | Limits display | Small, muted text |
| `st.sidebar.expander()` | Access key section | Collapsed by default |
| `st.chat_message()` | Chat bubbles | `"user"` or `"assistant"` role |
| `st.chat_input()` | Question input | Fixed at bottom, single text field |
| `st.spinner()` | Loading states | Uses primaryColor |
| `st.success/error/warning/info()` | Status banners | Coloured alert boxes |
| `st.markdown()` | Rich text, custom HTML | Set `unsafe_allow_html=True` for CSS/HTML |

### Streamlit version

Using the latest stable Streamlit (installed via pip). No pinned version. Assume all current features are available.

---

## 8. Chat message formatting

Assistant messages contain markdown with timestamp links. A typical response looks like:

```markdown
Based on the video "How Neural Networks Work", the key concept discussed
at [3:00-4:30](https://youtu.be/dQw4w9WgXcQ?t=180) is that neural
networks learn through backpropagation.

The speaker also explains at [8:15](https://youtu.be/dQw4w9WgXcQ?t=495)
that the learning rate controls how fast the model adjusts.
```

This renders as normal text with clickable blue links. Ensure:
- Links open in a new tab (Streamlit markdown links do this by default)
- Link colour is the accent colour, not default browser blue
- Links are underlined or otherwise visually distinct from body text

---

## 9. State-driven UI changes

The UI adapts based on session state. Lovable does not need to implement the logic, but should design for these states:

### State: No videos loaded
- Sidebar: URL input visible, video library section empty or hidden
- Main area: Welcome message with instructions
- Chat input: disabled or shows placeholder "Load a video first..."

### State: Videos loaded, questions remaining
- Sidebar: video library shows loaded videos with checkboxes
- Limits display shows counts
- Main area: chat history (if any) + active chat input

### State: Question limit reached
- Chat input: disabled
- Warning banner: "You have reached the 10-question limit. Enter an access key for unlimited access."
- Sidebar: access key expander highlighted or auto-expanded

### State: Video limit reached
- URL input: still visible
- Load button: disabled or shows error on click
- Warning banner: "Maximum 5 videos per session."

### State: Unlimited access active
- Limits display: "Unlimited access ✅" (green)
- All limits removed
- No warnings

### State: Video loading in progress
- Sidebar: spinner or progress indicator next to the URL input
- Main area: status message "Loading video..."

### State: Agent thinking
- Main area: assistant chat bubble with spinner "Thinking..."

---

## 10. Visual consistency with landing page

The app should feel like a continuation of the landing page, not a separate product. Key consistency points:

- **Same colour palette** (background, text, accent)
- **Same typography feel** (clean sans-serif; Streamlit's font stack is limited but `sans serif` in config.toml uses system sans-serif)
- **Same accent colour** on interactive elements (buttons, links, active states)
- **Dark theme throughout** -- no white backgrounds, no light mode toggle
- **Same footer treatment** -- "Powered by Claude Sonnet 4.6 & Pinecone" in muted text

---

## 11. What NOT to build

- Backend logic (API calls, agent routing, Pinecone operations) -- built separately
- Authentication system -- just a simple text input for access key
- Database -- all state is in-memory (Streamlit session state)
- Admin dashboard -- separate page, not part of main app layout
- File upload -- users paste URLs, not upload files
- Multiple pages -- single-page app only

---

## 12. Deliverables summary

1. **`.streamlit/config.toml`** -- complete file with theme values matching the landing page
2. **CSS override block** -- a single `<style>` block to inject via `st.markdown()`, covering chat bubbles, sidebar, scrollbar, links, footer, hidden defaults
3. **Custom HTML snippets** -- for sidebar title/logo, BMC button, footer, and any elements that need richer markup than Streamlit provides
4. **Layout recommendations** -- any Streamlit-specific tips for achieving the desired layout (column ratios, spacing, component order)
5. **Design tokens document** -- colour palette with hex values and usage labels, so the Python developer can reference them when building components
