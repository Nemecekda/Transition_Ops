"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const TARGET_MINIMUM = 44;
const SCENARIOS = Object.freeze([
  { name: "320 portrait default", width: 320, height: 640, orientation: "portraitPrimary", zoom: 1 },
  { name: "375 portrait default", width: 375, height: 667, orientation: "portraitPrimary", zoom: 1 },
  { name: "320 landscape default", width: 640, height: 320, orientation: "landscapePrimary", zoom: 1 },
  { name: "375 landscape default", width: 667, height: 375, orientation: "landscapePrimary", zoom: 1 },
  { name: "320 portrait 200 percent", width: 320, height: 640, orientation: "portraitPrimary", zoom: 2 },
  { name: "375 portrait 200 percent", width: 375, height: 667, orientation: "portraitPrimary", zoom: 2 },
  { name: "320 landscape 200 percent", width: 640, height: 320, orientation: "landscapePrimary", zoom: 2 },
  { name: "375 landscape 200 percent", width: 667, height: 375, orientation: "landscapePrimary", zoom: 2 },
  { name: "320 portrait 400 percent", width: 320, height: 640, orientation: "portraitPrimary", zoom: 4 },
  { name: "375 portrait 400 percent", width: 375, height: 667, orientation: "portraitPrimary", zoom: 4 },
  { name: "320 landscape 400 percent", width: 640, height: 320, orientation: "landscapePrimary", zoom: 4 },
  { name: "375 landscape 400 percent", width: 667, height: 375, orientation: "landscapePrimary", zoom: 4 }
]);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function digest(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(ROOT, relativePath)))
    .digest("hex");
}

function check(condition, label, detail) {
  if (!condition) throw new Error("FAIL " + label + (detail ? ": " + detail : ""));
  console.log("PASS " + label);
}

function staticChecks() {
  const index = read("index.html");
  const manifest = JSON.parse(read("manifest.json"));
  const viewport = (index.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i) || [])[1] || "";
  check(/<html\b[^>]*\blang=["'][^"']+["']/i.test(index), "document source declares a language");
  check(/<title>\s*[^<]+\s*<\/title>/i.test(index), "document source declares a nonempty title");
  check(!/user-scalable\s*=\s*no/i.test(viewport), "viewport does not disable user scaling");
  check(!/maximum-scale\s*=\s*(?:0|1(?:\.0*)?)(?:\D|$)/i.test(viewport), "viewport does not cap required zoom");
  check(!/screen\s*\.\s*orientation\s*\.\s*lock\s*\(/.test(index), "browser source does not force orientation");
  check(!manifest.orientation || /^(?:any|natural)$/.test(manifest.orientation), "manifest does not force orientation");
  check(/@media\s*\([^)]*prefers-reduced-motion\s*:\s*reduce[^)]*\)/i.test(index), "source defines a reduced-motion mode");
}

function sanitizeIndex(source) {
  return source.replace(
    /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']https?:\/\/)[^>]*>\s*/gi,
    ""
  );
}

function sanitizeWorker(source) {
  return source.split("\n").filter(function(line) {
    return !/^\s*["']https?:\/\//.test(line);
  }).join("\n");
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  })[ext] || "application/octet-stream";
}

function createAppServer() {
  const index = sanitizeIndex(read("index.html"));
  const worker = sanitizeWorker(read("pwa-sw.js"));
  return http.createServer(function(request, response) {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname); }
    catch (error) { response.writeHead(400).end("bad request"); return; }

    if (pathname === "/" || pathname === "/index.html") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      response.end(index);
      return;
    }
    if (pathname === "/pwa-sw.js") {
      response.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
        "Service-Worker-Allowed": "/"
      });
      response.end(worker);
      return;
    }

    let candidate = path.resolve(ROOT, pathname.replace(/^\/+/, ""));
    if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) {
      response.writeHead(403).end("forbidden");
      return;
    }
    try {
      if (fs.statSync(candidate).isDirectory()) candidate = path.join(candidate, "index.html");
      response.writeHead(200, { "Content-Type": contentType(candidate), "Cache-Control": "no-store" });
      response.end(fs.readFileSync(candidate));
    } catch (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("not found");
    }
  });
}

