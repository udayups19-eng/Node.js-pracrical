const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const NODE_MODULES = path.join(__dirname, "node_modules");

// Helper: compute SHA-256 of a folder (all files)
function hashFolder(folderPath) {
  const hash = crypto.createHash("sha256");

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const data = fs.readFileSync(fullPath);
        hash.update(data);
      }
    }
  }

  walk(folderPath);
  return hash.digest("hex");
}

// Helper: find license file
function findLicense(folderPath) {
  const licenseFiles = ["LICENSE", "LICENSE.md", "LICENSE.txt", "license"];
  for (const file of licenseFiles) {
    if (fs.existsSync(path.join(folderPath, file))) return file;
  }
  return null;
}

// Recursive function to read dependencies and build graph
function scanPackage(pkgPath, graph = {}, visited = new Set()) {
  const pkgJsonPath = path.join(pkgPath, "package.json");
  if (!fs.existsSync(pkgJsonPath)) return;

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const pkgName = pkgJson.name + "@" + pkgJson.version;

  if (visited.has(pkgName)) return; // avoid cycles
  visited.add(pkgName);

  // Compute hash and license
  const hash = hashFolder(pkgPath);
  const licenseFile = findLicense(pkgPath);

  graph[pkgName] = {
    path: pkgPath,
    hash,
    license: licenseFile || "MISSING",
    dependencies: {},
  };

  const deps = Object.assign({}, pkgJson.dependencies, pkgJson.optionalDependencies);
  for (const depName of Object.keys(deps)) {
    const depPath = path.join(pkgPath, "node_modules", depName);
    if (fs.existsSync(depPath)) {
      scanPackage(depPath, graph[pkgName].dependencies, visited);
    }
  }

  return graph;
}

// Scan top-level node_modules
function scanAllModules() {
  const graph = {};
  if (!fs.existsSync(NODE_MODULES)) {
    console.error("No node_modules folder found!");
    return;
  }

  const modules = fs.readdirSync(NODE_MODULES).filter((d) => !d.startsWith("."));
  for (const mod of modules) {
    // Handle scoped packages (@scope/pkg)
    if (mod.startsWith("@")) {
      const scoped = fs.readdirSync(path.join(NODE_MODULES, mod));
      for (const sub of scoped) {
        const fullPath = path.join(NODE_MODULES, mod, sub);
        scanPackage(fullPath, graph);
      }
    } else {
      const fullPath = path.join(NODE_MODULES, mod);
      scanPackage(fullPath, graph);
    }
  }

  return graph;
}

// Run and save output
const depGraph = scanAllModules();
fs.writeFileSync("dependency-graph.json", JSON.stringify(depGraph, null, 2));
console.log(" Dependency graph generated: dependency-graph.json");

// Report packages missing license
console.log("\nPackages missing LICENSE:");
for (const pkgName of Object.keys(depGraph)) {
  if (depGraph[pkgName].license === "MISSING") console.log(" -", pkgName);
}
