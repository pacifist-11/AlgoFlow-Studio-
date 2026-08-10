/* eslint-disable no-undef */
const CACHE_NAME = 'algoflow-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/favicon.svg',
  '/manifest.json'
];

// Install Event - Precache initial assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.log('Error caching initial assets:', err));
    })
  );
  self.skipWaiting();
});

// Activate Event - Clear old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith('http')) return;

  // HTML / Navigation requests: Network First, fallback to cached index.html
  if (e.request.mode === 'navigate' || (e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html'))) {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request).then((cached) => {
          return cached || caches.match('/') || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Assets (JS, CSS, images, fonts): Cache First, fallback to Network + Dynamic Caching
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          e.request.method === 'GET' &&
          !e.request.url.includes('googlesyndication') &&
          !e.request.url.includes('pagead')
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Silent catch for offline network failures on non-cached external assets
      });
    })
  );
});


