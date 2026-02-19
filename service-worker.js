const CACHE_NAME = 'thoreson-estate-v15';
const urlsToCache = [
  '/Thoreson_Estate_Dinner/',
  '/Thoreson_Estate_Dinner/index.html',
  '/Thoreson_Estate_Dinner/authenticated-dashboard.html',
  '/Thoreson_Estate_Dinner/login.html',
  '/Thoreson_Estate_Dinner/manifest.json'
];

// Install event - skip waiting immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
          return Promise.resolve();
        });
      })
  );
});

// Activate event - delete ALL old caches aggressively
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - ALWAYS network first for HTML
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // ALL HTML and navigation requests: network only, cache as fallback
  if (event.request.url.includes('.html') || event.request.mode === 'navigate') {
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
          return caches.match(event.request);
        })
    );
  } else {
    // For other resources - network first too
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
