const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const APPS_FILE_PATH = path.join(__dirname, "apps.json");
const REQUIRED_FIELDS = ["id", "name", "category", "desc", "wingetId", "brewId", "aptId", "icon", "color"];

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

const apps = loadAppsFromFile();
console.log(`Loaded ${apps.length} apps from apps.json`);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/apps", (req, res) => {
  console.log("GET /apps received - returning app data");
  res.json(apps);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
