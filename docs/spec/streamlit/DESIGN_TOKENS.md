# AskTheVideo — Design Tokens Reference

## Color Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| Background | `#0f1117` | 228 15% 7% | Page background, main area |
| Surface | `#161921` | 228 15% 10% | Sidebar, cards, chat bubbles (assistant) |
| Secondary | `#1f2231` | 228 12% 14% | Input fields, hover states, active video bg |
| Muted | `#282c3a` | 228 10% 18% | Borders, dividers, scrollbar thumb |
| Primary | `#60a5fa` | 217 100% 66% | Buttons, links, active indicators, focus rings |
| Foreground | `#e0e2ea` | 228 14% 90% | Primary text |
| Muted Foreground | `#808594` | 228 10% 55% | Secondary text, placeholders, captions |
| Warm Accent | `#e8922a` | 30 90% 55% | Limit warnings, highlights |
| Success | `#22c55e` | 142 70% 45% | Unlimited badge, success states |
| Destructive | `#ef4444` | 0 84% 60% | Errors, remove buttons |

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 20px | 700 | Foreground |
| Section title | 16px | 600 | Foreground |
| Body text | 14px | 400 | Foreground |
| Caption / label | 12px | 500 | Muted Foreground |
| Footer | 11px | 400 | Muted Foreground |
| Timestamp badge | 13px | 500 | Primary |

**Font stack**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 10px |
| Cards / Containers | 12px |
| Inputs | 8px |
| Badges / Pills | 9999px |

## Shadows

| Usage | Value |
|-------|-------|
| Card hover | `0 4px 20px rgba(96, 165, 250, 0.05)` |
| Primary button | `0 4px 12px rgba(96, 165, 250, 0.2)` |
| Focus ring | `0 0 0 2px rgba(96, 165, 250, 0.15)` |

## Spacing (4px grid)

| Usage | Value |
|-------|-------|
| Section padding | 24px |
| Card padding | 16–20px |
| Element gap | 8–16px |
| Input padding | 8px 12px |

## Streamlit Theme Mapping

| Streamlit Property | Value | Maps To |
|--------------------|-------|---------|
| `primaryColor` | `#60a5fa` | Primary |
| `backgroundColor` | `#0f1117` | Background |
| `secondaryBackgroundColor` | `#161921` | Surface |
| `textColor` | `#e0e2ea` | Foreground |
| `font` | `sans serif` | System sans-serif |
