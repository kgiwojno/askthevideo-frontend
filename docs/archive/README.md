# AskTheVideo Frontend — Documentation

## Overview

All project documentation lives in `docs/`. Active documents are in the root, completed/historical documents are in `archive/`, and original planning specs are in `spec/`.

## File Map

```
docs/
├── README.md                           # This file
├── CHANGELOG.md                        # Active — all changes by date
├── archive/                            # Completed documents (no longer updated)
│   ├── HANDOFF_ASKTHEVIDEO_FRONTEND.md # Project handoff for presentations
│   └── FUTURE_IMPROVEMENTS.md         # Tracked issues (all resolved or deferred)
└── spec/                               # Original planning documents (pre-build)
    ├── REACT_FRONTEND_SPEC.md          # Frontend API integration spec
    ├── ADMIN_PANEL_FRONTEND_SPEC.md    # Admin dashboard spec
    └── streamlit/                      # Early Streamlit prototype (abandoned)
        ├── README.md                   # Streamlit deliverables overview
        ├── app.py                      # Streamlit app skeleton
        ├── css_overrides.py            # CSS override block
        ├── html_snippets.py            # HTML template strings
        ├── favicon.png                 # Streamlit favicon
        ├── DESIGN_TOKENS.md            # Colour palette, typography, spacing
        ├── LAYOUT_GUIDE.md             # Layout reference with code examples
        ├── STREAMLIT_APP_SPEC-2.md     # Draft app spec (v2)
        ├── STREAMLIT_DESIGN_SPEC-2.md  # Draft design spec (v2)
        └── .streamlit/config.toml      # Streamlit theme config
```

## Document Descriptions

### Active (`docs/`)

| File | Purpose | Audience |
|------|---------|----------|
| **CHANGELOG.md** | Detailed log of all changes made during development, grouped by date and category. | Developers, reviewers |

### Archive (`docs/archive/`)

| File | Purpose | Audience |
|------|---------|----------|
| **HANDOFF_ASKTHEVIDEO_FRONTEND.md** | Master document covering architecture, development journey, features, deviations from specs, what worked/didn't, technical debt, and presentation talking points. | Presentation prep, stakeholders |
| **FUTURE_IMPROVEMENTS.md** | Tracked issues found during project review. Each item is categorised (Critical, Worth Fixing, Cleanup, Minor) with current status (all resolved or deferred with rationale). | Future development, grading |

### Original Planning Specs (`docs/spec/`)

These are the **pre-build planning documents** — the original specifications written before code was implemented. They are kept as reference to show what was planned vs what was built. The differences are documented in `archive/HANDOFF_ASKTHEVIDEO_FRONTEND.md` (Section 4: Deviations).

| File | What it defined |
|------|----------------|
| **REACT_FRONTEND_SPEC.md** | Frontend API integration: session management, all 11 endpoints, request/response formats, error handling, markdown rendering, UI state flows |
| **ADMIN_PANEL_FRONTEND_SPEC.md** | Admin dashboard: token auth, metric cards layout, event log, auto-refresh, external links, design guidelines |
| **streamlit/** | Complete Streamlit prototype: app skeleton, CSS overrides, HTML snippets, design tokens, layout guide. Abandoned in favour of React for better UX, streaming, and mobile support. |

## How to Use

- **Checking what was built?** Read `CHANGELOG.md` for a detailed change log.
- **Preparing a presentation?** Read `archive/HANDOFF_ASKTHEVIDEO_FRONTEND.md` — it has everything in one place, including a recommended demo flow.
- **Reviewing what changed from the plan?** Read Section 4 of the handoff doc — all deviations are documented with rationale.
- **Want to understand the original vision?** Read `spec/REACT_FRONTEND_SPEC.md` and `spec/ADMIN_PANEL_FRONTEND_SPEC.md`.
- **Looking for tracked issues?** Read `archive/FUTURE_IMPROVEMENTS.md` — all items are categorised and resolved or deferred.