function createBlockingProxy() {
  const attempts = [];
  const server = http.createServer(function(request, response) {
    attempts.push(String(request.url));
    response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("external network disabled by accessibility regression");
  });
  server.on("connect", function(request, socket) {
    attempts.push("https://" + String(request.url));
    socket.on("error", function() {});
    socket.end("HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n");
  });
  return { server, attempts };
}

function listen(server) {
  return new Promise(function(resolve, reject) {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", function() {
      server.removeListener("error", reject);
      resolve(server.address().port);
    });
  });
}

function closeServer(server) {
  return new Promise(function(resolve) {
    if (!server.listening) return resolve();
    server.close(function() { resolve(); });
  });
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe")
  ].filter(Boolean);
  return candidates.find(function(candidate) {
    try { fs.accessSync(candidate, fs.constants.X_OK); return true; }
    catch (error) { return false; }
  }) || "";
}

function delay(milliseconds) {
  return new Promise(function(resolve) { setTimeout(resolve, milliseconds); });
}

async function waitForFile(filePath, child, stderrText) {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return;
    if (child.exitCode !== null) throw new Error("Chrome exited before CDP became ready: " + stderrText());
    await delay(50);
  }
  throw new Error("Chrome CDP did not become ready within 12 seconds: " + stderrText());
}

class CdpClient {
  constructor(url) {
    if (typeof WebSocket !== "function") throw new Error("Node 22 or newer with built-in WebSocket is required");
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      let message;
      try { message = JSON.parse(String(event.data)); } catch (error) { return; }
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
        else pending.resolve(message.result || {});
        return;
      }
      (this.listeners.get(message.method) || []).forEach(function(listener) {
        listener(message.params || {});
      });
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  async send(method, params) {
    await this.ready;
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("CDP timeout for " + method));
      }, 12000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }

  close() {
    try { this.socket.close(); } catch (error) {}
  }
}

async function launchChrome(chromePath, proxyPort) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "tops-a11y-chrome-"));
  const args = [
    "--headless=new",
    "--remote-debugging-port=0",
    "--user-data-dir=" + profile,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-domain-reliability",
    "--disable-sync",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--metrics-recording-only",
    "--safebrowsing-disable-auto-update",
    "--disable-features=AutofillServerCommunication,MediaRouter,OptimizationHints,Translate",
    "--password-store=basic",
    "--use-mock-keychain",
    "--proxy-server=http://127.0.0.1:" + proxyPort,
    "--proxy-bypass-list=127.0.0.1;localhost",
    "--window-size=1400,1000",
    "about:blank"
  ];
  if (typeof process.getuid === "function" && process.getuid() === 0) args.unshift("--no-sandbox");
  const child = spawn(chromePath, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  child.stderr.on("data", function(chunk) { stderr = (stderr + chunk.toString()).slice(-12000); });
  const activePortFile = path.join(profile, "DevToolsActivePort");
  await waitForFile(activePortFile, child, function() { return stderr; });
  const port = Number(fs.readFileSync(activePortFile, "utf8").trim().split(/\r?\n/)[0]);
  if (!Number.isInteger(port) || port <= 0) throw new Error("Chrome wrote an invalid CDP port");
  const response = await fetch("http://127.0.0.1:" + port + "/json/list");
  const targets = await response.json();
  const page = targets.find(function(target) { return target.type === "page"; });
  if (!page || !page.webSocketDebuggerUrl) throw new Error("Chrome exposed no page target");
  return { child, profile, client: new CdpClient(page.webSocketDebuggerUrl), stderr: function() { return stderr; } };
}

async function stopChrome(chrome) {
  if (!chrome) return;
  if (chrome.client) chrome.client.close();
  if (chrome.child && chrome.child.exitCode === null) {
    chrome.child.kill("SIGTERM");
    await Promise.race([
      new Promise(function(resolve) { chrome.child.once("exit", resolve); }),
      delay(2000)
    ]);
    if (chrome.child.exitCode === null) chrome.child.kill("SIGKILL");
  }
  if (chrome.profile) fs.rmSync(chrome.profile, { recursive: true, force: true });
}

