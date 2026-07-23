// OneSignal push worker merged in (v71) — one worker owns the scope so offline
// caching and push notifications coexist. Guarded: if the CDN is unreachable at
// install time, caching still works and push simply activates on a later install.
try { importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); } catch (e) {}

const CACHE_NAME = 'transition-ops-v91';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/va-math/',
  '/vendor/react.production.min.js',
  '/vendor/react-dom.production.min.js',
  'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// NETWORK FIRST with a timeout — try to get latest; on failure OR a slow/dead
// connection (>3.5s), fall back to cache so the app never hangs on bad Wi-Fi.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // never intercept/cache POSTs (GA, email signup)
  const networkFetch = fetch(event.request).then(response => {
    if (response && response.status === 200) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
    }
    return response;
  });
  const timeout = new Promise((resolve, reject) => setTimeout(() => reject(new Error('sw-timeout')), 3500));
  event.respondWith(
    Promise.race([networkFetch, timeout]).catch(() =>
      caches.match(event.request, { ignoreSearch: event.request.mode === 'navigate' }).then(cached => {
        if (cached) return cached;
        // Deep links like /?tool=vamath or /va-math/ fall back to the app shell offline
        if (event.request.mode === 'navigate') return caches.match('/');
        return networkFetch; // last resort: let the slow network answer (or fail) naturally
      })
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('message', event => {
  // v72: SCHEDULE_NOTIFICATION (setTimeout inside a service worker) removed - browsers
  // terminate idle workers, so delayed timers silently never fired. Threshold pushes
  // now come from OneSignal segments (ets_epoch_day tag) instead.
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = event.data;
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: '/' }
    });
  }
});
