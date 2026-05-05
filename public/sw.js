// src/client/sw.ts
var CACHE_NAME = "alfredgo-v1";
var ASSETS_TO_CACHE = [
  "/",
  "/css/style.css",
  "/htmx.min.js",
  "/manifest.json",
  "/images/Alfred_State_Primary_Logo_250x250.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return Promise.allSettled(ASSETS_TO_CACHE.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (e) {
        console.warn(`[SW] Failed to cache ${url} during install:`, e);
      }
    }));
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
  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === "navigate";
  const isApi = url.pathname.startsWith("/api/");
  const isAuth = url.pathname.startsWith("/auth/");
  const isStatic = url.pathname.startsWith("/css/") || url.pathname.startsWith("/js/") || url.pathname.startsWith("/images/") || url.pathname.endsWith(".json");
  if (isNavigation || isApi && !isStatic) {
    event.respondWith(fetch(event.request).then((networkResponse) => {
      return caches.open(CACHE_NAME).then((cache) => {
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      });
    }).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (isNavigation && !cachedResponse) {
          return caches.match("/");
        }
        return cachedResponse || Response.error();
      });
    }));
    return;
  }
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
