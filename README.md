# Markdown Notes

A lightweight, privacy-first markdown notes app with live preview, folder organization, search, and local storage. Built with React + TypeScript + Vite.

> All data is stored in your browser's `localStorage` — nothing is sent to a server.

## Features

- **Live Markdown Preview** — side-by-side editor and rendered preview with support for headers, bold, italic, inline code, lists, and blockquotes
- **Folder Organization** — group notes into folders and filter by folder
- **Search** — full-text search across note titles and content
- **Pin Notes** — pin important notes to the top of the list
- **Word & Character Count** — real-time stats in the status bar
- **Dark Theme** — clean, dark UI with `JetBrains Mono` editor font
- **Offline & Private** — runs entirely in the browser with no backend

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | React 18                    |
| Language   | TypeScript 5                |
| Bundler    | Vite 5                      |
| Styling    | Plain CSS (custom properties) |
| Storage    | Browser `localStorage`      |
| Deployment | GitHub Pages                |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ (see `.nvmrc`)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/tapiwamakandigona/markdown-notes.git
cd markdown-notes

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/markdown-notes/`.

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` directory and can be served by any static host.

## Project Structure

```
├── src/
│   ├── App.tsx            # Main application component (editor, sidebar, preview)
│   ├── App.css            # Core styles + dark theme
│   ├── main.tsx           # React entry point
│   ├── markdown.ts        # Enhanced markdown-to-HTML converter (utility)
│   ├── highlight.ts       # Search highlight helpers (utility)
│   ├── templates.ts       # Note starter templates (utility)
│   ├── useAutoSave.ts     # Auto-save hook with debounce (utility)
│   ├── useFocusMode.ts    # Distraction-free writing mode hook (utility)
│   ├── useTheme.ts        # Dark/light theme toggle hook (utility)
│   ├── useWordStats.ts    # Word statistics hook (utility)
│   ├── focusMode.css      # Focus mode styles (utility)
│   └── lightTheme.css     # Light theme overrides (utility)
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── .github/
    └── workflows/
        ├── deploy.yml     # GitHub Pages deployment
        └── build-apk.yml  # Android APK build (via Capacitor)
```

> **Note:** Several utility modules (`markdown.ts`, `highlight.ts`, `templates.ts`, hooks, and extra CSS files) are scaffolded but not yet integrated into the main `App.tsx`. They are available for future use.

## Supported Markdown

The built-in parser supports:

- `# Heading 1` through `### Heading 3`
- `**bold**` and `*italic*`
- `` `inline code` ``
- `- unordered lists`
- `> blockquotes`

## Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on pushes to `main`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) © Tapiwa Makandigona
