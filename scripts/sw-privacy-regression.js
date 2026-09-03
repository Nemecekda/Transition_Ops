"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const LEGACY_HASHES = Object.freeze({
  "sw.js": "45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32",
  "OneSignalSDKWorker.js": "2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc"
});
const FONT_STYLESHEET_URL = "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
const EXPECTED_PRECACHE_ASSETS = Object.freeze([
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/va-math/",
  "/bdd-timeline/",
  "/vendor/react.production.min.js",
  "/vendor/react-dom.production.min.js"
]);
const EXPECTED_NAVIGATION_CACHE_KEYS = Object.freeze([
  ["/", "/"],
  ["/index.html", "/"],
  ["/va-math/", "/va-math/"],
  ["/bdd-timeline/", "/bdd-timeline/"],
  ["/erg-handoff.html", "/erg-handoff.html"],
  ["/erg-employer-brief.html", "/erg-employer-brief.html"],
  ["/erg-intranet-launch-kit.html", "/erg-intranet-launch-kit.html"]
]);
const EXPECTED_PUBLIC_FILES = Object.freeze([
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
  if (!condition) throw new Error("FAIL " + label + (detail ? ": " + detail : ""));
  console.log("PASS " + label);
}

function checkThrows(action, label) {
  let threw = false;
  try {
    action();
  } catch (error) {
    threw = true;
  }
  check(threw, label);
}

function navigationRequest(pathname) {
  return {
    method: "GET",
    mode: "navigate",
    url: "https://transitionops.org" + pathname
  };
}

function htmlResponse() {
  return {
    status: 200,
    headers: {
      get: function(name) {
        return String(name).toLowerCase() === "content-type" ? "text/html; charset=utf-8" : null;
      }
    },
    clone: function() { return this; }
  };
}

function createWorkerHarness(options) {
  const listeners = {};
  const addAllCalls = [];
  const cacheWrites = [];
  const cacheMatches = [];
  let skipWaitingCalls = 0;
  let claimCalls = 0;
  const settings = options || {};
  const cache = {
    addAll: function(entries) {
      const copiedEntries = Array.from(entries);
      addAllCalls.push(copiedEntries);
      if (copiedEntries.some(function(entry) { return /^https?:\/\//i.test(entry); })) {
        return Promise.reject(new Error("simulated remote precache failure"));
      }
      return Promise.resolve();
    },
    put: function(key) {
      cacheWrites.push(key);
      return Promise.resolve();
    }
  };
  const context = {
    Error,
    Map,
    Promise,
    Set,
    URL,
    caches: {
      delete: function() { return Promise.resolve(true); },
      keys: function() { return Promise.resolve([]); },
      match: function(key) {
        cacheMatches.push(key);
        return Promise.resolve(key === "/" ? settings.rootFallback : undefined);
      },
      open: function() { return Promise.resolve(cache); }
    },
    fetch: settings.fetch || function() { return Promise.resolve(htmlResponse()); },
    setTimeout: function() { return 1; },
    self: {
      addEventListener: function(type, listener) { listeners[type] = listener; },
      clients: {
        claim: function() {
          claimCalls += 1;
          return Promise.resolve();
        }
      },
      location: { origin: "https://transitionops.org" },
      skipWaiting: function() {
        skipWaitingCalls += 1;
        return Promise.resolve();
      }
    }
  };
  context.globalThis = context;
  vm.runInNewContext(
    pwaWorker + "\n;globalThis.__topsWorkerTest = {" +
      "assets: Array.from(ASSETS)," +
      "reviewedRemoteUrls: Array.from(REVIEWED_REMOTE_URLS)," +
      "cacheKeyFor: cacheKeyFor," +
      "isReviewedRequest: isReviewedRequest" +
    "};",
    context,
    { filename: "pwa-sw.js" }
  );
  return {
    addAllCalls,
    cacheMatches,
    cacheWrites,
    exports: context.__topsWorkerTest,
    getClaimCalls: function() { return claimCalls; },
    getSkipWaitingCalls: function() { return skipWaitingCalls; },
    listeners
  };
}

async function dispatchFetch(harness, request) {
  let responsePromise = null;
  let lifetimePromise = Promise.resolve();
  harness.listeners.fetch({
    request,
    respondWith: function(promise) { responsePromise = Promise.resolve(promise); },
    waitUntil: function(promise) { lifetimePromise = Promise.resolve(promise); }
  });
  check(responsePromise !== null, "reviewed request is intercepted by the active worker");
  const response = await responsePromise;
  await lifetimePromise;
  return response;
}

async function runExecutableWorkerChecks() {
  const installHarness = createWorkerHarness();
  let installPromise = null;
  installHarness.listeners.install({
    waitUntil: function(promise) { installPromise = Promise.resolve(promise); }
  });
  check(installPromise !== null, "active worker install supplies a lifetime promise");
  await installPromise;
  check(
    JSON.stringify(installHarness.addAllCalls) === JSON.stringify([EXPECTED_PRECACHE_ASSETS]),
    "atomic install contains exactly the nine required local assets"
  );
  check(
    installHarness.getSkipWaitingCalls() === 1,
    "atomic local install completes when remote font precaching is unavailable"
  );
  check(
    JSON.stringify(Array.from(installHarness.exports.reviewedRemoteUrls)) === JSON.stringify([FONT_STYLESHEET_URL]) &&
      installHarness.exports.isReviewedRequest({ method: "GET", mode: "cors", url: FONT_STYLESHEET_URL }),
    "Google Fonts remains one optional reviewed runtime URL"
  );

  EXPECTED_NAVIGATION_CACHE_KEYS.forEach(function(entry) {
    const actual = installHarness.exports.cacheKeyFor(navigationRequest(entry[0] + "?discarded=1"));
    check(actual === entry[1], "navigation cache key is closed and query-free for " + entry[0]);
  });
  check(
    installHarness.exports.cacheKeyFor(navigationRequest("/unknown/member-route?private=value")) === null,
    "unknown same-origin navigation has no cache key or root-key mapping"
  );

  const networkSuccessHarness = createWorkerHarness({
    fetch: function() { return Promise.resolve(htmlResponse()); }
  });
  await dispatchFetch(networkSuccessHarness, navigationRequest("/unknown/member-route?private=value"));
  check(
    networkSuccessHarness.cacheWrites.length === 0,
    "successful unknown navigation performs zero dynamic cache writes"
  );

  const rootFallback = { source: "cached-root" };
  const networkFailureHarness = createWorkerHarness({
    fetch: function() { return Promise.reject(new Error("synthetic network failure")); },
    rootFallback
  });
  const fallbackResponse = await dispatchFetch(
    networkFailureHarness,
    navigationRequest("/unknown/member-route?private=value")
  );
  check(
    fallbackResponse === rootFallback &&
      JSON.stringify(networkFailureHarness.cacheMatches) === JSON.stringify(["/"]) &&
      networkFailureHarness.cacheWrites.length === 0,
    "unknown navigation may read root fallback but never writes or matches a dynamic key"
  );
}

function runPublicBuildChecks(publicBuilder) {
  check(
    JSON.stringify(publicBuilder.PUBLIC_FILES) === JSON.stringify(EXPECTED_PUBLIC_FILES),
    "public builder uses the exact 22-file allowlist"
  );

  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tops-public-build-fixture-"));
  try {
    fs.writeFileSync(path.join(fixtureRoot, "regular.txt"), "fixture\n");
    fs.mkdirSync(path.join(fixtureRoot, "directory-entry"));
    fs.symlinkSync("regular.txt", path.join(fixtureRoot, "linked.txt"));

    checkThrows(
      function() { publicBuilder.validateSources(fixtureRoot, ["missing.txt"]); },
      "public builder rejects a missing source entry"
    );
    checkThrows(
      function() { publicBuilder.validateManifest(["readme.md"]); },
      "public builder rejects a Markdown allowlist entry"
    );
    checkThrows(
      function() { publicBuilder.validateSources(fixtureRoot, ["linked.txt"]); },
      "public builder rejects a symlink source entry"
    );
    checkThrows(
      function() { publicBuilder.validateSources(fixtureRoot, ["directory-entry"]); },
      "public builder rejects a nonregular source entry"
    );
    checkThrows(
      function() { publicBuilder.validateManifest(["navigator-pilot.html"]); },
      "public builder rejects the excluded Navigator pilot"
    );

    const extraOutput = path.join(fixtureRoot, "output");
    fs.mkdirSync(extraOutput);
    fs.writeFileSync(path.join(extraOutput, "extra.txt"), "extra\n");
    checkThrows(
      function() { publicBuilder.assertExistingOutputSafe(extraOutput, ["regular.txt"]); },
      "public builder rejects an extra output entry before replacement"
    );
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true });
  }

  const output = execFileSync(process.execPath, [path.join(ROOT, "scripts/build-public.js")], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  check(
    output.trim() === "PUBLIC BUILD PASS: 22 files -> dist",
    "public build command produces the exact validated dist inventory"
  );
  const inventory = publicBuilder.assertOutputExact(publicBuilder.DIST, EXPECTED_PUBLIC_FILES);
  check(
    inventory.files.every(function(relativePath) {
      return relativePath !== "navigator-pilot.html" &&
        !/\.(?:md|markdown)$/i.test(relativePath) &&
        !/^(?:\.agents|\.claude|\.git|\.github|design|intel|netlify|node_modules|outreach|scripts|tools)(?:\/|$)/.test(relativePath) &&
        !/^(?:package|package-lock)\.json$/.test(relativePath);
    }),
    "dist excludes pilot, internal evidence, scripts, functions, docs, and package metadata"
  );
}

function cacheVersion(source, label) {
  const matches = Array.from(source.matchAll(/const CACHE_NAME\s*=\s*["']transition-ops-v([0-9]+)["']\s*;/g));
  check(matches.length === 1, label + " has one extractable cache name", "matches=" + matches.length);
  const version = Number(matches[0][1]);
  check(Number.isSafeInteger(version) && version > 0, label + " cache version is a positive integer");
  return version;
}

const index = read("index.html");
const pwaWorker = read("pwa-sw.js");
const legacyWorker = read("sw.js");
const dedicatedWorker = read("push/onesignal/OneSignalSDKWorker.js");
const rootDedicatedWorker = read("OneSignalSDKWorker.js");
const headers = read("_headers");
const netlifyConfig = read("netlify.toml");
const packageJson = JSON.parse(read("package.json"));
const publicBuilder = require(path.join(ROOT, "scripts/build-public.js"));
const ergHandoff = read("erg-handoff.html");
const ergEmployerBrief = read("erg-employer-brief.html");
const ergIntranetLaunchKit = read("erg-intranet-launch-kit.html");

const launchInlineScripts = Array.from(
  ergIntranetLaunchKit.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi),
  function(match) { return match[1]; }
).join("\n");
const launchAnchorTags = Array.from(
  ergIntranetLaunchKit.matchAll(/<a\b[^>]*>/gi),
  function(match) { return match[0]; }
);
const launchPublicAnchorTags = launchAnchorTags.filter(function(tag) {
  return /\bhref=["']https?:\/\//i.test(tag);
});
const launchImageTags = Array.from(
  ergIntranetLaunchKit.matchAll(/<img\b[^>]*>/gi),
  function(match) { return match[0]; }
);
const launchTagSurface = Array.from(
  ergIntranetLaunchKit.matchAll(/<[^!][^>]*>/g),
  function(match) { return match[0]; }
).join("\n");
const launchActiveSurface = launchInlineScripts + "\n" + launchTagSurface;

const pushDeclarations = countMatches(index, /\b(?:const|let|var)\s+TOPS_PUSH_ENABLED\s*=/);
const literalPushOff = countMatches(index, /const TOPS_PUSH_ENABLED = false;/);
check(
  pushDeclarations === 1 && literalPushOff === 1,
  "global production push is exactly one literal false declaration",
  "declarations=" + pushDeclarations + " literalOff=" + literalPushOff
);

const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
check(!uuidPattern.test(index), "production browser source has no static UUID-shaped App ID");

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
  "production browser source has no clone/test origin, configuration, or status copy"
);

const literalRegistrations = Array.from(
  index.matchAll(/navigator\.serviceWorker\.register\s*\(\s*(["'`])([^"'`]+)\1/g),
  function(match) { return match[2]; }
);
check(
  literalRegistrations.length === 1 && literalRegistrations[0] === "/pwa-sw.js",
  "current app registers only the active PWA worker",
  JSON.stringify(literalRegistrations)
);
check(
  countMatches(index, /navigator\.serviceWorker\.register\s*\(\s*["'`]\/sw\.js["'`]/) === 0,
  "current app never registers the legacy root worker"
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
    offBlock.includes("topsUnregisterDedicatedPushWorker()") &&
    (guardedRetainedHelpers || removedActivationHelpers),
  "OneSignal activation is removed or fail-closed before every primitive"
);
check(
  countMatches(index, /<script[^>]+src=["'][^"']*onesignal[^"']*["'][^>]*>/i) === 0 &&
    countMatches(index, /navigator\.serviceWorker\.register\s*\(\s*["'`]\/push\/onesignal\//i) === 0 &&
    countMatches(index, /fetch\s*\(\s*["'`]\/push\/onesignal\//i) === 0,
  "current app has no static SDK element or dedicated-worker registration/fetch"
);

check(
  /scope:\s*["']\/["']/.test(index) && /updateViaCache:\s*["']none["']/.test(index),
  "active PWA worker uses root scope and bypasses HTTP cache on update"
);
check(
  !/(?:onesignal|importScripts|notificationclick|SHOW_NOTIFICATION|\bpush\b)/i.test(pwaWorker),
  "active PWA worker is provider-free"
);
check(
  pwaWorker.includes('/.netlify/functions/') &&
    pwaWorker.includes('/api/') &&
    pwaWorker.includes('url.search === ""') &&
    pwaWorker.includes("REVIEWED_LOCAL_PATHS.has(url.pathname)"),
  "active worker excludes APIs and query-bearing non-navigation requests"
);
check(
  pwaWorker.includes("const NAVIGATION_CACHE_KEYS = new Map([") &&
    pwaWorker.includes("if (!NAVIGATION_CACHE_KEYS.has(url.pathname)) return null;") &&
    pwaWorker.includes("!canCacheResponse(request, response) || cacheKey === null") &&
    pwaWorker.includes("cacheKey === null ? Promise.resolve(undefined) : caches.match(cacheKey)"),
  "navigation caching uses a closed allowlist and suppresses unknown-route writes"
);
check(
  pwaWorker.includes('["/erg-handoff.html", "/erg-handoff.html"]') &&
    pwaWorker.includes('["/erg-employer-brief.html", "/erg-employer-brief.html"]') &&
    pwaWorker.includes('["/erg-intranet-launch-kit.html", "/erg-intranet-launch-kit.html"]'),
  "ERG static pages retain distinct navigation cache keys"
);
check(
  countMatches(pwaWorker, new RegExp(FONT_STYLESHEET_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) === 1,
  "Google Fonts URL appears once outside the atomic local asset list"
);
check(
  pwaWorker.includes("key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME"),
  "activation deletes only prior app caches and preserves unrelated caches"
);

const currentCache = cacheVersion(pwaWorker, "active PWA worker");
const legacyCache = cacheVersion(legacyWorker, "legacy root worker");
let historyText;
try {
  historyText = execFileSync("git", ["log", "-p", "--", "pwa-sw.js", "sw.js"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
} catch (error) {
  throw new Error("FAIL cache history could not be read locally: " + String(error && error.message || error));
}
const historicalVersions = Array.from(
  historyText.matchAll(/transition-ops-v([0-9]+)/g),
  function(match) { return Number(match[1]); }
).filter(Number.isSafeInteger);
check(historicalVersions.length > 0, "cache history contains extractable shipped versions");
const historicalMax = Math.max.apply(Math, historicalVersions);
const priorVersions = historicalVersions.filter(function(version) { return version < currentCache; });
const priorMax = priorVersions.length ? Math.max.apply(Math, priorVersions) : legacyCache;
check(
  currentCache >= historicalMax && currentCache > priorMax && currentCache > legacyCache,
  "active cache is the extracted monotonic bumped value",
  "current=v" + currentCache + " historyMax=v" + historicalMax + " priorMax=v" + priorMax + " legacy=v" + legacyCache
);
console.log("CACHE EXPECTATION extracted transition-ops-v" + currentCache);

check(
  countMatches(dedicatedWorker, /importScripts\s*\(/) === 1 &&
    /importScripts\s*\(\s*["']https:\/\/cdn\.onesignal\.com\/sdks\/web\/v16\/OneSignalSDK\.sw\.js["']\s*\)/.test(dedicatedWorker),
  "dedicated worker imports only the provider worker"
);
check(
  dedicatedWorker.includes("tops-intent") && dedicatedWorker.includes("notificationclick"),
  "dedicated worker retains cold-launch intent handling"
);
check(
  !/(?:CACHE_NAME|const\s+ASSETS|addEventListener\s*\(\s*["']fetch["']|SHOW_NOTIFICATION)/.test(dedicatedWorker),
  "dedicated worker contains no app-cache or local-notification logic"
);
check(
  countMatches(rootDedicatedWorker, /importScripts\s*\(/) === 1,
  "legacy root dedicated-worker shim remains separately bounded"
);

Object.entries(LEGACY_HASHES).forEach(function(entry) {
  check(sha256(entry[0]) === entry[1], entry[0] + " legacy hash preserved");
});

check(
  countMatches(ergHandoff, /<form\b/i) === 0 &&
    countMatches(ergEmployerBrief, /<form\b/i) === 0 &&
    countMatches(ergHandoff, /<(?:input|textarea|select)\b/i) === 0 &&
    countMatches(ergEmployerBrief, /<(?:input|textarea|select)\b/i) === 0,
  "ERG static pages contain no collection form or editable field"
);
check(
  !/(?:<script[^>]+src=|<link[^>]+rel=["']stylesheet|<img[^>]+src=|fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share|mailto:|window\.__trackEvent|gtag\s*\(|OneSignal)/i.test(ergHandoff) &&
    !/(?:<script|<link[^>]+rel=["']stylesheet|<img[^>]+src=|fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share|mailto:|window\.__trackEvent|gtag\s*\(|OneSignal)/i.test(ergEmployerBrief),
  "ERG static pages add no network, analytics, provider, or automatic-share integration"
);
check(
  !/https:\/\/transitionops\.org[/?#]/.test(ergHandoff) &&
    !/https:\/\/transitionops\.org[/?#]/.test(ergEmployerBrief) &&
    countMatches(ergHandoff, /https:\/\/transitionops\.org/) === 3 &&
    countMatches(ergEmployerBrief, /https:\/\/transitionops\.org/) === 1,
  "ERG static pages use only the exact public Transition Ops URL"
);
check(
  !/(?:URLSearchParams|location\.search|location\.hash|@veteranbridgesolutions\.com)/i.test(ergHandoff) &&
    !/(?:URLSearchParams|location\.search|location\.hash|@veteranbridgesolutions\.com)/i.test(ergEmployerBrief),
  "ERG static pages contain no personalization reader or VBS contact route"
);
check(
  countMatches(ergIntranetLaunchKit, /<form\b/i) === 0 &&
    countMatches(ergIntranetLaunchKit, /<(?:input|textarea|select)\b/i) === 0 &&
    countMatches(ergIntranetLaunchKit, /<(?:iframe|embed)\b/i) === 0,
  "intranet launch kit contains no collection or embedded-app surface"
);
check(
  countMatches(ergIntranetLaunchKit, /<script\b[^>]*\bsrc=/i) === 0 &&
    countMatches(ergIntranetLaunchKit, /<link\b[^>]*\brel=["']stylesheet["']/i) === 0 &&
    !/(?:@import|@font-face|url\(\s*["']?(?:https?:|\/\/|data:))/i.test(ergIntranetLaunchKit) &&
    launchImageTags.length === 1 &&
    /\bsrc=["']\/transition-ops-public-qr\.png["']/i.test(launchImageTags[0]),
  "intranet launch kit has no external script, style, font, or image asset"
);
check(
  !/(?:fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share|window\.open|window\.__trackEvent|gtag\s*\(|GoogleAnalyticsObject|OneSignal|Mixpanel|Segment|Amplitude|Hotjar|Plausible|PostHog|Intercom|HubSpot)/i.test(launchActiveSurface),
  "intranet launch kit has no network, analytics, provider, or automatic-share integration"
);
check(
  !/(?:localStorage|sessionStorage|indexedDB|document\.cookie|CacheStorage|caches\.|URLSearchParams|location\.(?:search|hash)|document\.referrer|history\.(?:pushState|replaceState))/i.test(launchActiveSurface),
  "intranet launch kit has no storage or query/hash personalization flow"
);
check(
  !/(?:mailto:|tel:|@veteranbridgesolutions\.com|veteranbridgesolutions\.com)/i.test(ergIntranetLaunchKit) &&
    !/(?:oauth|saml|openid|sign[-_ ]?in|\/login\b|\/auth(?:\/|\b)|client[_-]?id|utm_(?:source|medium|campaign|content|term)|gclid|fbclid|msclkid)/i.test(launchActiveSurface),
  "intranet launch kit has no VBS contact, SSO, client-ID, or tracking-parameter flow"
);
check(
  !/\bdata[- ]free\b|\buntracked\b/i.test(ergIntranetLaunchKit),
  "intranet launch kit avoids universal data-free and untracked wording"
);
check(
  launchImageTags.length === 1 &&
    launchImageTags[0].includes('src="/transition-ops-public-qr.png"') &&
    launchImageTags[0].includes('alt="QR code for Transition Ops. The destination is https://transitionops.org."'),
  "intranet launch kit uses one local QR image with approved alternative text"
);
check(
  countMatches(
    ergIntranetLaunchKit,
    /<a class="download-button" href="\/transition-ops-public-qr\.png" download="transition-ops-public-qr\.png">DOWNLOAD QR PNG<\/a>/
  ) === 1 &&
    fs.existsSync(path.join(ROOT, "transition-ops-public-qr.png")) &&
    fs.readFileSync(path.join(ROOT, "transition-ops-public-qr.png")).subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "intranet launch kit provides one local PNG download"
);
check(
  launchPublicAnchorTags.length === 3 && launchPublicAnchorTags.every(function(tag) {
    return /\bhref=["']https:\/\/transitionops\.org["']/.test(tag) &&
      /\brel=["']noopener noreferrer["']/.test(tag) &&
      /\breferrerpolicy=["']no-referrer["']/.test(tag);
  }),
  "every intranet launch-kit public anchor uses the exact hardened public link"
);
check(
  !/https:\/\/transitionops\.org[/?#]/.test(ergIntranetLaunchKit) &&
    !/https?:\/\/(?!transitionops\.org(?:["'<\s)]|\.(?=["'<\s])|$))/i.test(ergIntranetLaunchKit),
  "intranet launch kit contains no alternate, slash, query, or fragment URL"
);

check(
  countMatches(headers, /^\/(?:pwa-sw\.js|sw\.js|OneSignalSDKWorker\.js|push\/onesignal\/OneSignalSDKWorker\.js)$/m) === 4 &&
    countMatches(headers, /^  Content-Type: application\/javascript; charset=utf-8$/m) === 4 &&
    countMatches(headers, /^  Cache-Control: no-cache$/m) === 4,
  "all worker routes have explicit JavaScript and no-cache headers"
);
check(
  countMatches(headers, /^  X-Frame-Options: DENY$/m) === 1 &&
    countMatches(headers, /^  Content-Security-Policy: frame-ancestors 'none'$/m) === 1 &&
    countMatches(headers, /^  Access-Control-Allow-Origin: \*$/m) === 1 &&
    countMatches(headers, /^  X-Frame-Options: ALLOWALL$/m) === 0 &&
    countMatches(headers, /^  Content-Security-Policy: frame-ancestors \*$/m) === 0,
  "frame-blocking headers are exact and permissive predecessors are absent"
);
check(
  packageJson.scripts && packageJson.scripts["test:sw-privacy"] === "node scripts/sw-privacy-regression.js",
  "package preserves the service-worker privacy regression command"
);
check(
  packageJson.scripts && packageJson.scripts["build:public"] === "node scripts/build-public.js",
  "package exposes the exact public build command"
);
check(
  countMatches(netlifyConfig, /^\[build\]$/m) === 1 &&
    countMatches(netlifyConfig, /^  command = "npm run build:public"$/m) === 1 &&
    countMatches(netlifyConfig, /^  publish = "dist"$/m) === 1 &&
    countMatches(netlifyConfig, /^\[functions\]$/m) === 1 &&
    countMatches(netlifyConfig, /^  directory = "netlify\/functions"$/m) === 1,
  "Netlify uses the exact public build, dist publish boundary, and functions directory"
);

runExecutableWorkerChecks()
  .then(function() {
    runPublicBuildChecks(publicBuilder);
    console.log("SW-PRIVACY REGRESSION PASS");
  })
  .catch(function(error) {
    console.error(String(error && error.stack || error));
    process.exitCode = 1;
  });
