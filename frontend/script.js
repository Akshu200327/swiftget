/*
  SwiftGet - Vanilla JavaScript App
  ---------------------------------
  Refactor notes:
  - renderApps(): renders app sections/cards
  - handleSelection(): centralized app selection logic
  - generateScript(): builds command script from selected apps
*/

const API_URL = "/apps";
const API_REQUEST_TIMEOUT_MS = 12000;
const THEME_STORAGE_KEY = "swiftget-theme";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "browsers", label: "Browsers" },
  { id: "communication", label: "Communication" },
  { id: "media", label: "Media" },
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "utilities", label: "Utilities" },
  { id: "security", label: "Security" },
  { id: "productivity", label: "Productivity" },
  { id: "gaming", label: "Gaming" },
  { id: "cloud", label: "Cloud Storage" },
];

const CAT_LABELS = {
  browsers: "Browsers",
  communication: "Communication",
  media: "Media",
  design: "Design & Creative",
  development: "Development",
  utilities: "Utilities",
  security: "Security",
  productivity: "Productivity",
  gaming: "Gaming",
  cloud: "Cloud Storage",
};

const CAT_COLORS = {
  browsers: "#4285F4",
  communication: "#5865F2",
  media: "#FF8800",
  design: "#F24E1E",
  development: "#007ACC",
  utilities: "#2E7D32",
  security: "#00A4BD",
  productivity: "#DB4035",
  gaming: "#1B2838",
  cloud: "#0061FF",
};

const POPULAR_APP_IDS = [
  "Google.Chrome",
  "Microsoft.Edge",
  "Brave.Brave",
  "Mozilla.Firefox",
  "Microsoft.VisualStudioCode",
  "JetBrains.IntelliJIDEA.Community",
  "Git.Git",
  "OpenJS.NodeJS",
  "Python.Python.3.12",
  "Docker.DockerDesktop",
  "VideoLAN.VLC",
  "Spotify.Spotify",
  "OBSProject.OBSStudio",
  "Notion.Notion",
  "SlackTechnologies.Slack",
  "Discord.Discord",
  "Zoom.Zoom",
  "Postman.Postman",
  "FileZilla.FileZilla",
  "RARLab.WinRAR",
  "7zip.7zip",
  "Figma.Figma",
  "Adobe.Photoshop",
  "Valve.Steam",
  "EpicGames.EpicGamesLauncher",
  "Google.Drive",
  "Dropbox.Dropbox",
];

const APP_NAME_COLLATOR = new Intl.Collator(undefined, {
  sensitivity: "base",
  numeric: true,
});

const state = {
  apps: [],
  loading: true,
  error: "",
  selectedIds: new Set(),
  generatedScript: "",
  activeCategory: "all",
  searchText: "",
  os: null,
  method: "winget",
  theme: "light",
};

// -----------------------------
// Utilities
// -----------------------------

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatches(value, query) {
  const text = String(value || "");
  const term = String(query || "").trim();
  if (!term) return escapeHtml(text);

  const matcher = new RegExp(escapeRegExp(term), "ig");
  let html = "";
  let lastIndex = 0;
  let match = matcher.exec(text);

  while (match) {
    const start = match.index;
    const end = start + match[0].length;
    html += escapeHtml(text.slice(lastIndex, start));
    html += `<mark class="search-match">${escapeHtml(text.slice(start, end))}</mark>`;
    lastIndex = end;

    // Prevent infinite loop on edge cases.
    if (matcher.lastIndex === start) matcher.lastIndex += 1;
    match = matcher.exec(text);
  }

  html += escapeHtml(text.slice(lastIndex));
  return html;
}

