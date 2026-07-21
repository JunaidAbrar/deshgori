/* Deshgori service worker — app-shell precache + runtime cache.
   Goal (Hard Constraint 5): fully usable offline after the first visit, on
   low-end Android over 3G. No third-party requests. */

const CACHE = 'deshgori-v2';

// Known navigation routes (trailingSlash: true → each is a folder/index.html).
const SHELL = [
  '/',
  '/track/worker/',
  '/track/worker/w1/',
  '/track/worker/w2/',
  '/track/worker/w3/',
  '/track/worker/w4/',
  '/track/worker/w5/',
  '/track/worker/w6/',
  '/track/student/',
  '/track/student/s1/',
  '/track/student/s2/',
  '/track/student/s3/',
  '/track/tourist/',
  '/track/tourist/t1/',
  '/jatra/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch third-party

  // Pages: network-first (fresh copy), fall back to cache, then home shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/'))),
    );
    return;
  }

  // Static assets (/_next/…, fonts, audio, icons): stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
