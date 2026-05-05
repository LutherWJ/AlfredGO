/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'alfredgo-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/css/style.css',
  '/htmx.min.js',
  '/manifest.json',
  '/images/Alfred_State_Primary_Logo_250x250.png'
];

// Install: Cache core assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use a more resilient approach for initial caching: 
      // Individual fetches ensure one failure (like a redirect on /) 
      // doesn't block caching of other critical assets like CSS/JS
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (e) {
            console.warn(`[SW] Failed to cache ${url} during install:`, e);
          }
        })
      );
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

// Fetch: Dynamic strategy based on request type
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';
  const isApi = url.pathname.startsWith('/api/');
  const isAuth = url.pathname.startsWith('/auth/');
  const isStatic = url.pathname.startsWith('/css/') || 
                   url.pathname.startsWith('/js/') || 
                   url.pathname.startsWith('/images/') ||
                   url.pathname.endsWith('.json');

  // Network First for Navigation and API routes to enforce auth checks
  if (isNavigation || (isApi && !isStatic)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            // If offline and no exact match for this navigation URL, 
            // fallback to the cached root (Home page)
            if (isNavigation && !cachedResponse) {
              return caches.match('/');
            }
            return cachedResponse || Response.error();
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate for static assets
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {});

        return cachedResponse || fetchPromise as Promise<Response>;
      });
    })
  );
});
