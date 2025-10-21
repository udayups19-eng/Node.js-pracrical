const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Routes mapping
const routes = [
  { route: "/", file: "index.html" },
  { route: "/home", file: "index.html" }, // redundant
  { route: "/about", file: "about.html" },
];

const PUBLIC_DIR = path.join(__dirname, "public");

// Function to get canonical file path
function canonicalFilePath(fileRelative) {
  const candidate = path.join(PUBLIC_DIR, fileRelative);
  return fs.realpathSync(candidate);
}

// Detect redundancy
const canonicalMap = new Map();
const duplicates = new Map();

routes.forEach(({ route, file }) => {
  const canon = canonicalFilePath(file);
  if (!canonicalMap.has(canon)) {
    canonicalMap.set(canon, route);
    duplicates.set(canon, [route]);
  } else {
    duplicates.get(canon).push(route);
  }
});

// Show redundancy info
console.log("Detected route -> canonical file groups:");
for (const [canon, routelist] of duplicates.entries()) {
  console.log("File:", canon);
  console.log("Routes:", routelist.join(", "));
  if (routelist.length > 1) {
    console.log("-> Redundancy detected. Canonical route:", canonicalMap.get(canon));
  }
}

app.use(express.static(PUBLIC_DIR));

routes.forEach(({ route, file }) => {
  const canon = canonicalFilePath(file);
  const canonicalRoute = canonicalMap.get(canon);
  if (canonicalRoute !== route) {
    app.get(route, (req, res) => res.redirect(301, canonicalRoute));
  } else {
    app.get(route, (req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
  }
});

app.listen(PORT, () => {
  console.log(` Server started on http://localhost:${PORT}`);
});
