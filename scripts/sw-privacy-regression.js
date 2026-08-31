"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

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
  const flags = pattern.flags.indexOf("g") === -1 ? pattern.flags + "g" : pattern.flags;
  return Array.from(source.matchAll(new RegExp(pattern.source, flags))).length;
}

function functionBlock(source, name) {
  const start = source.indexOf("function " + name + "(");
  if (start === -1) return "";
  const rest = source.slice(start + 1);
  const next = /\n(?:async\s+)?function /.exec(rest);
  return source.slice(start, next ? start + 1 + next.index : source.length);
}

function check(condition, label) {
  if (!condition) throw new Error("FAIL " + label);
  console.log("PASS " + label);
}

const index = read("index.html");
const pwaWorker = read("pwa-sw.js");
const dedicatedWorker = read("push/onesignal/OneSignalSDKWorker.js");
const headers = read("_headers");
const packageJson = JSON.parse(read("package.json"));

const helperStart = index.indexOf("const TOPS_PUSH_ENABLED = true;");
const helperEnd = index.indexOf("// ═══════════════════════════════════════════════════════════════\n// TRANSITION OPS", helperStart);
check(helperStart !== -1 && helperEnd > helperStart, "push helper block is extractable for closed-state tests");

let storedChoice = null;
let createdProviderScripts = 0;
const sandbox = {
  console: console,
  localStorage: { removeItem: function() { storedChoice = null; } },
  navigator: {
    serviceWorker: { getRegistrations: function() { return Promise.resolve([]); } }
  },
  document: {
    getElementById: function() { return null; },
    createElement: function() { createdProviderScripts += 1; return {}; },
    head: { appendChild: function() {} }
  },
  window: {
    __IS_IFRAME: false,
    __safeGet: function() { return storedChoice; },
    __safeSet: function(key, value) { storedChoice = value; },
    location: { origin: "http://127.0.0.1:4173" }
  }
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(
  index.slice(helperStart, helperEnd) +
    "\nthis.__topsHarness = { parse: topsParsePushChoice, accepted: topsPushChoiceAccepted, configReady: topsPushConfigReady, epochDay: topsDateToEpochDay };",
  sandbox,
  { filename: "index-push-helpers.js" }
);

const acceptedChoice = JSON.stringify({
  state: "accepted",
  noticeVersion: "sw-privacy-01-v1",
  timingMode: "exact-day"
});
check(sandbox.__topsHarness.parse(acceptedChoice).state === "accepted", "current exact-day choice parses");
check(
  sandbox.__topsHarness.parse(JSON.stringify({ state: "accepted", noticeVersion: "old", timingMode: "exact-day" })) === null,
  "stale notice fails closed"
);
check(
  sandbox.__topsHarness.parse(JSON.stringify({ state: "accepted", noticeVersion: "sw-privacy-01-v1", timingMode: "exact-day", extra: true })) === null,
  "unknown local-choice field fails closed"
);
check(sandbox.__topsHarness.parse("not-json") === null, "malformed local choice fails closed");
storedChoice = acceptedChoice;
check(sandbox.__topsHarness.accepted() === true, "accepted current choice is recognized");
check(sandbox.__topsHarness.configReady() === false && createdProviderScripts === 0, "unapproved origin creates no provider element");
check(
  sandbox.__topsHarness.epochDay("2027-01-15") === Math.floor(Date.UTC(2027, 0, 15) / 86400000),
  "exact date converts to one UTC epoch-day value"
);

check(
  countMatches(index, /<script[^>]+src=["']https:\/\/cdn\.onesignal\.com\/sdks\/web\/v16\/OneSignalSDK\.page\.js["'][^>]*>/i) === 0,
  "no static OneSignal page SDK element"
);
check(
  countMatches(index, /navigator\.serviceWorker\.register\(\s*["']\/sw\.js["']/) === 0,
  "current app never registers the legacy root worker"
);
check(
  countMatches(index, /navigator\.serviceWorker\.register\(\s*["']\/pwa-sw\.js["']/) === 1,
  "current app registers one active PWA worker"
);
check(
  /scope:\s*["']\/["']/.test(index) && /updateViaCache:\s*["']none["']/.test(index),
  "active worker uses root scope and bypasses HTTP cache on update"
);
check(
  !/(onesignal|importScripts|notificationclick|SHOW_NOTIFICATION|push)/i.test(pwaWorker),
  "active PWA worker is provider-free"
);
check(
  pwaWorker.indexOf('/.netlify/functions/') !== -1 &&
    pwaWorker.indexOf('/api/') !== -1 &&
    pwaWorker.indexOf('url.search === ""') !== -1 &&
    pwaWorker.indexOf("REVIEWED_LOCAL_PATHS.has(url.pathname)") !== -1,
  "active worker excludes API routes and query-bearing non-navigation requests"
);
check(
  pwaWorker.indexOf('return "/";') !== -1 && pwaWorker.indexOf("cache.put(cacheKey, clone)") !== -1,
  "navigation cache keys cannot retain member query values"
);
check(
  pwaWorker.indexOf("key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME") !== -1,
  "activation deletes only prior app caches and preserves the intent cache"
);
check(
  countMatches(dedicatedWorker, /importScripts\(["']https:\/\/cdn\.onesignal\.com\/sdks\/web\/v16\/OneSignalSDK\.sw\.js["']\)/) === 1,
  "dedicated worker imports the provider worker exactly once"
);
check(
  dedicatedWorker.indexOf("tops-intent") !== -1 && dedicatedWorker.indexOf("notificationclick") !== -1,
  "dedicated worker retains cold-launch intent handling"
);
check(
  !/(CACHE_NAME|const ASSETS|addEventListener\(["']fetch["']|SHOW_NOTIFICATION)/.test(dedicatedWorker),
  "dedicated worker contains no app-cache or local-notification logic"
);
check(
  /const TOPS_PUSH_ENABLED = true;/.test(index),
  "clone push feature gate is on"
);
check(
  /const TOPS_CLONE_ONESIGNAL_APP_ID = "6b0400ce-cb2f-44d2-990d-c6ffb7a5db3a";/.test(index) &&
    /const TOPS_PUSH_ALLOWED_ORIGIN = "https:\/\/transition-ops-openai-clone\.netlify\.app";/.test(index),
  "clone provider identifiers are exact"
);
check(
  index.indexOf("5b25d308-645b-4459-8810-36ac09da88f5") === -1,
  "production OneSignal App ID is absent"
);
check(
  /const TOPS_PUSH_TIMING_MODE = "exact-day";/.test(index) && /const TOPS_PUSH_NOTICE_VERSION = "sw-privacy-01-v1";/.test(index),
  "exact-day notice version is pinned"
);
check(
  /const TOPS_PUSH_CHOICE_FIELDS = \["noticeVersion", "state", "timingMode"\];/.test(index),
  "local choice parser uses the closed three-field schema"
);

const loaderBlock = functionBlock(index, "topsLoadOneSignalSdk");
const initBlock = functionBlock(index, "topsInitializeOneSignal");
const enrollmentBlock = functionBlock(index, "topsStartPushEnrollment");
const resumeBlock = functionBlock(index, "topsResumeAcceptedPush");
const stopBlock = functionBlock(index, "topsStopPushProcessing");
const declineBlock = functionBlock(index, "topsDeclinePushChoice");
const withdrawBlock = functionBlock(index, "topsWithdrawPushChoice");

check(
  loaderBlock.indexOf("topsPushChoiceAccepted()") !== -1 && loaderBlock.indexOf("topsPushConfigReady()") !== -1,
  "SDK loader requires accepted current choice and approved clone configuration"
);
check(
  countMatches(index, /topsLoadOneSignalSdk\(/) === 2 && initBlock.indexOf("topsLoadOneSignalSdk()") !== -1,
  "SDK loader has one guarded call site"
);
check(
  enrollmentBlock.indexOf("topsPushChoiceAccepted()") !== -1 && enrollmentBlock.indexOf("topsPushConfigReady()") !== -1,
  "fresh enrollment fails closed before provider initialization"
);
check(
  resumeBlock.indexOf("topsPushChoiceAccepted()") !== -1 && resumeBlock.indexOf("topsPushConfigReady()") !== -1,
  "returning enrollment fails closed for stale or missing choice"
);
check(
  stopBlock.indexOf('removeTag("ets_epoch_day")') < stopBlock.indexOf("PushSubscription.optOut()") &&
    stopBlock.indexOf("PushSubscription.optOut()") < stopBlock.indexOf("setConsentGiven(false)") &&
    stopBlock.indexOf("setConsentGiven(false)") < stopBlock.indexOf("topsUnregisterDedicatedPushWorker()"),
  "denial and withdrawal cleanup uses the approved provider order"
);
check(
  declineBlock.indexOf("topsUnregisterDedicatedPushWorker()") !== -1 &&
    declineBlock.indexOf("topsLoadOneSignalSdk") === -1 &&
    declineBlock.indexOf("topsInitializeOneSignal") === -1,
  "decline removes stale dedicated state without loading the provider"
);
check(
  withdrawBlock.indexOf('topsStopPushProcessing("withdrawn"') !== -1 &&
    index.indexOf("window.location.reload();") !== -1,
  "withdrawal revokes processing before the page reloads"
);
check(
  initBlock.indexOf("setConsentRequired(true)") < initBlock.indexOf(".init({") && initBlock.indexOf("setConsentRequired(true)") !== -1,
  "consent-required mode is set before initialization"
);
check(
  initBlock.indexOf('serviceWorkerPath: "push/onesignal/OneSignalSDKWorker.js"') !== -1 &&
    initBlock.indexOf('scope: "/push/onesignal/"') !== -1 &&
    initBlock.indexOf("requiresUserPrivacyConsent: true") !== -1 &&
    initBlock.indexOf("autoResubscribe: false") !== -1,
  "provider initialization names the dedicated path, scope, and privacy controls"
);
check(
  countMatches(index, /\.User\.addTag\(\s*["']ets_epoch_day["']/) === 1 && countMatches(index, /\.User\.addTags\(/) === 0,
  "only the approved exact-day field is written"
);
check(
  !/(last_active|ets_date|days_out|months_out)/.test(index) && !/\.User\.addTag\(\s*["']status["']/.test(index),
  "prohibited provider timing and status tags are absent"
);
check(
  index.indexOf("notif_enable_tapped") === -1 && index.indexOf("notif_blocked_ios_install") === -1 && index.indexOf("notif_permission_result") === -1,
  "push-choice analytics events are absent"
);
check(
  functionBlock(index, "topsLoadOneSignalSdk").indexOf("window.__IS_IFRAME") !== -1 &&
    /if \(!__EMBED_MODE && "serviceWorker" in navigator\)/.test(index),
  "iframe mode blocks worker registration and provider loading"
);
check(
  index.indexOf("dean@veteranbridgesolutions.com") !== -1 && index.indexOf("Choose whether to use push alerts") !== -1,
  "approved privacy contact and pre-permission title are present"
);
check(
  index.indexOf("Push setup is being updated on this test site.") !== -1,
  "disabled-gate fallback state is truthful"
);
check(
  index.indexOf("This isolated clone enables consent-gated push validation; the production app is unchanged.") !== -1 &&
    index.indexOf("This isolated clone enables consent-gated push testing; the production app is unchanged.") !== -1,
  "enabled clone status is bounded and distinguishes production"
);
check(
  pwaWorker.indexOf('const CACHE_NAME = "transition-ops-v141";') !== -1,
  "first active-worker cache advances beyond prior v140"
);
check(
  countMatches(headers, /^\/(?:pwa-sw\.js|sw\.js|OneSignalSDKWorker\.js|push\/onesignal\/OneSignalSDKWorker\.js)$/m) === 4 &&
    countMatches(headers, /^  Content-Type: application\/javascript; charset=utf-8$/m) === 4 &&
    countMatches(headers, /^  Cache-Control: no-cache$/m) === 4,
  "all worker routes have explicit JavaScript and no-cache headers"
);
check(
  packageJson.scripts && packageJson.scripts["test:sw-privacy"] === "node scripts/sw-privacy-regression.js",
  "package exposes the deterministic privacy regression"
);

Object.keys(LEGACY_HASHES).forEach(function(relativePath) {
  check(sha256(relativePath) === LEGACY_HASHES[relativePath], relativePath + " legacy hash preserved");
});

console.log("SW-PRIVACY REGRESSION PASS");