function getInitials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function mountIconWithFallback({
  container,
  iconUrl,
  altText,
  imageClassName,
  fallbackText,
}) {
  container.innerHTML = "";
  const fallback = document.createElement("span");
  fallback.textContent = fallbackText || "";
  container.appendChild(fallback);

  const normalizedIconUrl =
    typeof iconUrl === "string" ? iconUrl.trim() : "";
  if (!normalizedIconUrl) {
    return;
  }

  const image = document.createElement("img");
  image.className = imageClassName;
  image.alt = altText || "";
  image.loading = "lazy";
  image.style.visibility = "hidden";

  let resolved = false;
  const showFallback = () => {
    if (resolved) return;
    resolved = true;
    fallback.style.display = "";
    if (image.parentNode) image.remove();
  };
  const showImage = () => {
    if (resolved) return;
    if (!image.naturalWidth || !image.naturalHeight) {
      showFallback();
      return;
    }
    resolved = true;
    fallback.style.display = "none";
    image.style.visibility = "visible";
  };

  image.addEventListener("error", showFallback);
  image.addEventListener("load", showImage);
  image.src = normalizedIconUrl;
  container.appendChild(image);

  // Handle cached images that may already be complete.
  if (image.complete) {
    requestAnimationFrame(() => {
      if (image.naturalWidth > 0) showImage();
      else showFallback();
    });
  }
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch (error) {
    console.warn("getInitialTheme(): localStorage unavailable", error);
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme, options = {}) {
  const { persist = true } = options;
  const nextTheme = theme === "dark" ? "dark" : "light";
  state.theme = nextTheme;
  document.documentElement.setAttribute("data-theme", nextTheme);

  if (!persist) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.warn("applyTheme(): failed to persist theme", error);
  }
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
  renderApp();
}

function getSelectedApps() {
  return state.apps.filter((app) => state.selectedIds.has(app.id));
}

function getCategoryCounts() {
  const counts = {};
  state.apps.forEach((app) => {
    counts[app.category] = (counts[app.category] || 0) + 1;
  });
  return counts;
}

function getGroupedApps() {
  const query = state.searchText.trim().toLowerCase();
  const visibleCategories =
    state.activeCategory === "all"
      ? CATEGORIES.slice(1).map((category) => category.id)
      : [state.activeCategory];

  // Single-pass grouping keeps rendering fast for larger app datasets.
  const groupedMap = new Map(visibleCategories.map((categoryId) => [categoryId, []]));

  state.apps.forEach((app) => {
    const appsInCategory = groupedMap.get(app.category);
    if (!appsInCategory) return;

    if (query) {
      const matchesQuery = app._searchName.includes(query) || app._searchDesc.includes(query);
      if (!matchesQuery) return;
    }

    appsInCategory.push(app);
  });

  const grouped = {};
  visibleCategories.forEach((categoryId) => {
    const appsInCategory = groupedMap.get(categoryId) || [];
    if (appsInCategory.length === 0) return;

    appsInCategory.sort((a, b) =>
      APP_NAME_COLLATOR.compare(a.name || "", b.name || "")
    );
    grouped[categoryId] = appsInCategory;
  });

  return grouped;
}

function getPopularApps() {
  const query = state.searchText.trim().toLowerCase();
  const appById = new Map(state.apps.map((app) => [app.id, app]));
  const popularApps = POPULAR_APP_IDS
    .map((appId) => appById.get(appId))
    .filter(Boolean);

  if (!query) return popularApps;
  return popularApps.filter(
    (app) => app._searchName.includes(query) || app._searchDesc.includes(query)
  );
}

// -----------------------------
// Selection + script logic
// -----------------------------

function handleSelection(appId, shouldSelect) {
  const nextSelected = typeof shouldSelect === "boolean"
    ? shouldSelect
    : !state.selectedIds.has(appId);

  if (nextSelected) state.selectedIds.add(appId);
  else state.selectedIds.delete(appId);

  // Keep script output synced with selected apps.
  if (state.generatedScript) {
    state.generatedScript = generateScript(getSelectedApps());
  }
  renderApp();
}

function getInstallPackageId(app) {
  return app.wingetId || app.packageId || app.id || app.name || "";
}

