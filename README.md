# SwiftGet — Get everything, instantly

A Ninite-inspired app installer with a clean light theme, 80+ apps, and real executable downloads.

## Quick Start

```bash
# 1. Install all dependencies (one time)
npm install

# 2. Start the monolithic Node.js server
npm start
```

Then open **http://localhost:5000**

## Production Run

Set `PORT` if your host provides one, then start from the project root:

```bash
npm ci --omit=dev
npm start
```

The Express server serves `frontend/index.html`, `frontend/style.css`, `frontend/script.js`, and the `/apps` API from a single process.

## Render Deployment

Use the repository root as the Render root directory.

| Field | Value |
|---|---|
| **Build Command** | `npm ci --omit=dev` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |
| **Node Version** | 18+ |

> **Note:** No environment variables are required for basic deployment. Optionally set `FRONTEND_URL`, `CLIENT_URL`, `CORS_ORIGIN`, or `CORS_ORIGINS` (comma-separated) to restrict CORS to specific origins.

## Railway Deployment

Use the repository root as the Railway root directory.

```text
Root Directory:  .
Build Command:   npm ci --omit=dev
Start Command:   npm start
```

## What it does

1. Browse 80+ apps across 10 categories
2. Click to select apps
3. Choose your OS (Windows / macOS / Linux)
4. Click "Generate script" → get an install script
   - **Windows** → `winget` or `Chocolatey` commands
   - **macOS** → `brew install` commands
   - **Linux** → `apt-get install` commands

## Windows installer methods

- **winget** — built into Windows 10/11, no extra install needed
- **Chocolatey** — auto-installs if not present

## Project structure

```
swiftget/
├── backend/
│   ├── apps.json       # App catalogue (80+ apps)
│   ├── server.js       # Express server — serves frontend + /apps API
│   └── package.json    # Backend-specific deps (unused at root install)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── package.json        # Root — production deps + start script
```

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/apps` | All apps (JSON array) |
| GET | `/health` | Health check — returns `{"status":"ok"}` |

All unknown routes fall back to `frontend/index.html`.
