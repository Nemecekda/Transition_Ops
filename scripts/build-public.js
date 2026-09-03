"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const PUBLIC_FILES = Object.freeze([
  "BingSiteAuth.xml",
  "OneSignalSDKWorker.js",
  "_headers",
  "_redirects",
  "bdd-timeline/index.html",
  "erg-employer-brief.html",
  "erg-handoff.html",
  "erg-intranet-launch-kit.html",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "manifest.json",
  "og-image.png",
  "push/onesignal/OneSignalSDKWorker.js",
  "pwa-sw.js",
  "robots.txt",
  "sitemap.xml",
  "sw.js",
  "transition-ops-public-qr.png",
  "va-math/index.html",
  "vendor/react-dom.production.min.js",
  "vendor/react.production.min.js"
]);

const BLOCKED_TOP_LEVEL = new Set([
  ".agents",
  ".claude",
  ".git",
  ".github",
  "design",
  "dist",
  "intel",
  "netlify",
  "node_modules",
  "outreach",
  "scripts",
  "tools"
]);

const BLOCKED_BASENAMES = new Set([
  "navigator-pilot.html",
  "package.json",
  "package-lock.json"
]);

function fail(message) {
  throw new Error(message);
}

function validateManifest(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    fail("Public allowlist must be a non-empty array");
  }

  const seen = new Set();
  entries.forEach(function(relativePath) {
    if (typeof relativePath !== "string" || relativePath === "") {
      fail("Public allowlist contains an empty or non-string entry");
    }
    if (relativePath.startsWith("/") || relativePath.includes("\\") ||
        path.posix.normalize(relativePath) !== relativePath ||
        relativePath.endsWith("/")) {
      fail("Public allowlist path is not a normalized relative file: " + relativePath);
    }
    if (seen.has(relativePath)) {
      fail("Public allowlist contains a duplicate: " + relativePath);
    }
    seen.add(relativePath);

    if (/\.(?:md|markdown)$/i.test(relativePath)) {
      fail("Markdown is not publishable: " + relativePath);
    }
    if (BLOCKED_TOP_LEVEL.has(relativePath.split("/")[0])) {
      fail("Internal path is not publishable: " + relativePath);
    }
    if (BLOCKED_BASENAMES.has(path.posix.basename(relativePath))) {
      fail("Blocked file is not publishable: " + relativePath);
    }
  });

  const sorted = entries.slice().sort();
  if (JSON.stringify(entries) !== JSON.stringify(sorted)) {
    fail("Public allowlist must remain sorted");
  }
}

function validateSourceEntry(root, relativePath) {
  let cursor = root;
  const parts = relativePath.split("/");

  parts.forEach(function(part, index) {
    cursor = path.join(cursor, part);
    let stat;
    try {
      stat = fs.lstatSync(cursor);
    } catch (error) {
      if (error && error.code === "ENOENT") {
        fail("Missing public source: " + relativePath);
      }
      throw error;
    }

    if (stat.isSymbolicLink()) {
      fail("Symlink public source is prohibited: " + relativePath);
    }
    if (index < parts.length - 1 && !stat.isDirectory()) {
      fail("Non-directory public source parent: " + relativePath);
    }
    if (index === parts.length - 1 && !stat.isFile()) {
      fail("Nonregular public source is prohibited: " + relativePath);
    }
  });

  const realRoot = fs.realpathSync(root);
  const realSource = fs.realpathSync(cursor);
  const relativeRealPath = path.relative(realRoot, realSource);
  if (relativeRealPath.startsWith(".." + path.sep) || path.isAbsolute(relativeRealPath)) {
    fail("Public source escapes the repository: " + relativePath);
  }
}

function validateSources(root, entries) {
  validateManifest(entries);
  entries.forEach(function(relativePath) {
    validateSourceEntry(root, relativePath);
  });
}

