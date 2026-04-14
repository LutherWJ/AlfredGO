// src/client/sw.ts
var CACHE_NAME = "alfredgo-v1";
var ASSETS_TO_CACHE = [
  "/",
  "/css/style.css",
  "/htmx.min.js",
  "/manifest.json"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(ASSETS_TO_CACHE);
  }));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
  }));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET")
    return;
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {});
      return cachedResponse || fetchPromise;
    });
  }));
});