async function evaluate(client, expression, awaitPromise) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: !!awaitPromise,
    returnByValue: true,
    userGesture: true
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception && result.exceptionDetails.exception.description;
    throw new Error("browser evaluation failed: " + (description || result.exceptionDetails.text || "unknown exception"));
  }
  return result.result ? result.result.value : undefined;
}

async function waitForExpression(client, expression, label, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    try {
      last = await evaluate(client, expression, true);
      if (last) return last;
    } catch (error) { last = error.message; }
    await delay(100);
  }
  throw new Error("required rendered evidence unavailable for " + label + "; last=" + JSON.stringify(last));
}

const LOCAL_FIXTURE_SCRIPT = String.raw`
(() => {
  try {
    localStorage.setItem("tops_onboarded", "1");
    localStorage.setItem("tops_user_status", "synthetic");
  } catch (error) {}
  window.__topsA11yNetwork = [];
  try {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      window.__topsA11yNetwork.push(String(url));
      return originalFetch.call(this, input, init);
    };
  } catch (error) {}
})();`;

const DOCUMENT_AUDIT = String.raw`((zoomFactor) => {
  const failures = [];
  const push = (message) => { if (failures.length < 80) failures.push(message); };
  const styleOf = (element) => getComputedStyle(element);
  const visible = (element) => {
    if (!(element instanceof Element)) return false;
    const style = styleOf(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0 && rect.width > 0 && rect.height > 0;
  };
  const textForIds = (value) => String(value || "").trim().split(/\s+/).map((id) => document.getElementById(id)).filter(Boolean).map((node) => node.textContent || "").join(" ").trim();
  const nameOf = (element) => {
    const labelled = textForIds(element.getAttribute("aria-labelledby"));
    if (labelled) return labelled;
    const aria = (element.getAttribute("aria-label") || "").trim();
    if (aria) return aria;
    if (element.labels && element.labels.length) {
      const label = Array.from(element.labels).map((node) => node.textContent || "").join(" ").trim();
      if (label) return label;
    }
    if (element.tagName === "IMG") return (element.getAttribute("alt") || "").trim();
    if (element.tagName === "INPUT" && /^(?:button|submit|reset)$/.test(element.type)) return (element.value || "").trim();
    const title = (element.getAttribute("title") || "").trim();
    const text = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
    return aria || text || title;
  };
  const selectorFor = (element) => {
    const id = element.id ? "#" + element.id : "";
    const role = element.getAttribute("role") ? "[role=" + element.getAttribute("role") + "]" : "";
    return element.tagName.toLowerCase() + id + role + " " + JSON.stringify(nameOf(element).slice(0, 50));
  };
  const focusableSelector = "a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex],[contenteditable=true]";
  const interactiveSelector = "a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=checkbox],[role=radio],[role=switch],[tabindex]";
  const allowedRoles = new Set(["alert","alertdialog","application","article","banner","button","cell","checkbox","columnheader","combobox","complementary","contentinfo","definition","dialog","directory","document","feed","figure","form","generic","grid","gridcell","group","heading","img","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","meter","navigation","none","note","option","presentation","progressbar","radio","radiogroup","region","row","rowgroup","rowheader","scrollbar","search","searchbox","separator","slider","spinbutton","status","switch","tab","table","tablist","tabpanel","term","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem"]);

  if (!(document.documentElement.lang || "").trim()) push("document language is missing");
  if (!(document.title || "").trim()) push("document title is missing");

  const mains = Array.from(document.querySelectorAll("main,[role=main]")).filter(visible);
  if (mains.length !== 1) push("expected exactly one visible main landmark; found " + mains.length);
  const navs = Array.from(document.querySelectorAll("nav,[role=navigation]")).filter(visible);
  if (!navs.length) push("no visible navigation landmark");
  navs.forEach((nav) => { if (!nameOf(nav)) push("navigation landmark has no accessible name"); });

  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]")).filter(visible);
  const h1s = headings.filter((heading) => heading.tagName === "H1" || (heading.getAttribute("role") === "heading" && heading.getAttribute("aria-level") === "1"));
  if (h1s.length !== 1) push("expected one visible level-one heading; found " + h1s.length);
  let priorLevel = 0;
  headings.forEach((heading) => {
    const level = heading.getAttribute("role") === "heading" ? Number(heading.getAttribute("aria-level")) : Number(heading.tagName.slice(1));
    if (!nameOf(heading)) push("empty heading " + selectorFor(heading));
    if (!Number.isInteger(level) || level < 1 || level > 6) push("invalid heading level " + selectorFor(heading));
    if (priorLevel && level > priorLevel + 1) push("heading level jumps from " + priorLevel + " to " + level + " at " + selectorFor(heading));
    priorLevel = level;
  });

  const ids = new Map();
  document.querySelectorAll("[id]").forEach((element) => {
    const count = (ids.get(element.id) || 0) + 1;
    ids.set(element.id, count);
  });
  ids.forEach((count, id) => { if (count > 1) push("duplicate id " + JSON.stringify(id) + " appears " + count + " times"); });

  document.querySelectorAll("[role]").forEach((element) => {
    String(element.getAttribute("role") || "").trim().split(/\s+/).forEach((role) => {
      if (role && !allowedRoles.has(role)) push("invalid role " + JSON.stringify(role) + " on " + selectorFor(element));
    });
  });
  ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns"].forEach((attribute) => {
    document.querySelectorAll("[" + attribute + "]").forEach((element) => {
      String(element.getAttribute(attribute) || "").trim().split(/\s+/).filter(Boolean).forEach((id) => {
        if (!document.getElementById(id)) push(attribute + " references missing id " + JSON.stringify(id) + " on " + selectorFor(element));
      });
    });
  });

  document.querySelectorAll('[aria-hidden="true"]').forEach((element) => {
    const hiddenFocusable = Array.from(element.querySelectorAll(focusableSelector)).filter((item) => !item.disabled && item.tabIndex >= 0 && visible(item));
    if (hiddenFocusable.length) push("aria-hidden subtree contains focusable content at " + selectorFor(hiddenFocusable[0]));
  });

  Array.from(document.querySelectorAll(interactiveSelector)).filter(visible).forEach((element) => {
    if (!nameOf(element)) push("interactive control has no accessible name: " + selectorFor(element));
    const name = nameOf(element);
    if (name && !/[\p{L}\p{N}]/u.test(name) && !element.getAttribute("aria-label") && !element.getAttribute("title")) {
      push("symbol-only control needs a descriptive name: " + selectorFor(element));
    }
  });

  Array.from(document.querySelectorAll("input:not([type=hidden]),select,textarea")).filter(visible).forEach((element) => {
    const labelled = !!nameOf(element) && (!!(element.labels && element.labels.length) || !!element.getAttribute("aria-label") || !!element.getAttribute("aria-labelledby"));
    if (!labelled) push("form control lacks a persistent programmatic label: " + selectorFor(element));
  });

  Array.from(document.images).filter(visible).forEach((image) => {
    if (!image.hasAttribute("alt")) push("image is missing alt: " + selectorFor(image));
    if ((image.getAttribute("role") === "presentation" || image.getAttribute("aria-hidden") === "true") && image.getAttribute("alt")) {
      push("decorative image has nonempty alt: " + selectorFor(image));
    }
  });

  Array.from(document.querySelectorAll("body *")).filter(visible).forEach((element) => {
    const propsKey = Object.keys(element).find((key) => key.startsWith("__reactProps$"));
    const props = propsKey && element[propsKey];
    if (!props || typeof props.onClick !== "function") return;
    const native = /^(?:A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(element.tagName);
    if (native) return;
    const role = element.getAttribute("role");
    if (!/^(?:button|link|checkbox|radio|switch|tab|menuitem)$/.test(role || "") || element.tabIndex < 0 || typeof props.onKeyDown !== "function") {
      push("React click target is not keyboard-semantic: " + selectorFor(element));
    }
  });

  const liveRegions = Array.from(document.querySelectorAll('[role="status"],[role="alert"],[aria-live]'));
  if (!liveRegions.length) push("no programmatic status or alert announcement region exists");
  liveRegions.forEach((region) => {
    const live = region.getAttribute("aria-live");
    const role = region.getAttribute("role");
    if (live === "off" || (!live && role !== "status" && role !== "alert")) push("announcement region is not live: " + selectorFor(region));
  });

  const dialogs = Array.from(document.querySelectorAll('[role="dialog"],[role="alertdialog"]')).filter(visible);
  dialogs.forEach((dialog) => {
    if (dialog.getAttribute("aria-modal") !== "true") push("visible dialog is not aria-modal: " + selectorFor(dialog));
    if (!nameOf(dialog)) push("visible dialog has no accessible name: " + selectorFor(dialog));
  });

  const docWidth = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const clientWidth = document.documentElement.clientWidth;
  if (docWidth > clientWidth + 1) push("document has horizontal overflow: scrollWidth=" + docWidth + " clientWidth=" + clientWidth);
  Array.from(document.querySelectorAll("body *")).filter(visible).forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.right <= clientWidth + 1 && rect.left >= -1) return;
    let ancestor = element.parentElement;
    let intentionallyScrollable = false;
    while (ancestor && ancestor !== document.body) {
      const overflow = styleOf(ancestor).overflowX;
      if ((overflow === "auto" || overflow === "scroll") && ancestor.scrollWidth > ancestor.clientWidth) { intentionallyScrollable = true; break; }
      ancestor = ancestor.parentElement;
    }
    if (!intentionallyScrollable && styleOf(element).position !== "fixed") push("content extends outside viewport: " + selectorFor(element));
  });

  const targets = Array.from(document.querySelectorAll("button,input:not([type=hidden]),select,textarea,[role=button],[role=checkbox],[role=radio],[role=switch],summary,a[aria-label],a[title]")).filter(visible);
  targets.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const width = rect.width / zoomFactor;
    const height = rect.height / zoomFactor;
    if (width + 0.5 < ${TARGET_MINIMUM} || height + 0.5 < ${TARGET_MINIMUM}) {
      push("target below ${TARGET_MINIMUM}x${TARGET_MINIMUM}: " + width.toFixed(1) + "x" + height.toFixed(1) + " " + selectorFor(element));
    }
  });

  const parseDurations = (value) => String(value || "").split(",").map((part) => {
    const text = part.trim();
    return text.endsWith("ms") ? Number.parseFloat(text) / 1000 : Number.parseFloat(text) || 0;
  });
  let maxMotionSeconds = 0;
  Array.from(document.querySelectorAll("body *")).filter(visible).forEach((element) => {
    [styleOf(element), getComputedStyle(element, "::before"), getComputedStyle(element, "::after")].forEach((style) => {
      const animation = style.animationName !== "none" ? Math.max(0, ...parseDurations(style.animationDuration)) : 0;
      const transition = style.transitionProperty !== "none" ? Math.max(0, ...parseDurations(style.transitionDuration)) : 0;
      maxMotionSeconds = Math.max(maxMotionSeconds, animation, transition);
    });
  });
  if (maxMotionSeconds > 0.05) push("reduced-motion mode leaves nonessential motion duration " + maxMotionSeconds + "s");

  const parseRgb = (value) => {
    const match = String(value).match(/rgba?\(([^)]+)\)/i);
    if (!match) return null;
    const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.slice(0, 3).some((item) => !Number.isFinite(item))) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1 };
  };
  const luminance = (color) => {
    const channel = (value) => { const v = value / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  };
  const contrast = (a, b) => { const l1 = luminance(a); const l2 = luminance(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const backgroundFor = (element) => {
    let node = element;
    while (node && node instanceof Element) {
      const style = styleOf(node);
      if (style.backgroundImage && style.backgroundImage !== "none") return null;
      const color = parseRgb(style.backgroundColor);
      if (color && color.a >= 0.95) return color;
      node = node.parentElement;
    }
    return parseRgb(styleOf(document.body).backgroundColor);
  };
  Array.from(document.querySelectorAll("body *")).filter((element) => visible(element) && Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())).forEach((element) => {
    const style = styleOf(element);
    const foreground = parseRgb(style.color);
    const background = backgroundFor(element);
    if (!foreground || foreground.a < 0.95 || !background) return;
    const size = Number.parseFloat(style.fontSize) || 0;
    const weight = Number.parseInt(style.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const minimum = large ? 3 : 4.5;
    const ratio = contrast(foreground, background);
    if (ratio + 0.05 < minimum) push("text contrast " + ratio.toFixed(2) + ":1 below " + minimum + ":1 at " + selectorFor(element));
  });

  const portraitExpected = innerHeight >= innerWidth;
  const portraitMedia = matchMedia("(orientation: portrait)").matches;
  if (portraitExpected !== portraitMedia) push("orientation media query does not match viewport geometry");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) push("reduced-motion emulation is not active");

  return {
    failures,
    metrics: {
      clientWidth,
      docWidth,
      headings: headings.length,
      liveRegions: liveRegions.length,
      mainLandmarks: mains.length,
      maxMotionSeconds,
      navigationLandmarks: navs.length,
      targets: targets.length,
      zoom: getComputedStyle(document.documentElement).zoom
    }
  };
})`;

