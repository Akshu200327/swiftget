# SwiftGet — Get everything, instantly

A Ninite-inspired app installer with a clean light theme, 80+ apps, and real executable downloads.

## Quick Start

```bash
# 1. Install all dependencies (one time)
npm run install:all

# 2. Start both frontend + backend
npm run dev
```

Then open **http://localhost:3000**

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
└── package.json        # Root scripts with concurrently
```

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/apps | All apps |
| GET | /api/apps/category/:cat | Apps by category |
| GET | /api/apps/:id | Single app |
| POST | /api/generate | Generate installer script |
