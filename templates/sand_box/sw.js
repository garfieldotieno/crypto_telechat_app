console.log('now loading sw.js');

const CACHE_NAME = 'telegram-clone-v1';
const ASSETS = [
  '/',
  '/app.html',
  '/static/css/app.css',
  '/static/js/app.js',
  '/static/js/navigation2.js',
  '/static/js/ui2-structure.js',
  '/static/js/render2.js',
  '/static/js/pwa-manager.js',
  '/static/images/SplashScreen.png',
  // Add other assets as needed
];

// Install event - Cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS);
      })
  );
});


// Helper function to check if URL is cacheable
function isCacheableUrl(url) {
  const urlObj = new URL(url, location.href);
  
  // Only cache requests from the same origin and with http/https schemes
  return (urlObj.origin === location.origin || urlObj.origin.startsWith('http')) && 
         (urlObj.protocol === 'http:' || urlObj.protocol === 'https:');
}

// Fetch event - Respond with cached assets or fetch from network
self.addEventListener('fetch', event => {
  // Only handle HTTP/HTTPS URLs
  if (!isCacheableUrl(event.request.url)) {
    return; // Skip non-cacheable URLs (like chrome-extension://)
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request and cache response
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Make sure we only cache from our origin or HTTP/HTTPS
            if (isCacheableUrl(event.request.url)) {
              // Clone the response
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            
            return response;
          })
          .catch(error => {
            console.error('Fetch error:', error);
            // Optionally return a custom offline page here
            // return caches.match('/offline.html');
          });
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Force the waiting service worker to become the active service worker
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});


