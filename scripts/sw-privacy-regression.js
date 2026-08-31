"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const LEGACY_HASHES = Object.freeze({
  "sw.js": "45a4f093d7a19d4403cdaa5da0e6d6ae0a7ae497080fe92694046be789108d32",
  "OneSignalSDKWorker.js": "2f213985d10e5c5117acfde4f0cab00ad2c13035577ef38c7f0d86d2dd722fbc"
});

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
const packageJson = JSON.parse(read("package.json"));
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
  pwaWorker.includes('return "/";') && pwaWorker.includes("cache.put(cacheKey, clone)"),
  "navigation cache keys cannot retain member query values"
);
check(
  pwaWorker.includes('url.pathname === "/erg-handoff.html"') &&
    pwaWorker.includes('url.pathname === "/erg-employer-brief.html"') &&
    pwaWorker.includes('url.pathname === "/erg-intranet-launch-kit.html"'),
  "ERG static pages retain distinct navigation cache keys"
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

console.log("SW-PRIVACY REGRESSION PASS");