async function dispatchKey(client, key, modifiers) {
  const code = key === "Tab" ? "Tab" : key === "Escape" ? "Escape" : key;
  const windowsVirtualKeyCode = key === "Tab" ? 9 : key === "Escape" ? 27 : key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0;
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key, code, modifiers: modifiers || 0, windowsVirtualKeyCode });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, modifiers: modifiers || 0, windowsVirtualKeyCode });
}

async function runKeyboardChecks(client) {
  await evaluate(client, "(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); window.scrollTo(0, 0); return true; })()", false);
  const visited = new Set();
  for (let index = 0; index < 16; index += 1) {
    await dispatchKey(client, "Tab", 0);
    const info = await evaluate(client, String.raw`(() => {
      const element = document.activeElement;
      if (!element || element === document.body || element === document.documentElement) return { failure: "focus remained on the document" };
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const labelled = String(element.getAttribute("aria-label") || "").trim();
      const text = String(element.innerText || element.value || element.title || "").replace(/\s+/g, " ").trim();
      const name = labelled || text;
      const indicator = (style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none";
      const x = Math.min(innerWidth - 1, Math.max(0, rect.left + Math.min(rect.width / 2, 10)));
      const y = Math.min(innerHeight - 1, Math.max(0, rect.top + Math.min(rect.height / 2, 10)));
      const hit = document.elementFromPoint(x, y);
      return {
        failure: "",
        signature: element.tagName + "|" + name,
        name,
        visible: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden",
        indicator,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
        matchesFocus: element.matches(":focus"),
        matchesFocusVisible: element.matches(":focus-visible"),
        unobscured: !!hit && (hit === element || element.contains(hit) || hit.contains(element))
      };
    })()`, false);
    check(!info.failure, "keyboard Tab moves focus to a control", info.failure);
    check(info.visible, "keyboard-focused control is visible", info.signature);
    check(!!info.name, "keyboard-focused control has an accessible name", info.signature);
    check(info.indicator, "keyboard-focused control has a visible focus indicator", info.signature + " outline=" + info.outlineStyle + "/" + info.outlineWidth + " shadow=" + info.boxShadow + " focus=" + info.matchesFocus + " focusVisible=" + info.matchesFocusVisible);
    check(info.unobscured, "keyboard-focused control is not obscured", info.signature);
    visited.add(info.signature);
  }
  check(visited.size >= 4, "keyboard traversal reaches multiple distinct controls", "distinct=" + visited.size);
}