function expectedDirectories(entries) {
  const directories = new Set();
  entries.forEach(function(relativePath) {
    let directory = path.posix.dirname(relativePath);
    while (directory !== ".") {
      directories.add(directory);
      directory = path.posix.dirname(directory);
    }
  });
  return Array.from(directories).sort();
}

function inventoryTree(root) {
  if (!fs.existsSync(root)) return { files: [], directories: [] };

  const rootStat = fs.lstatSync(root);
  if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
    fail("Publish output root must be a real directory");
  }

  const files = [];
  const directories = [];

  function walk(directory, prefix) {
    fs.readdirSync(directory).sort().forEach(function(name) {
      const absolutePath = path.join(directory, name);
      const relativePath = prefix ? prefix + "/" + name : name;
      const stat = fs.lstatSync(absolutePath);

      if (stat.isSymbolicLink()) {
        fail("Symlink publish output is prohibited: " + relativePath);
      }
      if (stat.isDirectory()) {
        directories.push(relativePath);
        walk(absolutePath, relativePath);
        return;
      }
      if (!stat.isFile()) {
        fail("Nonregular publish output is prohibited: " + relativePath);
      }
      files.push(relativePath);
    });
  }

  walk(root, "");
  return { files: files.sort(), directories: directories.sort() };
}

function assertSameList(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    fail(label + " mismatch: expected=" + expectedJson + " actual=" + actualJson);
  }
}

function assertExistingOutputSafe(outputRoot, entries) {
  if (!fs.existsSync(outputRoot)) return;
  const inventory = inventoryTree(outputRoot);
  const allowedFiles = new Set(entries);
  const allowedDirectories = new Set(expectedDirectories(entries));

  inventory.files.forEach(function(relativePath) {
    if (!allowedFiles.has(relativePath)) fail("Extra publish output is prohibited: " + relativePath);
  });
  inventory.directories.forEach(function(relativePath) {
    if (!allowedDirectories.has(relativePath)) fail("Extra publish directory is prohibited: " + relativePath);
  });
}

function assertOutputExact(outputRoot, entries) {
  const inventory = inventoryTree(outputRoot);
  assertSameList(inventory.files, entries.slice().sort(), "Published file inventory");
  assertSameList(inventory.directories, expectedDirectories(entries), "Published directory inventory");
  if (inventory.files.some(function(relativePath) { return /\.(?:md|markdown)$/i.test(relativePath); })) {
    fail("Markdown appeared in publish output");
  }
  return inventory;
}

function buildPublic() {
  validateSources(ROOT, PUBLIC_FILES);
  assertExistingOutputSafe(DIST, PUBLIC_FILES);

  let temporaryRoot = fs.mkdtempSync(path.join(ROOT, ".dist-build-"));
  try {
    PUBLIC_FILES.forEach(function(relativePath) {
      const source = path.join(ROOT, ...relativePath.split("/"));
      const destination = path.join(temporaryRoot, ...relativePath.split("/"));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(source, destination);
    });

    assertOutputExact(temporaryRoot, PUBLIC_FILES);
    if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
    fs.renameSync(temporaryRoot, DIST);
    temporaryRoot = null;
    assertOutputExact(DIST, PUBLIC_FILES);
    console.log("PUBLIC BUILD PASS: " + PUBLIC_FILES.length + " files -> dist");
  } finally {
    if (temporaryRoot && fs.existsSync(temporaryRoot)) {
      fs.rmSync(temporaryRoot, { recursive: true });
    }
  }
}

module.exports = {
  BLOCKED_BASENAMES,
  BLOCKED_TOP_LEVEL,
  DIST,
  PUBLIC_FILES,
  ROOT,
  assertExistingOutputSafe,
  assertOutputExact,
  buildPublic,
  inventoryTree,
  validateManifest,
  validateSources
};

if (require.main === module) {
  try {
    buildPublic();
  } catch (error) {
    console.error("PUBLIC BUILD FAIL: " + String(error && error.message || error));
    process.exitCode = 1;
  }
}
