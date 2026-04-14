/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'alfredgo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/css/style.css',
  '/htmx.min.js',
  '/manifest.json'
];

// Install: Cache core assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch: Stale-While-Revalidate
// This handles full pages and HTMX fragments identically.
self.addEventListener('fetch', (event: FetchEvent) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update the cache with the fresh response
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {});

        // Return cached version immediately, or wait for fetch if not in cache
        return cachedResponse || fetchPromise as Promise<Response>;
      });
    })
  );
});
