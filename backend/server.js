const express = require("express");
const cors = require("cors");
const compression = require("compression");
const fs = require("fs");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const APPS_FILE_PATH = path.join(__dirname, "apps.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
const INDEX_FILE_PATH = path.join(FRONTEND_DIR, "index.html");
const FAVICON_FILE_PATH = path.join(FRONTEND_DIR, "favicon.ico");
const REQUIRED_FIELDS = ["id", "name", "category", "desc", "wingetId", "brewId", "aptId", "icon", "color"];

function getAllowedOrigins() {
  return new Set([
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean));
}

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "OPTIONS"],
  optionsSuccessStatus: 204,
};

function loadAppsFromFile() {
  let raw;
  try {
    raw = fs.readFileSync(APPS_FILE_PATH, "utf-8");
  } catch (error) {
    console.error(`Error reading apps.json from ${APPS_FILE_PATH}`, error);
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error(`Error parsing apps.json from ${APPS_FILE_PATH}`, error);
    throw error;
  }

  if (!Array.isArray(parsed)) {
    throw new Error("apps.json must contain an array");
  }

  // Validate once at startup so request handling stays fast, even with large datasets.
  parsed.forEach((appItem, index) => {
    const missing = REQUIRED_FIELDS.filter((field) => !(field in appItem));
    if (missing.length > 0) {
      throw new Error(`apps.json item at index ${index} is missing fields: ${missing.join(", ")}`);
    }
  });

  console.log(`apps.json loaded successfully from ${APPS_FILE_PATH}`);
  return parsed;
}

let apps;

try {
  apps = loadAppsFromFile();
} catch (error) {
  console.error("Failed to load apps.json", error);
  process.exit(1);
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://img.icons8.com"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(express.json());

app.get("/apps", (req, res) => {
  res.json(apps);
});

app.get("/favicon.ico", (req, res) => {
  if (fs.existsSync(FAVICON_FILE_PATH)) {
    res.setHeader("Cache-Control", "public, max-age=604800");
    res.sendFile(FAVICON_FILE_PATH);
    return;
  }

  res.status(204).end();
});

app.use(express.static(FRONTEND_DIR, {
  setHeaders(res, filePath) {
    const fileName = path.basename(filePath);

    if (fileName === "index.html") {
      res.setHeader("Cache-Control", "no-cache");
      return;
    }

    if (filePath.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return;
    }

    res.setHeader("Cache-Control", "public, max-age=3600");
  },
}));

app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(INDEX_FILE_PATH);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Serving frontend from ${FRONTEND_DIR}`);
});
