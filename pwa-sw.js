const CACHE_NAME = "transition-ops-v148";
const CACHE_PREFIX = "transition-ops-v";
const NETWORK_TIMEOUT_MS = 3500;

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/va-math/",
  "/bdd-timeline/",
  "/vendor/react.production.min.js",
  "/vendor/react-dom.production.min.js",
  "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
];

const REVIEWED_LOCAL_PATHS = new Set([
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

const REVIEWED_REMOTE_URLS = new Set([
  "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
]);

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(ASSETS); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(keys
          .filter(function(key) {
            return key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME;
          })
          .map(function(key) { return caches.delete(key); }));
      })
      .then(function() { return self.clients.claim(); })
  );
});

function isReviewedRequest(request) {
  if (request.method !== "GET") return false;

  var url = new URL(request.url);
  var sameOrigin = url.origin === self.location.origin;
  if (request.mode === "navigate") {
    if (!sameOrigin) return false;
    if (url.pathname.indexOf("/.netlify/functions/") === 0) return false;
    if (url.pathname.indexOf("/api/") === 0) return false;
    return true;
  }

  if (sameOrigin) {
    return url.search === "" && REVIEWED_LOCAL_PATHS.has(url.pathname);
  }
  return REVIEWED_REMOTE_URLS.has(url.href);
}

function cacheKeyFor(request) {
  if (request.mode !== "navigate") return request;
  var url = new URL(request.url);
  if (url.pathname === "/va-math/" ||
      url.pathname === "/bdd-timeline/" ||
      url.pathname === "/erg-handoff.html" ||
      url.pathname === "/erg-employer-brief.html" ||
      url.pathname === "/erg-intranet-launch-kit.html") {
    return url.pathname;
  }
  return "/";
}

function canCacheResponse(request, response) {
  if (!response || response.status !== 200) return false;
  if (request.mode !== "navigate") return true;
  var contentType = response.headers.get("content-type") || "";
  return contentType.indexOf("text/html") !== -1;
}

self.addEventListener("fetch", function(event) {
  var request = event.request;
  if (!isReviewedRequest(request)) return;

  var cacheKey = cacheKeyFor(request);
  var networkFetch = fetch(request).then(function(response) {
    if (!canCacheResponse(request, response)) return response;
    var clone = response.clone();
    return caches.open(CACHE_NAME)
      .then(function(cache) { return cache.put(cacheKey, clone); })
      .catch(function() {})
      .then(function() { return response; });
  });

  event.waitUntil(networkFetch.catch(function() {}));
  var timeout = new Promise(function(resolve, reject) {
    setTimeout(function() { reject(new Error("sw-timeout")); }, NETWORK_TIMEOUT_MS);
  });

  event.respondWith(
    Promise.race([networkFetch, timeout]).catch(function() {
      return caches.match(cacheKey).then(function(cached) {
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("/");
        return networkFetch;
      });
    })
  );
});
