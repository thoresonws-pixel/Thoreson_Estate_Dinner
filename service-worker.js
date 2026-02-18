const CACHE_NAME = 'thoreson-estate-v4';
const urlsToCache = [
  '/Thoreson_Estate_Dinner/',
  '/Thoreson_Estate_Dinner/index.html',
  '/Thoreson_Estate_Dinner/authenticated-dashboard.html',
  '/Thoreson_Estate_Dinner/login.html',
  '/Thoreson_Estate_Dinner/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - NETWORK FIRST for instant updates
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // For HTML files - network first (always get latest for speed)
  if (event.request.url.includes('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails (offline mode)
          return caches.match(event.request);
        })
    );
  } else {
    // For other resources - cache first
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Listen for messages from the app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