function getCommandManager() {
  if (state.os === "windows") return state.method === "choco" ? "choco" : "winget";
  if (state.os === "macos") return "brew";
  if (state.os === "linux") return "apt";
  return "winget";
}

function buildAppsApiUrl(selectedOs = state.os) {
  const url = new URL(API_URL, window.location.origin);
  if (selectedOs) {
    url.searchParams.set("os", selectedOs);
  }
  return url.toString();
}

function generateScript(apps) {
  const manager = getCommandManager();

  return apps
    .map((app) => {
      const packageId = getInstallPackageId(app);
      if (manager === "choco") return `choco install ${packageId} -y`;
      if (manager === "brew") return `brew install ${packageId}`;
      if (manager === "apt") return `sudo apt install -y ${packageId}`;
      return `winget install ${packageId}`;
    })
    .join("\n");
}

async function copyGeneratedScript(event) {
  if (!state.generatedScript) return;

  const button = event?.currentTarget;
  const originalText = button?.textContent || "Copy Script";

  try {
    await navigator.clipboard.writeText(state.generatedScript);
    if (button) {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    }
  } catch (error) {
    console.error("copyGeneratedScript(): clipboard copy failed", error);
  }
}

function downloadGeneratedScript() {
  if (!state.generatedScript) return;

  const isWindows = state.os === "windows";
  const extension = isWindows ? "bat" : "sh";
  const fileName = `install-script.${extension}`;
  const mimeType = isWindows ? "application/x-bat" : "application/x-sh";

  const blob = new Blob([state.generatedScript], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// -----------------------------
// UI builders
// -----------------------------

function createHeader() {
  const wrapper = document.createElement("header");
  wrapper.className = "header";
  wrapper.innerHTML = `
      <div class="header-inner">
        <div class="header-brand">
          <div class="brand-logo" aria-label="SwiftGet">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="6" fill="#2563eb"></rect>
              <path d="M6 11l3.5 3.5L16 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="brand-name">SwiftGet</span>
          <span class="brand-tagline">Get everything, instantly</span>
        </div>
      <div class="header-controls">
        <button
          id="themeToggleBtn"
          class="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          aria-pressed="${state.theme === "dark"}"
          title="Toggle theme"
        >
          <span class="theme-toggle-track"><span class="theme-toggle-thumb"></span></span>
          <span class="theme-toggle-text">${state.theme === "dark" ? "Dark" : "Light"}</span>
        </button>
        <div class="search-wrap">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"></circle>
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
          </svg>
          <input id="searchInput" type="text" class="search-input" placeholder="Search apps..." />
          <button id="searchClearBtn" class="search-clear hidden" aria-label="Clear search">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const searchInput = wrapper.querySelector("#searchInput");
  const searchClearBtn = wrapper.querySelector("#searchClearBtn");
  const themeToggleBtn = wrapper.querySelector("#themeToggleBtn");

  searchInput.value = state.searchText;
  searchInput.addEventListener("input", (event) => {
    const currentInput = event.currentTarget;
    const caretStart = currentInput.selectionStart ?? 0;
    const caretEnd = currentInput.selectionEnd ?? caretStart;

    state.searchText = currentInput.value;
    renderApp();

    // App re-renders on each keystroke, so restore focus/caret on the new input.
    requestAnimationFrame(() => {
      const nextInput = document.getElementById("searchInput");
      if (!nextInput) return;
      nextInput.focus();
      const nextStart = Math.min(caretStart, nextInput.value.length);
      const nextEnd = Math.min(caretEnd, nextInput.value.length);
      nextInput.setSelectionRange(nextStart, nextEnd);
    });
  });

  searchClearBtn.classList.toggle("hidden", state.searchText.length === 0);
  searchClearBtn.addEventListener("click", () => {
    state.searchText = "";
    renderApp();

    requestAnimationFrame(() => {
      const nextInput = document.getElementById("searchInput");
      if (!nextInput) return;
      nextInput.focus();
      nextInput.setSelectionRange(0, 0);
    });
  });

  themeToggleBtn.addEventListener("click", toggleTheme);

  return wrapper;
}

function showOsSelectionOverlay() {
  const modalRoot = document.getElementById("modalRoot");
  if (modalRoot.querySelector(".os-gate-overlay")) return;

  modalRoot.innerHTML = `
    <div class="os-gate-overlay">
      <div class="os-gate-card">
        <h1 class="os-gate-title">Choose your operating system</h1>
        <p class="os-gate-sub">Select one option to continue.</p>
        <div class="os-gate-actions">
          <button class="os-gate-btn" data-os="windows">Windows</button>
          <button class="os-gate-btn" data-os="macos">macOS</button>
          <button class="os-gate-btn" data-os="linux">Linux</button>
        </div>
      </div>
    </div>
  `;

  modalRoot.querySelectorAll(".os-gate-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      // Save selected OS in state first so UI can react instantly.
      state.os = button.dataset.os;
      state.generatedScript = "";
      if (state.os !== "windows") state.method = "winget";

      renderApp();
      const closeOverlay = hideOsSelectionOverlay();
      await loadApps(state.os);
      await closeOverlay;
    });
  });
}

function hideOsSelectionOverlay() {
  const modalRoot = document.getElementById("modalRoot");
  const overlay = modalRoot.querySelector(".os-gate-overlay");
  if (!overlay) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;
    let fallbackTimer = null;
    const cleanup = () => {
      if (done) return;
      done = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      modalRoot.innerHTML = "";
      resolve();
    };

    overlay.classList.add("closing");
    overlay.addEventListener("animationend", cleanup, { once: true });
    // Fallback in case animation event is not fired.
    fallbackTimer = setTimeout(cleanup, 300);
  });
}

function createFilters() {
  const outer = document.createElement("div");
  outer.className = "catbar-outer";

  const inner = document.createElement("div");
  inner.className = "catbar-inner";

  const scroll = document.createElement("div");
  scroll.className = "catbar-scroll";

  const counts = getCategoryCounts();

  CATEGORIES.forEach((category) => {
    const isActive = state.activeCategory === category.id;
    const button = document.createElement("button");
    button.className = `cat-btn${isActive ? " active" : ""}`;
    button.textContent = category.label;

    if (category.id !== "all" && counts[category.id]) {
      const count = document.createElement("span");
      count.className = "cat-count";
      count.textContent = String(counts[category.id]);
      button.appendChild(count);
    }

    button.addEventListener("click", () => {
      state.activeCategory = category.id;
      renderApp();
    });

    scroll.appendChild(button);
  });

  inner.appendChild(scroll);
  outer.appendChild(inner);
  return outer;
}

function createAppCard(app) {
  const card = document.createElement("button");
  const isSelected = state.selectedIds.has(app.id);
  const searchQuery = state.searchText.trim();
  card.className = `app-card${isSelected ? " selected" : ""}`;
  card.title = app.name;
  card.setAttribute("aria-pressed", String(isSelected));

  const iconBg = app.color ? `${app.color}18` : "var(--bg-soft)";
  const iconBorder = app.color ? `${app.color}28` : "var(--border)";

  card.innerHTML = `
    <div class="app-card-inner">
      <div class="app-icon-wrap" style="background:${iconBg};border-color:${iconBorder}"></div>
      <div class="app-info">
        <span class="app-name">${highlightMatches(app.name, searchQuery)}</span>
        <span class="app-desc">${highlightMatches(app.desc || "", searchQuery)}</span>
      </div>
      <div class="app-check">
        <input class="app-checkbox" type="checkbox" ${isSelected ? "checked" : ""} aria-label="Select ${escapeHtml(app.name)}" />
      </div>
    </div>
  `;

  const iconWrap = card.querySelector(".app-icon-wrap");
  mountIconWithFallback({
    container: iconWrap,
    iconUrl: app.icon,
    altText: app.name,
    imageClassName: "app-icon",
    fallbackText: getInitials(app.name),
  });

  const checkbox = card.querySelector(".app-checkbox");

  checkbox.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  checkbox.addEventListener("change", () => {
    handleSelection(app.id, checkbox.checked);
  });

  card.addEventListener("click", () => {
    handleSelection(app.id);
  });

  return card;
}

function renderApps() {
  const root = document.createElement("div");
  root.className = "app-grid-root";

  if (state.loading) {
    root.innerHTML = `
      <div class="loading-state">
        <p>Loading...</p>
      </div>
    `;
    return root;
  }

  if (state.error) {
    root.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">Could not load apps</p>
        <p class="empty-sub">${escapeHtml(state.error)}</p>
      </div>
    `;
    return root;
  }

  const grouped = getGroupedApps();
  const categoryKeys = Object.keys(grouped);
  const popularApps = state.activeCategory === "all" ? getPopularApps() : [];

  if (categoryKeys.length === 0 && popularApps.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <p class="empty-title">No apps found</p>
        <p class="empty-sub">Try a different search or category</p>
      </div>
    `;
    return root;
  }

  if (popularApps.length > 0) {
    const popularSection = document.createElement("section");
    popularSection.className = "cat-section popular-section";
    popularSection.innerHTML = `
      <div class="cat-heading-row">
        <span class="cat-dot" style="background:#2563eb"></span>
        <h2 class="cat-heading">Popular Apps & Software</h2>
      </div>
    `;

    const popularGrid = document.createElement("div");
    popularGrid.className = "app-grid";
    popularApps.forEach((app) => {
      popularGrid.appendChild(createAppCard(app));
    });

    popularSection.appendChild(popularGrid);
    root.appendChild(popularSection);
  }

  categoryKeys.forEach((categoryId) => {
    const section = document.createElement("section");
    section.className = "cat-section";
    section.innerHTML = `
      <div class="cat-heading-row">
        <span class="cat-dot" style="background:${CAT_COLORS[categoryId] || "#aaa"}"></span>
        <h2 class="cat-heading">${CAT_LABELS[categoryId] || categoryId}</h2>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "app-grid";

    grouped[categoryId].forEach((app) => {
      grid.appendChild(createAppCard(app));
    });

    section.appendChild(grid);
    root.appendChild(section);
  });

  return root;
}

