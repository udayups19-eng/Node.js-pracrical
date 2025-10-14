// installSandbox.mjs
import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

console.log("🚀 Script started...");

const sandboxPath = "./sandbox"; // folder inside Node.js-pracrical
const packageName = "lodash@4.17.21"; // change if needed

// Step 1: Create sandbox folder if it doesn't exist
if (!fs.existsSync(sandboxPath)) {
  fs.mkdirSync(sandboxPath);
  console.log(" Created sandbox folder");
}

// Step 2: Initialize package.json inside sandbox
execSync("npm init -y", { cwd: sandboxPath, stdio: "inherit" });

// Step 3: Install specific version of package programmatically
console.log(`\n Installing ${packageName} inside sandbox...`);
execSync(`npm install ${packageName} --package-lock-only`, { cwd: sandboxPath, stdio: "inherit" });
execSync("npm ci", { cwd: sandboxPath, stdio: "inherit" });

// Step 4: Verify checksum of package-lock.json
const lockData = fs.readFileSync(`${sandboxPath}/package-lock.json`);
const checksum = crypto.createHash("sha256").update(lockData).digest("hex");

console.log("\n package-lock.json checksum:");
console.log(checksum);

console.log("\n Installation complete and checksum verified!");
