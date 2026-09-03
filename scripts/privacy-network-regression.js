"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const LEGACY_HASHES = Object.freeze({
  "sw.js": "45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32",
  "OneSignalSDKWorker.js": "2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc"
});
const PROVIDER_PATTERNS = Object.freeze([
  { name: "Google Analytics", pattern: /(?:google-analytics\.com|googletagmanager\.com|\/gtag\/js(?:\?|$))/i },
  { name: "Kit", pattern: /(?:convertkit|(?:^|[./])api\.kit\.com(?:[/:]|$))/i },
  { name: "OneSignal", pattern: /onesignal/i }
]);
const STALE_ACTIVE_PUSH_COPY = Object.freeze([
  "One tap. Works offline, and it is what unlocks push alerts.",
  "Two steps in Safari. This is also what makes alerts possible on iPhone.",
  "This in-app browser cannot install the app or deliver alerts.",
  "Deadline alerts that save you money",
  "Faster access. Push reminders. No app store.",
  "Get deadline alerts \\u2014 tap here to install.",
  "\\uD83D\\uDCF2 INSTALL TO GET DEADLINE ALERTS\"),",
  "Installed users get push reminders timed to their separation date",
  "a bookmark can\\u2019t send alerts",
  "tap Enable Alerts below"
]);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(ROOT, relativePath)))
    .digest("hex");
}

function countMatches(source, pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  return Array.from(source.matchAll(new RegExp(pattern.source, flags))).length;
}

function hasStaleActivePushCopy(source) {
  return STALE_ACTIVE_PUSH_COPY.some(function(needle) {
    return source.includes(needle);
  });
}

function lineContaining(source, marker) {
  return source.split("\n").find(function(line) {
    return line.includes(marker);
  }) || "";
}

