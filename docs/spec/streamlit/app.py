"""
AskTheVideo — Streamlit App Skeleton
Wires together CSS overrides, HTML snippets, and layout structure.
Replace placeholder functions with your actual backend logic.
"""

import streamlit as st
from css_overrides import inject_custom_css
from html_snippets import (
    SIDEBAR_TITLE,
    BMC_BUTTON,
    FEEDBACK_LINK,
    SIDEBAR_FOOTER,
    WELCOME_MESSAGE,
    UNLIMITED_BADGE,
    limit_warning_html,
)

# ─── Page Config (must be first Streamlit call) ─────────────────────
st.set_page_config(
    page_title="AskTheVideo — AI Video Q&A",
    page_icon="favicon.png",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Inject Custom CSS ──────────────────────────────────────────────
inject_custom_css()

# ─── Session State Initialization ────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []
if "loaded_videos" not in st.session_state:
    st.session_state.loaded_videos = []
if "questions_remaining" not in st.session_state:
    st.session_state.questions_remaining = 10
if "is_unlimited" not in st.session_state:
    st.session_state.is_unlimited = False


# ─── Placeholder Backend Functions ───────────────────────────────────
def ingest_video(url: str) -> dict | None:
    """
    TODO: Replace with actual video ingestion logic.
    - Fetch transcript via YouTube API
    - Chunk and embed via Pinecone
    - Return video metadata dict or None on failure
    """
    # Placeholder: simulate success
    import time
    time.sleep(1.5)
    return {
        "title": f"Video from {url[:40]}…",
        "url": url,
        "duration": "12:34",
        "selected": True,
    }


def ask_agent(question: str, videos: list[dict]) -> str:
    """
    TODO: Replace with actual agent invocation.
    - Query Pinecone for relevant chunks from selected videos
    - Send to Claude Sonnet 4.6 with context
    - Return markdown response with timestamp links
    """
    # Placeholder response
    return (
        f"Based on your videos, here's what I found about \"{question[:50]}\":\n\n"
        f"At [2:14-3:45](https://youtu.be/example?t=134), the speaker explains "
        f"the core concept in detail.\n\n"
        f"There's also a relevant section at [7:22](https://youtu.be/example?t=442) "
        f"that provides additional context."
    )


def validate_access_key(key: str) -> bool:
    """
    TODO: Replace with actual key validation logic.
    """
    return len(key.strip()) > 0


# ─── Sidebar ────────────────────────────────────────────────────────
with st.sidebar:
    # 1. Logo
    st.markdown(SIDEBAR_TITLE, unsafe_allow_html=True)

    # 2. Video input
    st.markdown("#### Add Video")
    url = st.text_input(
        "YouTube URL",
        placeholder="https://youtube.com/watch?v=...",
        label_visibility="collapsed",
    )

    video_limit_reached = len(st.session_state.loaded_videos) >= 5
    load_btn = st.button(
        "Load Video",
        type="primary",
        use_container_width=True,
        disabled=video_limit_reached or not url.strip(),
    )

    if load_btn and url.strip() and not video_limit_reached:
        with st.spinner("Loading video..."):
            result = ingest_video(url.strip())
        if result:
            st.session_state.loaded_videos.append(result)
            st.session_state.messages.append({
                "role": "assistant",
                "content": f"✅ Video loaded: \"{result['title']}\" ({result['duration']}). You can now ask questions about it.",
            })
            st.rerun()
        else:
            st.error("Could not load video. No transcript available.")

    st.markdown("---")

    # 3. Video library
    st.markdown("#### Loaded Videos")
    if not st.session_state.loaded_videos:
        st.caption("No videos loaded yet.")
    else:
        for i, video in enumerate(st.session_state.loaded_videos):
            col1, col2 = st.columns([0.85, 0.15])
            with col1:
                title = video["title"]
                truncated = title[:40] + "…" if len(title) > 40 else title
                video["selected"] = st.checkbox(
                    truncated,
                    value=video.get("selected", True),
                    key=f"video_{i}",
                )
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
        access_key = st.text_input(
            "Enter key",
            type="password",
            label_visibility="collapsed",
            key="access_key_input",
        )
        if st.button("Go", key="key_submit"):
            if validate_access_key(access_key):
                st.session_state.is_unlimited = True
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": "🔓 Access key accepted! You now have unlimited access. All limits have been removed.",
                })
                st.rerun()

    st.markdown("---")

    # 6. Links
    st.markdown(BMC_BUTTON, unsafe_allow_html=True)
    st.markdown(FEEDBACK_LINK, unsafe_allow_html=True)

    # 7. Footer
    st.markdown(SIDEBAR_FOOTER, unsafe_allow_html=True)


# ─── Main Area ──────────────────────────────────────────────────────

# Warning banners
if not st.session_state.is_unlimited:
    if st.session_state.questions_remaining <= 0:
        st.warning("⚠️ You have reached the 10-question limit. Enter an access key in the sidebar for unlimited access.")
    elif st.session_state.questions_remaining <= 3:
        st.markdown(
            limit_warning_html(st.session_state.questions_remaining),
            unsafe_allow_html=True,
        )

# Welcome screen or chat history
if not st.session_state.loaded_videos and not st.session_state.messages:
    st.markdown(WELCOME_MESSAGE, unsafe_allow_html=True)
else:
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

# Chat input
has_videos = len(st.session_state.loaded_videos) > 0
limit_reached = not st.session_state.is_unlimited and st.session_state.questions_remaining <= 0

if not has_videos:
    placeholder = "Load a video first…"
elif limit_reached:
    placeholder = "Question limit reached"
else:
    placeholder = "Ask a question about your videos…"

question = st.chat_input(
    placeholder,
    disabled=not has_videos or limit_reached,
)

if question:
    # Add user message
    st.session_state.messages.append({"role": "user", "content": question})

    # Decrement counter
    if not st.session_state.is_unlimited:
        st.session_state.questions_remaining = max(0, st.session_state.questions_remaining - 1)

    # Get selected videos
    selected_videos = [v for v in st.session_state.loaded_videos if v.get("selected", True)]

    # Display user message
    with st.chat_message("user"):
        st.markdown(question)

    # Get and display assistant response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = ask_agent(question, selected_videos)
        st.markdown(response)

    # Save assistant message
    st.session_state.messages.append({"role": "assistant", "content": response})