async function runDialogChecks(client) {
  const opened = await evaluate(client, String.raw`(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const name = (element) => String(element.getAttribute("aria-label") || element.title || element.innerText || "").replace(/\s+/g, " ").trim();
    const controls = Array.from(document.querySelectorAll("button,[role=button]")).filter(visible);
    const patterns = [/privacy|about/i, /^more$/i, /feedback/i, /alerts/i];
    let invoker = null;
    for (const pattern of patterns) {
      invoker = controls.find((control) => pattern.test(name(control)));
      if (invoker) break;
    }
    if (!invoker) return { ok: false, reason: "no visible dialog invoker found" };
    invoker.setAttribute("data-a11y-dialog-invoker", "true");
    invoker.focus();
    const invokerName = name(invoker);
    invoker.click();
    return { ok: true, invokerName };
  })()`, false);
  check(opened.ok, "rendered app exposes a dialog flow", opened.reason);
  await waitForExpression(client, "!!Array.from(document.querySelectorAll('[role=dialog],[role=alertdialog]')).find(d => { const r=d.getBoundingClientRect(); const s=getComputedStyle(d); return r.width>0 && r.height>0 && s.display!=='none' && s.visibility!=='hidden'; })", "visible dialog", 5000);

  const dialog = await evaluate(client, String.raw`(() => {
    const visible = (element) => { const r=element.getBoundingClientRect(); const s=getComputedStyle(element); return r.width>0 && r.height>0 && s.display!=="none" && s.visibility!=="hidden"; };
    const node = Array.from(document.querySelectorAll('[role="dialog"],[role="alertdialog"]')).find(visible);
    const ids = String(node && node.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean);
    const labelled = ids.map((id) => document.getElementById(id)).filter(Boolean).map((el) => el.textContent || "").join(" ").trim();
    const name = labelled || String(node && node.getAttribute("aria-label") || "").trim();
    const focusables = node ? Array.from(node.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"])')).filter(visible) : [];
    return {
      exists: !!node,
      modal: node && node.getAttribute("aria-modal") === "true",
      name,
      focusInside: !!node && node.contains(document.activeElement),
      focusableCount: focusables.length
    };
  })()`, false);
  check(dialog.exists && dialog.modal, "dialog exposes modal semantics");
  check(!!dialog.name, "dialog has an accessible name");
  check(dialog.focusInside, "dialog receives focus on open");
  check(dialog.focusableCount > 0, "dialog contains an operable control");

  for (let index = 0; index < Math.min(dialog.focusableCount + 2, 18); index += 1) {
    await dispatchKey(client, "Tab", 0);
    const trapped = await evaluate(client, "(() => { const d=Array.from(document.querySelectorAll('[role=dialog],[role=alertdialog]')).find(x => { const r=x.getBoundingClientRect(); return r.width>0&&r.height>0; }); return !!d && d.contains(document.activeElement); })()", false);
    check(trapped, "modal dialog contains keyboard focus");
  }

  await dispatchKey(client, "Escape", 0);
  await waitForExpression(client, "!Array.from(document.querySelectorAll('[role=dialog],[role=alertdialog]')).some(d => { const r=d.getBoundingClientRect(); const s=getComputedStyle(d); return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'; })", "Escape closes dialog", 5000);
  const restored = await evaluate(client, String.raw`(() => {
    const active = document.activeElement;
    const invoker = document.querySelector('[data-a11y-dialog-invoker="true"]');
    return {
      ok: !!active && active === invoker,
      active: active ? active.tagName + "|" + String(active.getAttribute("aria-label") || active.innerText || active.title || "").replace(/\s+/g, " ").trim().slice(0, 80) : "none",
      invoker: invoker ? invoker.tagName + "|" + String(invoker.getAttribute("aria-label") || invoker.innerText || invoker.title || "").replace(/\s+/g, " ").trim().slice(0, 80) : "none",
      invokerConnected: !!invoker && document.contains(invoker)
    };
  })()`, false);
  check(restored.ok, "dialog restores focus to its invoker after Escape", JSON.stringify(restored));
}