function functionBlock(source, name) {
  const startPattern = new RegExp("(?:async\\s+)?function\\s+" + name + "\\s*\\(");
  const startMatch = startPattern.exec(source);
  if (!startMatch) return "";
  const start = startMatch.index;
  const rest = source.slice(start + 1);
  const next = /\n(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/.exec(rest);
  return source.slice(start, next ? start + 1 + next.index : source.length);
}

function check(condition, label, detail) {
  if (!condition) {
    throw new Error("FAIL " + label + (detail ? ": " + detail : ""));
  }
  console.log("PASS " + label);
}

function prohibitedProvider(url) {
  return PROVIDER_PATTERNS.find(function(entry) {
    return entry.pattern.test(String(url));
  }) || null;
}

function sourceChecks() {
  const index = read("index.html");
  const navigatorFunction = read("netlify/functions/navigator.mjs");
  const pwaWorker = read("pwa-sw.js");
  const dedicatedWorker = read("push/onesignal/OneSignalSDKWorker.js");

  const gaPatterns = [
    /googletagmanager\.com\/gtag\/js/i,
    /google-analytics\.com/i,
    /\bwindow\.gtag\b/i,
    /\bGoogleAnalyticsObject\b/i,
    /\bdataLayer\b/,
    /\bG-[A-Z0-9]{6,}\b/
  ];
  check(
    gaPatterns.every(function(pattern) { return !pattern.test(index); }) &&
      !/added analytics so we can see which deadline alerts help most/i.test(index),
    "browser source has no GA bootstrap, measurement ID, tag URL, or obsolete analytics claim"
  );

  const kitPatterns = [
    /convertkit/i,
    /(?:^|["'/:.])(?:api\.)?kit\.com(?:["'/:]|$)/im,
    /\bKIT_FORM_ID\b/,
    /\bapi_key\s*:/i,
    /\bhandleEmailSubmit\b/,
    /\brenderEmailSignup\b/,
    /\bemailSignup\b/,
    /\bemailSubmitted\b/,
    /\bemailSubmitting\b/,
    /\bemailSubscribed\b/,
    /weekly\s+(?:field\s+brief|intel)/i,
    /stand by for weekly/i,
    /\/forms\/[^\s"']+\/subscribe/i
  ];
  check(
    kitPatterns.every(function(pattern) { return !pattern.test(index); }),
    "browser source has no Kit form, credential, email-signup runtime, or signup UI"
  );

  const feedbackCollectionPatterns = [
    /<form[^>]+name=["']tops-feedback["']/i,
    /\bfeedback_submitted\b/,
    /form-name["']?\s*,\s*["']tops-feedback["']/i,
    /\bfrom_name\b/,
    /\breply_to\b/,
    /fetch\s*\(\s*["']\/["']\s*,\s*\{\s*method:\s*["']POST["']/
  ];
  check(
    feedbackCollectionPatterns.every(function(pattern) { return !pattern.test(index); }),
    "feedback has no app submission, tracking event, identity fields, or dormant Forms path"
  );
  check(
    /const mailto = "mailto:" \+ FEEDBACK_EMAIL/.test(index) &&
      /window\.location\.href = mailto;/.test(index) &&
      /Transition Ops does not submit or store this message\. No name or email field is collected in the app\./.test(index) &&
      /EMAIL DRAFT REQUESTED/.test(index),
    "feedback is a truthful member-controlled email handoff"
  );

  check(
    /Sending a question sends your current question, this chat history, and any saved separation date or service status through Netlify to OpenAI/.test(index) &&
      /The Navigator is optional; the rest of Transition Ops remains available without it\./.test(index),
    "Navigator discloses the request payload and optional provider boundary"
  );
  check(
    /Using this tool sends your MOS\/AFSC\/rate, years served, target job title, skills, certifications, pasted experience, confirmed fact sheet, confirmed relevant years, selected supporting roles, and optional job description through Netlify to OpenAI\./.test(index) &&
      /These four header fields stay in this browser for this draft and are not included in the resume request\./.test(index) &&
      !/resumeAction === "draft" && aiR\.mode !== "federal" \? \{ header: exactResumeHeader/.test(index),
    "Resume discloses provider-bound fields and keeps its personal header out of transport"
  );

  const navigatorGapPatterns = [
    /@netlify\/blobs/,
    /\bgetStore\b/,
    /\bnavigator-gaps\b/i,
    /\bGAP_(?:STORE|RETENTION|TAG)\b/,
    /\brecordGap\s*\(/,
    /\bgapTopicOrNull\b/,
    /\[\[GAP\s*:/i,
    /\[gap-log\]/i,
    /\bstorage?\.setJSON\s*\(/i
  ];
  check(
    navigatorGapPatterns.every(function(pattern) { return !pattern.test(navigatorFunction); }),
    "Navigator source has no member-derived gap Blob or gap-log path"
  );

  const pushDeclarations = countMatches(index, /\b(?:const|let|var)\s+TOPS_PUSH_ENABLED\s*=/);
  const literalOff = countMatches(index, /const TOPS_PUSH_ENABLED = false;/);
  check(
    pushDeclarations === 1 && literalOff === 1,
    "production push is one literal false declaration",
    "declarations=" + pushDeclarations + " literalOff=" + literalOff
  );

  const staleMatches = STALE_ACTIVE_PUSH_COPY.filter(function(needle) {
    return index.includes(needle);
  });
  check(!hasStaleActivePushCopy(index), "POFF-01 active UI contains no obsolete push promise", staleMatches.join(" | "));
  const staleMutation = index.replace(
    "One tap. Add Transition OPS to your home screen for direct access.",
    STALE_ACTIVE_PUSH_COPY[0]
  );
  check(hasStaleActivePushCopy(staleMutation), "POFF-01 obsolete push-copy mutation fails");

  check(
    countMatches(index, /One tap\. Add Transition OPS to your home screen for direct access\./) === 1 &&
      countMatches(index, /Two steps in Safari\. Add Transition OPS to your Home Screen for direct access\./) === 1 &&
      countMatches(index, /This in-app browser cannot install Transition OPS\./) === 1 &&
      countMatches(index, /Track critical transition windows/) === 1 &&
      countMatches(index, /Direct access\. No app store\./) === 1 &&
      countMatches(index, /\(not \\"Add Bookmark\\"\)/) === 3,
    "POFF-02 install surfaces use direct-access guidance without a push promise"
  );

  const installStripLine = lineContaining(index, "Install Transition OPS \\u2014 tap here.");
  const installCardLine = lineContaining(index, "\\uD83D\\uDCF2 INSTALL TRANSITION OPS");
  const installFooterLine = lineContaining(index, "After installing: open Transition OPS from your home screen.");
  check(
    installStripLine.includes("TOPS_PUSH_DISABLED_COPY") &&
      installStripLine.includes("Android: browser menu \\u2192 Install App or Add to Home Screen.") &&
      installCardLine.includes("Install Transition OPS on your home screen for direct access.") &&
      installCardLine.includes("TOPS_PUSH_DISABLED_COPY") &&
      installFooterLine.includes("TOPS_PUSH_DISABLED_COPY"),
    "POFF-03 install strip, card, and footer state that push is disabled"
  );

  const historyStatus = "Release notes describe the app at the time shown. Current status:";
  const historyStatusIndex = index.indexOf(historyStatus);
  const renderedHistoryIndex = index.indexOf("WHATS_NEW.map(function(item, i)", historyStatusIndex);
  const historicalV90 = '{ v: "v90", date: "25 JUL 2026", note: "Fixed: the INSTALL TO GET DEADLINE ALERTS card is back on the main dashboard where new users can see it (it had been tucked under MORE TOOLS). Installing from your home screen is what makes deadline alerts possible \\u2014 15 seconds, worth it." }';
  check(
    historyStatusIndex !== -1 &&
      renderedHistoryIndex > historyStatusIndex &&
      renderedHistoryIndex - historyStatusIndex < 500 &&
      lineContaining(index, historyStatus).includes("TOPS_PUSH_DISABLED_COPY") &&
      countMatches(index, /const APP_VERSION = "v96";/) === 1 &&
      index.split(historicalV90).length - 1 === 1,
    "POFF-04 unchanged release history is preceded by current push-off context"
  );

  check(
    hasStaleActivePushCopy(STALE_ACTIVE_PUSH_COPY[0]) &&
      !hasStaleActivePushCopy("Review your in-app alerts and reminders before each transition window.") &&
      /const NOTIFICATIONS = \[/.test(index),
    "POFF-06 stale-copy classifier is scoped and preserves valid in-app alert vocabulary"
  );

  const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
  check(!uuidPattern.test(index), "browser source has no static UUID-shaped push App ID");

  const clonePatterns = [
    /\bTOPS_(?:CLONE|PUSH_ALLOWED_ORIGIN)\b/i,
    /https?:\/\/[^\s"']*(?:clone|test)[^\s"']*/i,
    /\bisolated clone\b/i,
    /\bclone (?:status|push|testing|validation)\b/i,
    /\btest[- ]site\b/i,
    /\bproduction app is unchanged\b/i,
    /\bclone-push-disabled\b/i
  ];
  check(
    clonePatterns.every(function(pattern) { return !pattern.test(index); }),
    "browser source has no clone/test origin, configuration, or status copy"
  );

  const pushConfigBlock = functionBlock(index, "topsPushConfigReady");
  const offBlock = functionBlock(index, "topsEnforcePushOff");
  const loaderBlock = functionBlock(index, "topsLoadOneSignalSdk");
  const initBlock = functionBlock(index, "topsInitializeOneSignal");
  const enrollmentBlock = functionBlock(index, "topsStartPushEnrollment");
  const resumeBlock = functionBlock(index, "topsResumeAcceptedPush");
  const guardedRetainedHelpers =
    loaderBlock.indexOf("topsPushConfigReady()") !== -1 &&
    loaderBlock.indexOf("topsPushConfigReady()") < loaderBlock.indexOf("document.createElement") &&
    initBlock.indexOf("topsPushConfigReady()") !== -1 &&
    initBlock.indexOf("topsPushConfigReady()") < initBlock.indexOf("topsLoadOneSignalSdk()") &&
    enrollmentBlock.indexOf("topsPushConfigReady()") !== -1 &&
    enrollmentBlock.indexOf("topsPushConfigReady()") < enrollmentBlock.indexOf("topsInitializeOneSignal()") &&
    resumeBlock.indexOf("topsPushConfigReady()") !== -1 &&
    resumeBlock.indexOf("topsPushConfigReady()") < resumeBlock.indexOf("topsInitializeOneSignal()");
  const removedActivationHelpers =
    loaderBlock === "" &&
    initBlock === "" &&
    !/OneSignalSDK\.page\.js|\bOneSignalDeferred\b|\.User\s*\.\s*addTags?\s*\(/.test(index) &&
    enrollmentBlock.includes("topsEnforcePushOff()") &&
    resumeBlock.includes("topsEnforcePushOff()");
  check(
    /return\s+false\s*;/.test(pushConfigBlock) &&
      offBlock.includes("topsRemovePushChoice()") &&
      offBlock.includes("topsRemoveOneSignalScript()") &&
      offBlock.includes("topsUnregisterDedicatedPushWorker()") &&
      (guardedRetainedHelpers || removedActivationHelpers),
    "OneSignal activation is removed or fail-closed and stale dedicated state is cleaned"
  );
  check(
    countMatches(index, /<script[^>]+src=["'][^"']*onesignal[^"']*["'][^>]*>/i) === 0 &&
      countMatches(index, /navigator\.serviceWorker\.register\s*\(\s*["'`]\/push\/onesignal\//i) === 0 &&
      countMatches(index, /fetch\s*\(\s*["'`]\/push\/onesignal\//i) === 0,
    "browser source has no static SDK element or dedicated-worker registration/fetch"
  );

  const literalRegistrations = Array.from(
    index.matchAll(/navigator\.serviceWorker\.register\s*\(\s*(["'`])([^"'`]+)\1/g),
    function(match) { return match[2]; }
  );
  check(
    literalRegistrations.length === 1 && literalRegistrations[0] === "/pwa-sw.js",
    "current app registers only the active OneSignal-free PWA worker",
    JSON.stringify(literalRegistrations)
  );
  check(
    !/(?:onesignal|importScripts|notificationclick|SHOW_NOTIFICATION|\bpush\b)/i.test(pwaWorker),
    "active PWA worker is provider-free"
  );

  check(
    countMatches(dedicatedWorker, /importScripts\s*\(/) === 1 &&
      /importScripts\s*\(\s*["']https:\/\/cdn\.onesignal\.com\/sdks\/web\/v16\/OneSignalSDK\.sw\.js["']\s*\)/.test(dedicatedWorker),
    "dedicated worker remains isolated at its approved path"
  );
  check(
    !/(?:CACHE_NAME|const\s+ASSETS|addEventListener\s*\(\s*["']fetch["']|SHOW_NOTIFICATION)/.test(dedicatedWorker),
    "dedicated worker contains no app-cache or local-notification behavior"
  );

  Object.entries(LEGACY_HASHES).forEach(function(entry) {
    check(sha256(entry[0]) === entry[1], entry[0] + " legacy exception hash preserved");
  });

  console.log("LEGACY COHORT: bounded source exception preserved; current app registration excluded");
}

function sanitizeIndexForLocalRuntime(source) {
  return source.replace(
    /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']https?:\/\/)[^>]*>\s*/gi,
    ""
  );
}

function sanitizeWorkerForLocalRuntime(source) {
  return source.split("\n").filter(function(line) {
    return !/^\s*["']https?:\/\//.test(line);
  }).join("\n");
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  })[ext] || "application/octet-stream";
}

function createLocalAppServer(options) {
  const index = sanitizeIndexForLocalRuntime(read("index.html"));
  const pwaWorker = sanitizeWorkerForLocalRuntime(read("pwa-sw.js"));
  const syntheticLegacyWorker = [
    "self.addEventListener('install', function(event) { event.waitUntil(self.skipWaiting()); });",
    "self.addEventListener('activate', function(event) { event.waitUntil(self.clients.claim()); });"
  ].join("\n");

  return http.createServer(function(request, response) {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    } catch (error) {
      response.writeHead(400).end("bad request");
      return;
    }

    if (pathname === "/" || pathname === "/index.html") {
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end(index);
      return;
    }
    if (pathname === "/pwa-sw.js") {
      response.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
        "Service-Worker-Allowed": "/"
      });
      response.end(pwaWorker);
      return;
    }
    if (pathname === "/sw.js" && options.migratedFixture) {
      response.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
        "Service-Worker-Allowed": "/"
      });
      response.end(syntheticLegacyWorker);
      return;
    }
    if (pathname === "/__privacy_blank.html") {
      response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      });
      response.end("<!doctype html><html lang=\"en\"><title>Privacy fixture</title><body>fixture</body></html>");
      return;
    }

    let relative = pathname.replace(/^\/+/, "");
    let candidate = path.resolve(ROOT, relative);
    if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) {
      response.writeHead(403).end("forbidden");
      return;
    }
    try {
      const stat = fs.statSync(candidate);
      if (stat.isDirectory()) candidate = path.join(candidate, "index.html");
      const body = fs.readFileSync(candidate);
      response.writeHead(200, {
        "Content-Type": contentType(candidate),
        "Cache-Control": "no-store"
      });
      response.end(body);
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
    response.end("external network disabled by local regression");
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
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return true;
    } catch (error) {
      return false;
    }
  }) || "";
}

function delay(milliseconds) {
  return new Promise(function(resolve) { setTimeout(resolve, milliseconds); });
}

async function waitForFile(filePath, processHandle, stderrText) {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return;
    if (processHandle.exitCode !== null) {
      throw new Error("Chrome exited before CDP became ready: " + stderrText());
    }
    await delay(50);
  }
  throw new Error("Chrome CDP did not become ready within 12 seconds: " + stderrText());
}

async function jsonFromLocal(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("CDP discovery failed with HTTP " + response.status);
  return response.json();
}

class CdpClient {
  constructor(url) {
    if (typeof WebSocket !== "function") {
      throw new Error("Node's built-in WebSocket is unavailable; Node 22 or newer is required");
    }
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
      const handlers = this.listeners.get(message.method) || [];
      handlers.forEach(function(handler) { handler(message.params || {}); });
    });
  }

  on(method, handler) {
    const handlers = this.listeners.get(method) || [];
    handlers.push(handler);
    this.listeners.set(method, handlers);
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
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "tops-privacy-chrome-"));
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
    "--window-size=900,900",
    "about:blank"
  ];
  if (typeof process.getuid === "function" && process.getuid() === 0) args.unshift("--no-sandbox");

  const child = spawn(chromePath, args, { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  child.stderr.on("data", function(chunk) {
    stderr = (stderr + chunk.toString()).slice(-12000);
  });
  const devToolsFile = path.join(profile, "DevToolsActivePort");
  await waitForFile(devToolsFile, child, function() { return stderr; });
  const lines = fs.readFileSync(devToolsFile, "utf8").trim().split(/\r?\n/);
  const port = Number(lines[0]);
  if (!Number.isInteger(port) || port <= 0) throw new Error("Chrome wrote an invalid CDP port");
  const targets = await jsonFromLocal("http://127.0.0.1:" + port + "/json/list");
  const page = targets.find(function(target) { return target.type === "page"; });
  if (!page || !page.webSocketDebuggerUrl) throw new Error("Chrome exposed no page CDP target");
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
    const text = result.exceptionDetails.exception && result.exceptionDetails.exception.description;
    throw new Error("browser evaluation failed: " + (text || result.exceptionDetails.text || "unknown exception"));
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
    } catch (error) {
      last = error.message;
    }
    await delay(100);
  }
  throw new Error("runtime evidence unavailable for " + label + "; last=" + JSON.stringify(last));
}

const PROBE_SCRIPT = String.raw`
(() => {
  const probe = window.__topsPrivacyProbe = {
    fetches: [],
    notificationPermissionCalls: 0,
    registrations: [],
    beacons: []
  };
  try {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      probe.fetches.push(String(url));
      return originalFetch.call(this, input, init);
    };
  } catch (error) {}
  try {
    const originalBeacon = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
    if (originalBeacon) navigator.sendBeacon = function(url, data) {
      probe.beacons.push(String(url));
      return originalBeacon(url, data);
    };
  } catch (error) {}
  try {
    if (window.Notification && typeof Notification.requestPermission === "function") {
      Notification.requestPermission = function() {
        probe.notificationPermissionCalls += 1;
        return Promise.resolve("denied");
      };
    }
  } catch (error) {}
  try {
    const container = navigator.serviceWorker;
    const proto = container && Object.getPrototypeOf(container);
    const originalRegister = proto && proto.register;
    if (typeof originalRegister === "function") {
      proto.register = function(scriptURL, options) {
        probe.registrations.push({ scriptURL: String(scriptURL), scope: options && options.scope || "" });
        return originalRegister.call(this, scriptURL, options);
      };
    }
  } catch (error) {}
})();`;

async function runtimeScenario(name, chromePath, migratedFixture) {
  const appServer = createLocalAppServer({ migratedFixture });
  const proxy = createBlockingProxy();
  let chrome;
  let appPort;
  try {
    const ports = await Promise.all([listen(appServer), listen(proxy.server)]);
    appPort = ports[0];
    const origin = "http://127.0.0.1:" + appPort;
    chrome = await launchChrome(chromePath, ports[1]);
    const client = chrome.client;
    const requests = [];
    const blockedExternal = [];
    const browserExceptions = [];
    let interceptionFailure = null;

    client.on("Network.requestWillBeSent", function(event) {
      requests.push(event.request && event.request.url || "");
    });
    client.on("Runtime.exceptionThrown", function(event) {
      const details = event.exceptionDetails || {};
      browserExceptions.push(details.text || details.exception && details.exception.description || "browser exception");
    });
    client.on("Fetch.requestPaused", function(event) {
      const url = event.request && event.request.url || "";
      const local = url.startsWith(origin + "/") || url === origin || /^(?:data|blob|about):/i.test(url);
      if (!local) blockedExternal.push(url);
      const method = local ? "Fetch.continueRequest" : "Fetch.failRequest";
      const params = local ? { requestId: event.requestId } : { requestId: event.requestId, errorReason: "BlockedByClient" };
      client.send(method, params).catch(function(error) { interceptionFailure = error; });
    });

    await Promise.all([
      client.send("Page.enable"),
      client.send("Runtime.enable"),
      client.send("Network.enable"),
      client.send("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] })
    ]);
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: PROBE_SCRIPT });

    if (migratedFixture) {
      await client.send("Page.navigate", { url: origin + "/__privacy_blank.html" });
      await waitForExpression(client, "document.readyState === 'complete'", name + " fixture page", 8000);
      const fixtureResult = await evaluate(client, String.raw`(async () => {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const worker = registration.installing || registration.waiting || registration.active;
        if (worker && worker.state !== "activated") {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("fixture worker activation timeout")), 5000);
            worker.addEventListener("statechange", () => {
              if (worker.state === "activated") { clearTimeout(timer); resolve(); }
            });
          });
        }
        const ready = await navigator.serviceWorker.ready;
        return !!(ready.active && /\/sw\.js$/.test(new URL(ready.active.scriptURL).pathname));
      })()`, true);
      check(fixtureResult === true, name + " synthetic prior-root fixture activated");
    }

    await client.send("Page.navigate", { url: origin + "/?tool=dashboard&privacy_regression=" + encodeURIComponent(name) });
    await waitForExpression(
      client,
      "document.readyState === 'complete' && !!document.querySelector('#root') && !document.querySelector('#root .seo-content') && !document.body.innerText.includes('Loading error')",
      name + " rendered app",
      12000
    );
    await waitForExpression(
      client,
      "navigator.serviceWorker.getRegistration('/').then(r => !!(r && r.active && /\\/pwa-sw\\.js$/.test(new URL(r.active.scriptURL).pathname)))",
      name + " active PWA worker",
      12000
    );
    const observedPreviousRoot = migratedFixture
      ? await waitForExpression(
        client,
        "/\\/sw\\.js$/.test(window.__TOPS_PREVIOUS_ROOT_SW_URL || '') && window.__TOPS_PREVIOUS_ROOT_SW_URL",
        name + " prior-root migration record",
        5000
      )
      : await evaluate(client, "window.__TOPS_PREVIOUS_ROOT_SW_URL || ''", false);

    const navLabels = await evaluate(client, String.raw`(() => Array.from(document.querySelectorAll(".bottom-nav button"))
      .filter((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      })
      .map((button) => (button.innerText || button.getAttribute("aria-label") || "").trim()))()`, false);
    for (const label of (navLabels || []).slice(0, 6)) {
      await evaluate(client, "(() => { const label = " + JSON.stringify(label) + "; const button = Array.from(document.querySelectorAll('.bottom-nav button')).find(b => (b.innerText || b.getAttribute('aria-label') || '').trim() === label); if (button) button.click(); return !!button; })()", false);
      await delay(80);
    }
    await client.send("Page.reload", { ignoreCache: true });
    await waitForExpression(client, "document.readyState === 'complete' && !document.querySelector('#root .seo-content')", name + " reload", 10000);
    await delay(300);

    if (interceptionFailure) throw interceptionFailure;
    check(browserExceptions.length === 0, name + " app has no uncaught browser exception", browserExceptions.join(" | "));

    const evidence = await evaluate(client, String.raw`(async () => {
      const visible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const registrations = await navigator.serviceWorker.getRegistrations();
      const activePushControls = Array.from(document.querySelectorAll("button, [role=button]"))
        .filter(visible)
        .map((element) => (element.innerText || element.getAttribute("aria-label") || "").trim())
        .filter((text) => /(?:enable|agree|turn on|remind me).*(?:push|notification)|(?:push|notification).*(?:enable|agree|turn on)/i.test(text));
      const visibleEmailInputs = Array.from(document.querySelectorAll('input[type="email"]')).filter(visible).length;
      const visibleSignupCopy = Array.from(document.querySelectorAll("body *")).filter(visible)
        .some((element) => element.children.length === 0 && /weekly\s+(?:field\s+brief|intel)|join\s+(?:the\s+)?list/i.test(element.textContent || ""));
      const visibleText = String(document.body && document.body.innerText || "").replace(/\s+/g, " ");
      return {
        activePushControls,
        enableInstructionVisible: /tap Enable Alerts|enable push|turn on push/i.test(visibleText),
        gaGlobals: !!(window.gtag || window.dataLayer || window.GoogleAnalyticsObject),
        kitUi: visibleEmailInputs > 0 || visibleSignupCopy,
        oneSignalGlobals: !!(window.OneSignal || window.OneSignalDeferred || window.__TOPS_ONESIGNAL_INSTANCE || window.__TOPS_ONESIGNAL_PROMISE),
        oneSignalScripts: Array.from(document.scripts).filter((script) => /onesignal/i.test(script.src || "")).length,
        previousRoot: window.__TOPS_PREVIOUS_ROOT_SW_URL || "",
        probe: window.__topsPrivacyProbe || null,
        pushDisabledVisible: visibleText.includes("Push alerts are currently disabled."),
        registrations: registrations.map((registration) => ({
          scope: registration.scope,
          scriptURL: (registration.active || registration.waiting || registration.installing || {}).scriptURL || ""
        })),
        stalePushPromiseVisible: /works offline, and it is what unlocks push alerts|makes alerts possible on iPhone|cannot install the app or deliver alerts|deadline alerts that save you money|faster access\. push reminders|get deadline alerts|installed users get push reminders|bookmark can.t send alerts/i.test(visibleText)
      };
    })()`, true);

    check(evidence && evidence.probe, name + " runtime instrumentation remained active");
    check(evidence.gaGlobals === false, name + " rendered app creates no GA runtime globals");
    check(evidence.kitUi === false, name + " rendered app exposes no Kit email-signup UI");
    check(evidence.oneSignalGlobals === false && evidence.oneSignalScripts === 0, name + " rendered app creates no OneSignal runtime or script");
    check(evidence.activePushControls.length === 0, name + " rendered app exposes no push-enablement control", JSON.stringify(evidence.activePushControls));
    check(
      evidence.pushDisabledVisible === true &&
        evidence.enableInstructionVisible === false &&
        evidence.stalePushPromiseVisible === false,
      "POFF-05 " + name + " rendered push-off state is explicit and contains no enable instruction or obsolete promise",
      JSON.stringify({
        pushDisabledVisible: evidence.pushDisabledVisible,
        enableInstructionVisible: evidence.enableInstructionVisible,
        stalePushPromiseVisible: evidence.stalePushPromiseVisible
      })
    );
    check(evidence.probe.notificationPermissionCalls === 0, name + " makes no browser notification-permission request");
    check(
      evidence.probe.registrations.length === 1 && evidence.probe.registrations[0].scriptURL === "/pwa-sw.js",
      name + " app runtime registers only the active PWA worker",
      JSON.stringify(evidence.probe.registrations)
    );
    check(
      evidence.registrations.length === 1 && /\/pwa-sw\.js$/.test(evidence.registrations[0].scriptURL),
      name + " finishes with one active PWA worker registration",
      JSON.stringify(evidence.registrations)
    );
    if (migratedFixture) {
      check(/\/sw\.js$/.test(observedPreviousRoot), name + " separately records the bounded prior-root cohort");
    } else {
      check(!/\/sw\.js$/.test(observedPreviousRoot), name + " begins without a prior-root worker");
    }

    const providerAttempts = requests.concat(blockedExternal, proxy.attempts)
      .map(function(url) { return { url, provider: prohibitedProvider(url) }; })
      .filter(function(entry) { return !!entry.provider; });
    check(
      providerAttempts.length === 0,
      name + " makes zero GA, Kit, or OneSignal requests across load, interactions, and reload",
      providerAttempts.map(function(entry) { return entry.provider.name + ":" + entry.url; }).join(" | ")
    );
    console.log("RUNTIME " + name + ": " + requests.length + " local/browser requests observed; provider count 0");
  } finally {
    await stopChrome(chrome);
    await Promise.all([closeServer(appServer), closeServer(proxy.server)]);
  }
}

async function run() {
  sourceChecks();
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error("FAIL required runtime evidence: no supported local Chrome or Chromium executable found");
  }
  console.log("RUNTIME BROWSER: " + chromePath);
  console.log("RUNTIME FIXTURE: synthetic data, local files, outbound proxy denied before network");
  await runtimeScenario("NEW", chromePath, false);
  await runtimeScenario("MIGRATED", chromePath, true);
  console.log("PRIVACY-NETWORK REGRESSION PASS");
}

run().catch(function(error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
