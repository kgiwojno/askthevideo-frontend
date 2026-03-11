"""
Custom HTML Snippets for AskTheVideo Streamlit App
Use with st.markdown(snippet, unsafe_allow_html=True)
"""


# ─── Sidebar Title / Logo ───────────────────────────────────────────
SIDEBAR_TITLE = """
<div style="
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0 12px 0;
">
  <span style="font-size: 24px;">🎬</span>
  <span style="
    font-size: 20px;
    font-weight: 700;
    color: #e0e2ea;
    letter-spacing: -0.025em;
    font-family: 'Inter', sans-serif;
  ">AskTheVideo</span>
</div>
"""


# ─── Buy Me a Coffee Button ─────────────────────────────────────────
BMC_BUTTON = """
<a href="https://buymeacoffee.com/kgiw" target="_blank" rel="noopener noreferrer"
   style="
     display: inline-flex;
     align-items: center;
     gap: 6px;
     color: #60a5fa;
     font-size: 12px;
     font-weight: 500;
     text-decoration: none;
     font-family: 'Inter', sans-serif;
     padding: 4px 0;
   ">
  ☕ Buy Me a Coffee
</a>
"""


# ─── Feedback Link ──────────────────────────────────────────────────
FEEDBACK_LINK = """
<a href="https://forms.gle/8LQNE85WL29wSdno8" target="_blank" rel="noopener noreferrer"
   style="
     display: inline-flex;
     align-items: center;
     gap: 6px;
     color: #808594;
     font-size: 12px;
     font-weight: 400;
     text-decoration: none;
     font-family: 'Inter', sans-serif;
     padding: 4px 0;
     transition: color 0.2s;
   "
   onmouseover="this.style.color='#60a5fa'"
   onmouseout="this.style.color='#808594'">
  📝 Give Feedback
</a>
"""


# ─── Sidebar Footer ─────────────────────────────────────────────────
SIDEBAR_FOOTER = """
<div style="
  text-align: center;
  padding: 12px 0;
  border-top: 1px solid #282c3a;
  margin-top: 8px;
">
  <span style="
    font-size: 11px;
    color: #808594;
    font-family: 'Inter', sans-serif;
  ">Powered by Claude Sonnet 4.6 &amp; Pinecone</span>
</div>
"""


# ─── Main Area Footer (alternative, positioned at bottom) ───────────
MAIN_FOOTER = """
<div class="app-footer" style="
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 8px 0;
  background-color: #0f1117;
  border-top: 1px solid #282c3a;
  z-index: 100;
">
  <span style="
    font-size: 11px;
    color: #808594;
    font-family: 'Inter', sans-serif;
  ">Powered by Claude Sonnet 4.6 &amp; Pinecone</span>
</div>
"""


# ─── Welcome Message (no videos loaded) ─────────────────────────────
WELCOME_MESSAGE = """
<div style="
  text-align: center;
  max-width: 440px;
  margin: 80px auto;
  padding: 0 24px;
">
  <div style="font-size: 48px; margin-bottom: 20px;">🎬</div>
  <h2 style="
    font-size: 24px;
    font-weight: 700;
    color: #e0e2ea;
    margin-bottom: 12px;
    letter-spacing: -0.025em;
    font-family: 'Inter', sans-serif;
  ">Welcome to AskTheVideo</h2>
  <p style="
    font-size: 14px;
    color: #808594;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
  ">
    Paste a YouTube URL in the sidebar to get started.
    You can ask questions, get summaries, compare videos, and more.
  </p>
</div>
"""


# ─── Unlimited Access Badge ─────────────────────────────────────────
UNLIMITED_BADGE = """
<span class="unlimited-badge" style="
  color: #22c55e;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
">📊 Unlimited access ✅</span>
"""


# ─── Limit Warning ──────────────────────────────────────────────────
def limit_warning_html(remaining: int) -> str:
    """Generate limit warning HTML."""
    return f"""
<span class="limit-warning" style="
  color: #e8922a;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
">⚠️ You have {remaining} questions remaining.</span>
"""


# ─── Video List Item ────────────────────────────────────────────────
def video_item_html(title: str, is_selected: bool = True) -> str:
    """Generate a video list item with active/inactive styling."""
    truncated = title[:40] + "…" if len(title) > 40 else title
    bg = "#1f2231" if is_selected else "transparent"
    border_left = "2px solid #60a5fa" if is_selected else "2px solid transparent"
    return f"""
<div style="
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: {bg};
  border-left: {border_left};
  font-size: 12px;
  color: #e0e2ea;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  margin-bottom: 4px;
">
  🎬 {truncated}
</div>
"""
