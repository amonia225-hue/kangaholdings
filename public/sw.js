// Kanga Holdings — service worker (offline shell + web push)
const CACHE = 'kanga-v1';
const SHELL = ['/', '/produits', '/offline.html', '/img/kanga-logo.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
        ).then(() => self.clients.claim()),
    );
});

// Network-first for navigations (fresh content), fall back to cache/offline page.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req).then((r) => r || caches.match('/offline.html'))),
        );
        return;
    }

    // Cache-first for static assets we already have.
    if (/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/.test(new URL(req.url).pathname)) {
        event.respondWith(
            caches.match(req).then((cached) =>
                cached ||
                fetch(req).then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                }).catch(() => cached),
            ),
        );
    }
});

// Incoming push notification
self.addEventListener('push', (event) => {
    let data = { title: 'Kanga Holdings', body: '', url: '/compte' };
    try {
        if (event.data) data = { ...data, ...event.data.json() };
    } catch (e) {
        if (event.data) data.body = event.data.text();
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url: data.url },
            vibrate: [80, 40, 80],
        }),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/compte';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const client of list) {
                if ('focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return self.clients.openWindow(url);
        }),
    );
});
