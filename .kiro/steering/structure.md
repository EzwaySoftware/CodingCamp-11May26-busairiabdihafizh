# Project Structure

```
project-root/
├── index.html          # Single-page app entry point
├── css/
│   └── style.css       # All styles — variables, layout, components, dark mode
├── js/
│   └── main.js         # All JavaScript — theme toggle, transaction logic
└── .kiro/
    └── steering/       # AI assistant guidance files
```

## Key Conventions

- **Single HTML file** — all UI lives in `index.html`
- **Single CSS file** — `style.css` handles everything; no separate component stylesheets
- **Single JS file** — `main.js` for all interactivity; loaded at end of `<body>`
- CSS variables in `:root` control the entire color theme; dark mode overrides them under `body.dark`
- No subfolders for components, pages, or modules — keep flat until complexity demands otherwise

## HTML Sections

| Element | Purpose |
|---|---|
| `.top-bar` | App title + theme toggle button |
| `<header>` | Saldo Total display |
| `#tambah-transaksi` | Add transaction form |
| `#visualisasi-pengeluaran` | Grid container for list + chart |
| `#daftar-transaksi` | Scrollable transaction list |
| `#grafik-pengeluaran` | Pie chart placeholder |
