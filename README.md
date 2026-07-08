# SwiftGet — Get everything, instantly

A Ninite-inspired app installer with a clean light theme, 80+ apps, and real executable downloads.

## Quick Start

```bash
# 1. Install all dependencies (one time)
npm run install:all

# 2. Start the monolithic Node.js server
npm start
```

Then open **http://localhost:5000**

## Production Run

Set `PORT` if your host provides one, then start from the project root:

```bash
npm run install:all
npm start
```

The Express server serves `frontend/index.html`, `frontend/style.css`, `frontend/script.js`, optional `frontend/assets/*`, and the `/apps` API from the same process.

## Railway Deployment

Use the repository root as the Railway root directory.

```text
Root Directory: .
Build Command: npm ci --omit=dev
Start Command: npm start
```

The root `package.json` owns the production install because Railway installs dependencies from the configured root directory. The start script runs `node backend/server.js`, and the Express server serves both `frontend/` and `/apps`.

## What it does

1. Browse 80+ apps across 10 categories
2. Click to select apps
3. Choose your OS (Windows / macOS / Linux)
4. Click "Get Installer" → downloads a real executable file
   - **Windows** → `.bat` file (run as Administrator)
   - **macOS/Linux** → `.sh` shell script

## Windows installer methods

- **winget** — built into Windows 10/11, no extra install needed
- **Chocolatey** — auto-installs if not present

## Project structure

```
swiftget/
├── backend/
│   ├── server.js       # Express API + script generator
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── Header
│       │   ├── CategoryBar
│       │   ├── AppGrid
│       │   ├── AppCard
│       │   ├── SidePanel
│       │   └── InstallerModal
│       └── styles/
└── package.json        # Root scripts for the monolithic server
```

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /apps | All apps |

Unknown non-API routes fall back to `frontend/index.html`.
