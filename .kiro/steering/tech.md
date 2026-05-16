# Tech Stack

## Core
- **HTML5** — semantic markup, no build step
- **CSS3** — custom properties (CSS variables) for theming, CSS Grid & Flexbox for layout
- **Vanilla JavaScript** (ES6+) — no frameworks, no bundler

## Conventions
- CSS variables defined in `:root` for light mode; overridden under `body.dark` for dark mode
- Theme preference persisted via `localStorage` (key: `theme`, values: `"dark"` | `"light"`)
- SVG icons inlined in HTML for the theme toggle (no icon library dependency)
- `system-ui` font stack — no external font imports

## Commands
This is a static site with no build system. Open `index.html` directly in a browser or use a local dev server:

```bash
# Using VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Or using Node.js http-server
npx http-server .
```

No install, compile, or test steps required.