function createSidePanel() {
  const panel = document.createElement("aside");
  panel.className = "side-panel";
  const apps = getSelectedApps();
  const count = apps.length;

  panel.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">Your bundle</span>
      ${count > 0 ? '<button class="panel-clear">Clear all</button>' : ""}
    </div>
    ${
      count === 0
        ? `
      <div class="panel-empty">
        <p class="panel-empty-text">Click apps to add them to your bundle</p>
      </div>
    `
        : `
      <div class="panel-apps"></div>
      ${state.os === "windows" ? `
      <div class="method-picker">
        <p class="method-label">Install via</p>
        <div class="method-btns">
          <button class="method-btn ${state.method === "winget" ? "active" : ""}" data-method="winget">winget</button>
          <button class="method-btn ${state.method === "choco" ? "active" : ""}" data-method="choco">Chocolatey</button>
        </div>
      </div>
      ` : ""}
    `
    }
    <button class="get-btn ${count === 0 ? "disabled" : ""}" ${count === 0 ? "disabled" : ""}>
      ${count === 0 ? "Select apps first" : `Generate Script <span class="get-btn-count">${count}</span>`}
    </button>
    <div class="script-result ${state.generatedScript ? "" : "hidden"}">
      <p class="script-result-title">Install commands</p>
      <textarea class="script-output" readonly>${escapeHtml(state.generatedScript)}</textarea>
      <div class="script-actions">
        <button class="script-action-btn script-copy-btn" type="button">Copy Script</button>
        <button class="script-action-btn script-download-btn" type="button">Download File</button>
      </div>
    </div>
  `;

  if (count > 0) {
    const appsContainer = panel.querySelector(".panel-apps");
    apps.forEach((app, index) => {
      const row = document.createElement("div");
      row.className = "panel-app-row app-row-enter";
      row.style.animationDelay = `${index * 40}ms`;
      row.innerHTML = `
        <div class="panel-app-left">
          <span class="panel-app-icon-wrap" style="background:${app.color ? `${app.color}18` : "var(--bg-soft)"};border-color:${app.color ? `${app.color}28` : "var(--border)"}"></span>
          <span class="panel-app-name">${escapeHtml(app.name)}</span>
        </div>
        <button class="panel-app-remove" aria-label="Remove ${escapeHtml(app.name)}">✕</button>
      `;

      const iconWrap = row.querySelector(".panel-app-icon-wrap");
      mountIconWithFallback({
        container: iconWrap,
        iconUrl: app.icon,
        altText: app.name,
        imageClassName: "panel-app-icon",
        fallbackText: getInitials(app.name),
      });

      row.querySelector(".panel-app-remove").addEventListener("click", () => {
        handleSelection(app.id, false);
      });

      appsContainer.appendChild(row);
    });
  }

  const clearButton = panel.querySelector(".panel-clear");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      state.selectedIds.clear();
      state.generatedScript = "";
      renderApp();
    });
  }

  panel.querySelectorAll(".method-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.method = button.dataset.method;
      state.generatedScript = "";
      renderApp();
    });
  });

  const generateButton = panel.querySelector(".get-btn");
  generateButton.addEventListener("click", () => {
    if (count === 0) return;
    state.generatedScript = generateScript(apps);
    renderApp();
  });

  const copyButton = panel.querySelector(".script-copy-btn");
  const downloadButton = panel.querySelector(".script-download-btn");
  if (copyButton) copyButton.addEventListener("click", copyGeneratedScript);
  if (downloadButton) downloadButton.addEventListener("click", downloadGeneratedScript);

  return panel;
}

// -----------------------------
// App render + data loading
// -----------------------------

function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "app-layout";
  layout.appendChild(createHeader());
  layout.appendChild(createFilters());

  const contentArea = document.createElement("div");
  contentArea.className = "content-area";

  const main = document.createElement("main");
  main.className = "main-content";
  main.appendChild(renderApps());

  contentArea.appendChild(main);
  contentArea.appendChild(createSidePanel());
  layout.appendChild(contentArea);
  app.appendChild(layout);
}

async function loadApps(selectedOs = state.os) {
  state.loading = true;
  state.error = "";
  renderApp();

  const requestUrl = buildAppsApiUrl(selectedOs);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(requestUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status} ${response.statusText || "Unknown status"}`);
    }

    const apps = await response.json();
    if (!Array.isArray(apps)) {
      throw new Error("API response must be an array of apps");
    }

    const parsedApps = apps.map((appItem) => ({
      ...appItem,
      _searchName: (appItem.name || "").toLowerCase(),
      _searchDesc: (appItem.desc || "").toLowerCase(),
    }));
    state.apps = parsedApps;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      state.error = `The request to ${requestUrl} timed out. Make sure the backend server is running.`;
    } else if (error instanceof SyntaxError) {
      state.error = `The backend at ${requestUrl} returned invalid JSON. Check apps.json and the server logs.`;
    } else if (error instanceof TypeError) {
      state.error = `Could not reach the backend at ${requestUrl}. Start the Node.js server and try again.`;
    } else {
      state.error = error instanceof Error
        ? error.message
        : `Unable to load apps from ${requestUrl}.`;
    }
    state.apps = [];
  } finally {
    window.clearTimeout(timeoutId);
    state.loading = false;
    renderApp();
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  applyTheme(getInitialTheme(), { persist: false });
  renderApp();
  showOsSelectionOverlay();
});
