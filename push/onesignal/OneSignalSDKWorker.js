// Notification tap intent recorder: iOS cold launch drops URL params, so the
// tap's target tool is parked in a cache the app reads on boot.
self.addEventListener("notificationclick", function(event) {
  try {
    var blob = "";
    try { blob = JSON.stringify((event.notification && event.notification.data) || {}); } catch (e) {}
    blob += " " + ((event.notification && event.notification.tag) || "");
    var match = /tool=([a-z0-9]+)/.exec(blob);
    if (match) {
      event.waitUntil(caches.open("tops-intent").then(function(cache) {
        return cache.put("/intent", new Response(JSON.stringify({
          tool: match[1],
          ts: Date.now()
        }), { headers: { "Content-Type": "application/json" } }));
      }));
    }
  } catch (e) {}
});

importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
