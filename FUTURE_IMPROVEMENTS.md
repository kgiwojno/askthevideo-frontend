# Future Improvements

## UI / UX

- **Welcome Screen**: Replace feature grid with simpler text-based instructions matching the original spec (paste URL → ask questions flow).
- **"Maximum 5 Videos" Warning**: Add a visible warning banner when 5 videos are loaded, instead of only disabling the button silently.
- **Assistant Avatar**: Consider a custom branded icon instead of the generic neon "?" favicon for the chat assistant avatar.

## Streamlit Migration

- Generate `.streamlit/config.toml` with dark theme and brand colors.
- Create CSS override blocks for `st.markdown()` to match the React design system.
- Create custom HTML snippets for sidebar footer and branding elements.
- Export design tokens document for Streamlit implementation reference.