async function run() {
  staticChecks();
  const chromePath = findChrome();
  if (!chromePath) throw new Error("FAIL required rendered automation: no supported local Chrome or Chromium executable found");

  const appServer = createAppServer();
  const proxy = createBlockingProxy();
  let chrome;
  try {
    const ports = await Promise.all([listen(appServer), listen(proxy.server)]);
    const origin = "http://127.0.0.1:" + ports[0];
    chrome = await launchChrome(chromePath, ports[1]);
    const client = chrome.client;
    const externalTargetAttempts = [];
    const browserExceptions = [];
    let interceptionFailure = null;

    client.on("Fetch.requestPaused", function(event) {
      const url = event.request && event.request.url || "";
      const local = url.startsWith(origin + "/") || url === origin || /^(?:about|blob|data):/i.test(url);
      if (!local) externalTargetAttempts.push(url);
      const method = local ? "Fetch.continueRequest" : "Fetch.failRequest";
      const params = local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: "BlockedByClient" };
      client.send(method, params).catch(function(error) { interceptionFailure = error; });
    });
    client.on("Runtime.exceptionThrown", function(event) {
      const details = event.exceptionDetails || {};
      browserExceptions.push(details.exception && details.exception.description || details.text || "browser exception");
    });

    await Promise.all([
      client.send("Page.enable"),
      client.send("Runtime.enable"),
      client.send("Network.enable"),
      client.send("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] }),
      client.send("Accessibility.enable")
    ]);
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: LOCAL_FIXTURE_SCRIPT });
    await client.send("Emulation.setEmulatedMedia", {
      media: "screen",
      features: [
        { name: "prefers-reduced-motion", value: "reduce" },
        { name: "prefers-color-scheme", value: "dark" }
      ]
    });

    const version = await client.send("Browser.getVersion");
    console.log("ARTIFACT index.html sha256=" + digest("index.html"));
    console.log("BROWSER " + (version.product || "unknown") + " " + (version.userAgent || ""));
    console.log("FIXTURE synthetic local state; outbound connections denied before network");

    for (const scenario of SCENARIOS) {
      const physicalWidth = scenario.width * scenario.zoom;
      const physicalHeight = scenario.height * scenario.zoom;
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: physicalWidth,
        height: physicalHeight,
        deviceScaleFactor: 1,
        mobile: true,
        screenWidth: physicalWidth,
        screenHeight: physicalHeight,
        screenOrientation: { type: scenario.orientation, angle: scenario.orientation === "portraitPrimary" ? 0 : 90 }
      });
      await client.send("Page.navigate", { url: origin + "/?tool=dashboard&a11y_scenario=" + encodeURIComponent(scenario.name) });
      await waitForExpression(
        client,
        "document.readyState === 'complete' && !!document.querySelector('#root') && !document.querySelector('#root .seo-content') && !document.body.innerText.includes('Loading error')",
        scenario.name + " rendered app",
        12000
      );
      await evaluate(client, "document.documentElement.style.zoom = " + JSON.stringify(String(scenario.zoom)) + "; true", false);
      await delay(120);
      const audit = await evaluate(client, DOCUMENT_AUDIT + "(" + scenario.zoom + ")", false);
      check(
        audit && audit.failures.length === 0,
        scenario.name + " semantics, reflow, targets, contrast, orientation, and reduced motion",
        audit && audit.failures ? audit.failures.join(" | ") : "audit returned no evidence"
      );
      console.log("SCENARIO " + scenario.name + " " + JSON.stringify(audit.metrics));
    }

    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 375,
      height: 667,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: 375,
      screenHeight: 667,
      screenOrientation: { type: "portraitPrimary", angle: 0 }
    });
    await client.send("Page.navigate", { url: origin + "/?tool=dashboard&a11y_interaction=1" });
    await waitForExpression(client, "document.readyState === 'complete' && !document.querySelector('#root .seo-content')", "interaction fixture", 12000);
    await delay(100);
    await runKeyboardChecks(client);
    await runDialogChecks(client);

    const axTree = await client.send("Accessibility.getFullAXTree");
    const unnamedInteractive = (axTree.nodes || []).filter(function(node) {
      const role = node.role && node.role.value;
      const name = node.name && node.name.value;
      return /^(?:button|checkbox|combobox|link|menuitem|radio|searchbox|slider|switch|tab|textbox)$/.test(role || "") && !String(name || "").trim();
    });
    check(unnamedInteractive.length === 0, "browser accessibility tree has no unnamed interactive nodes", "count=" + unnamedInteractive.length);
    if (interceptionFailure) throw interceptionFailure;
    check(browserExceptions.length === 0, "rendered automation has no uncaught browser exceptions", browserExceptions.join(" | "));
    check(externalTargetAttempts.length === 0, "rendered app attempts no external provider network", externalTargetAttempts.join(" | "));
    console.log("NETWORK target external attempts=0; blocking proxy contacts=" + proxy.attempts.length);
    console.log("SCOPE local browser automation only; manual assistive-technology and hosted release acceptance remain untested");
    console.log("LOCAL AUTOMATION PASS");
  } finally {
    await stopChrome(chrome);
    await Promise.all([closeServer(appServer), closeServer(proxy.server)]);
  }
}

run().catch(function(error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
