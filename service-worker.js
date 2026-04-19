const CACHE_VERSION = "cookspan-v3";
const CACHE_URLS = [
  "/",
  "/index.html",
  "/assets/main.css",
  "/feed.xml",
  "/search.json",
];

// Install event - cache essential files and all articles
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache
        .addAll(CACHE_URLS)
        .then(() => {
          // Fetch and cache all articles
          return fetch("/articles.json")
            .then((response) => response.json())
            .then((data) => {
              if (data.articles && Array.isArray(data.articles)) {
                return cache.addAll(data.articles).catch((err) => {
                  console.warn("Failed to cache some articles:", err);
                  // Continue even if some articles fail to cache
                  return Promise.resolve();
                });
              }
              return Promise.resolve();
            })
            .catch((err) => {
              console.warn("Failed to fetch articles list:", err);
              return Promise.resolve();
            });
        })
        .catch((err) => {
          console.warn("Failed to cache essential URLs during install:", err);
          // Continue even if some URLs fail to cache
          return Promise.resolve();
        });
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - network first for HTML, cache first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy for HTML pages - network first, fallback to cache
  if (
    request.headers.get("accept")?.includes("text/html") ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/");
          });
        }),
    );
    return;
  }

  // Strategy for assets (CSS, JS, images, fonts) - cache first, fallback to network
  if (
    request.url.includes("/assets/") ||
    request.url.endsWith(".css") ||
    request.url.endsWith(".js") ||
    request.url.endsWith(".png") ||
    request.url.endsWith(".jpg") ||
    request.url.endsWith(".jpeg") ||
    request.url.endsWith(".gif") ||
    request.url.endsWith(".webp") ||
    request.url.endsWith(".svg") ||
    request.url.endsWith(".woff") ||
    request.url.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            // Cache new assets
            if (response.ok) {
              const responseToCache = response.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          })
        );
      }),
    );
    return;
  }

  // Default strategy - network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      }),
  );
});
