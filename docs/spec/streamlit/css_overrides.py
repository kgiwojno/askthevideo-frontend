"""
CSS Override Block for AskTheVideo Streamlit App
Inject at the top of app.py via: inject_custom_css()
"""

import streamlit as st


def inject_custom_css():
    """Inject custom CSS overrides for AskTheVideo styling."""
    st.markdown(CSS_BLOCK, unsafe_allow_html=True)


CSS_BLOCK = """
<style>
  /* =============================================
     AskTheVideo — Streamlit CSS Overrides
     Matches landing page design system
     ============================================= */

  /* Import Inter font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  /* Global font */
  html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  /* ---- Hide Streamlit defaults ---- */
  #MainMenu {visibility: hidden;}
  header {visibility: hidden;}
  footer {visibility: hidden;}
  .reportview-container .main footer {visibility: hidden;}

  /* ---- Main container ---- */
  .stApp {
    background-color: #0f1117;
  }

  /* ---- Sidebar ---- */
  [data-testid="stSidebar"] {
    background-color: #161921;
    border-right: 1px solid #282c3a;
  }

  [data-testid="stSidebar"] [data-testid="stMarkdownContainer"] h2 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.025em;
  }

  /* ---- Input fields ---- */
  .stTextInput input,
  .stTextArea textarea,
  .stSelectbox > div > div {
    background-color: #1f2231 !important;
    border: 1px solid #282c3a !important;
    color: #e0e2ea !important;
    border-radius: 8px !important;
    font-size: 14px !important;
  }

  .stTextInput input::placeholder,
  .stTextArea textarea::placeholder {
    color: #808594 !important;
  }

  .stTextInput input:focus,
  .stTextArea textarea:focus {
    border-color: #60a5fa !important;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.15) !important;
  }

  /* ---- Buttons — Primary ---- */
  .stButton > button[kind="primary"],
  .stButton > button {
    background-color: #60a5fa !important;
    color: #0f1117 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.5rem 1.25rem !important;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2) !important;
    transition: opacity 0.2s ease !important;
  }

  .stButton > button:hover {
    opacity: 0.85 !important;
  }

  .stButton > button:disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
  }

  /* ---- Buttons — Secondary ---- */
  .stButton > button[kind="secondary"] {
    background-color: transparent !important;
    color: #e0e2ea !important;
    border: 1px solid #282c3a !important;
    box-shadow: none !important;
  }

  .stButton > button[kind="secondary"]:hover {
    border-color: #60a5fa !important;
    color: #60a5fa !important;
  }

  /* ---- Chat messages ---- */
  [data-testid="stChatMessage"] {
    background-color: #161921;
    border: 1px solid #282c3a;
    border-radius: 12px;
    padding: 1rem;
  }

  /* User message variant — slightly different background */
  [data-testid="stChatMessage"][data-testid-role="user"] {
    background-color: rgba(96, 165, 250, 0.08);
    border-color: rgba(96, 165, 250, 0.15);
  }

  /* Chat input field */
  [data-testid="stChatInput"] textarea {
    background-color: #1f2231 !important;
    border: 1px solid #282c3a !important;
    border-radius: 8px !important;
    color: #e0e2ea !important;
  }

  [data-testid="stChatInput"] textarea:focus {
    border-color: #60a5fa !important;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.15) !important;
  }

  /* ---- Expanders (Access Key) ---- */
  [data-testid="stExpander"] {
    background-color: #161921;
    border: 1px solid #282c3a;
    border-radius: 12px;
  }

  [data-testid="stExpander"] summary {
    color: #808594;
    font-size: 13px;
  }

  /* ---- Dividers ---- */
  hr {
    border-color: #282c3a;
  }

  /* ---- Tabs ---- */
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

  /* ---- Metrics ---- */
  [data-testid="stMetricValue"] {
    color: #60a5fa;
    font-weight: 700;
  }

  [data-testid="stMetricLabel"] {
    color: #808594;
  }

  /* ---- Alerts ---- */
  .stAlert {
    border-radius: 10px !important;
    border: 1px solid #282c3a !important;
  }

  /* ---- Links ---- */
  a {
    color: #60a5fa !important;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* ---- Timestamp links (in chat responses) ---- */
  .timestamp-link {
    color: #60a5fa;
    font-weight: 500;
    cursor: pointer;
    padding: 2px 6px;
    background: rgba(96, 165, 250, 0.1);
    border-radius: 4px;
    font-size: 13px;
    text-decoration: none;
  }

  .timestamp-link:hover {
    background: rgba(96, 165, 250, 0.2);
  }

  /* ---- Code blocks ---- */
  code {
    background-color: #1f2231;
    color: #e0e2ea;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* ---- Spinner ---- */
  .stSpinner > div {
    border-top-color: #60a5fa !important;
  }

  /* ---- Progress bar ---- */
  .stProgress > div > div {
    background-color: #60a5fa !important;
  }

  /* ---- Scrollbar ---- */
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

  /* ---- Captions (limits display) ---- */
  [data-testid="stCaptionContainer"] {
    color: #808594 !important;
    font-size: 12px !important;
  }

  /* ---- Success text for unlimited access ---- */
  .unlimited-badge {
    color: #22c55e;
    font-size: 12px;
    font-weight: 500;
  }

  /* ---- Warning accent ---- */
  .limit-warning {
    color: #e8922a;
    font-size: 12px;
    font-weight: 500;
  }
</style>
"""
