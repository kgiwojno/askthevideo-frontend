# AskTheVideo — Streamlit Layout Guide

## Page Configuration

```python
st.set_page_config(
    page_title="AskTheVideo — AI Video Q&A",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)
```

Must be the **first** Streamlit call in `app.py`.

---

## App Initialization

```python
from css_overrides import inject_custom_css
from html_snippets import *

# 1. Inject CSS (must come right after set_page_config)
inject_custom_css()

# 2. Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "loaded_videos" not in st.session_state:
    st.session_state.loaded_videos = []
if "questions_remaining" not in st.session_state:
    st.session_state.questions_remaining = 10
if "is_unlimited" not in st.session_state:
    st.session_state.is_unlimited = False
```

---

## Sidebar Structure (top to bottom)

```python
with st.sidebar:
    # 1. Logo
    st.markdown(SIDEBAR_TITLE, unsafe_allow_html=True)

    # 2. Video input
    st.markdown("#### Add Video")
    url = st.text_input("YouTube URL", placeholder="https://youtube.com/watch?v=...", label_visibility="collapsed")
    load_btn = st.button("Load Video", type="primary", use_container_width=True,
                          disabled=(len(st.session_state.loaded_videos) >= 5))

    st.markdown("---")

    # 3. Video library
    st.markdown("#### Loaded Videos")
    if not st.session_state.loaded_videos:
        st.caption("No videos loaded yet.")
    else:
        for i, video in enumerate(st.session_state.loaded_videos):
            col1, col2 = st.columns([0.85, 0.15])
            with col1:
                truncated = video["title"][:40] + "…" if len(video["title"]) > 40 else video["title"]
                st.checkbox(truncated, value=video.get("selected", True), key=f"video_{i}")
            with col2:
                if st.button("✕", key=f"remove_{i}"):
                    st.session_state.loaded_videos.pop(i)
                    st.rerun()

    st.markdown("---")

    # 4. Limits display
    st.caption(f"📊 {len(st.session_state.loaded_videos)}/5 videos loaded")
    if st.session_state.is_unlimited:
        st.markdown(UNLIMITED_BADGE, unsafe_allow_html=True)
    else:
        st.caption(f"📊 {st.session_state.questions_remaining}/10 questions remaining")

    st.markdown("---")

    # 5. Access key
    with st.expander("🔑 Access Key"):
        key = st.text_input("Enter key", type="password", label_visibility="collapsed")
        if st.button("Go", key="key_submit"):
            if key.strip():
                st.session_state.is_unlimited = True
                st.rerun()

    st.markdown("---")

    # 6. Links
    st.markdown(BMC_BUTTON, unsafe_allow_html=True)
    st.markdown(FEEDBACK_LINK, unsafe_allow_html=True)

    # 7. Footer
    st.markdown(SIDEBAR_FOOTER, unsafe_allow_html=True)
```

---

## Main Area Structure

```python
# Welcome screen (no videos loaded)
if not st.session_state.loaded_videos:
    st.markdown(WELCOME_MESSAGE, unsafe_allow_html=True)

# Chat history
else:
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

# Warning banners
if not st.session_state.is_unlimited:
    if st.session_state.questions_remaining <= 0:
        st.warning("⚠️ You have reached the 10-question limit. Enter an access key in the sidebar for unlimited access.")
    elif st.session_state.questions_remaining <= 3:
        st.warning(f"⚠️ You have {st.session_state.questions_remaining} questions remaining.")

# Chat input
question = st.chat_input(
    "Ask a question about your videos...",
    disabled=(not st.session_state.loaded_videos or
              (not st.session_state.is_unlimited and st.session_state.questions_remaining <= 0))
)
```

---

## Loading States

```python
# Video ingestion
with st.spinner("Loading video..."):
    result = ingest_video(url)

# AI thinking
with st.chat_message("assistant"):
    with st.spinner("Thinking..."):
        response = agent.invoke(question)
    st.markdown(response)
```

---

## State-Driven UI Summary

| State | Sidebar | Main Area | Chat Input |
|-------|---------|-----------|------------|
| No videos | URL input visible, library empty | Welcome message | Disabled: "Load a video first…" |
| Videos loaded | Library with checkboxes, limits shown | Chat history | Active |
| Limit reached | Access key expander highlighted | Warning banner | Disabled |
| Video limit (5) | Load button disabled | — | — |
| Unlimited | "Unlimited access ✅" | No warnings | Active |
| Loading video | Spinner next to input | Status message | — |
| AI thinking | — | Spinner in assistant bubble | — |

---

## Tips

- **Sidebar width**: Don't override via CSS — it breaks responsiveness on mobile.
- **Chat bubbles**: `st.chat_message()` handles left/right alignment automatically.
- **Chat input position**: Always fixed at bottom — Streamlit handles this natively.
- **Timestamp links**: Streamlit renders markdown links automatically. They open in new tabs by default.
- **Mobile**: Sidebar collapses to hamburger menu. Ensure chat bubbles don't overflow horizontally.
