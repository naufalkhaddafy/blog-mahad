self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Just pass through requests. We only need this for the PWA install prompt.
    e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })));
});
