const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const APPS_FILE_PATH = path.join(__dirname, "apps.json");
const REQUIRED_FIELDS = ["id", "name", "category", "desc", "wingetId", "brewId", "aptId", "icon", "color"];
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function getAllowedOrigins() {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);
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
  const raw = fs.readFileSync(APPS_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw);

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
app.use(express.json());

app.get("/apps", (req, res) => {
  res.json(apps);
});

app.listen(PORT);
