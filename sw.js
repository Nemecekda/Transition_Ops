const CACHE_NAME = 'transition-ops-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap'
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

// NETWORK FIRST — always try to get latest, fall back to cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
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
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, tag, delay } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        tag: tag,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { url: '/' }
      });
    }, delay);
  }
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
