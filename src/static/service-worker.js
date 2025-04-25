// Service Worker for TAAG (Text to ASCII Art Generator)
const CACHE_NAME = 'taag-cache-v1';
const FONT_CACHE_NAME = 'taag-fonts-v1';

// Core assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.js',
  '/app.css'
];

// Popular fonts to pre-cache
const FONTS_TO_CACHE = [
  'Standard',
  'Graffiti',
  'ANSI Shadow',
  'Slant',
  'Small',
  'Big',
  'Banner',
  'Poison',
  'Ghost',
  'Doom'
];

// Install event - cache assets and popular fonts
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(ASSETS_TO_CACHE);
        }),
      
      // Pre-cache popular fonts
      caches.open(FONT_CACHE_NAME)
        .then((cache) => {
          const fontPromises = FONTS_TO_CACHE.map(fontName => {
            const fontUrl = `https://unpkg.com/figlet/fonts/${fontName}.flf`;
            return fetch(fontUrl)
              .then(response => {
                if (response.ok) {
                  return cache.put(fontUrl, response);
                }
                return Promise.resolve(); // Skip if font not found
              })
              .catch(() => Promise.resolve()); // Skip network errors
          });
          
          return Promise.all(fontPromises);
        })
    ])
    .then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== FONT_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle figlet font requests specially
  if (event.request.url.includes('unpkg.com/figlet/fonts/')) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Return from cache if available
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise fetch from network and cache
          return fetch(event.request).then((response) => {
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            cache.put(event.request, responseToCache);
            
            return response;
          }).catch(() => {
            // If network fails and we can't get from cache, 
            // return a simple response with error information
            return new Response('Font not available offline', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        });
      })
    );
    return;
  }
  
  // For all other requests, try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Update the cache
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If item not in cache, return a fallback for HTML requests
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
          
          // Otherwise return an error
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
}); 