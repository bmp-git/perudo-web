const version = "0.0.2";
const cacheName = `perudo-${version}`;
self.addEventListener('install', function(event) {
  console.log("Installing and caching");
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(
        [
          '/offline.html',
          '/service-worker.js'
        ]
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(    
    fetch(event.request).catch(() => {
      console.log("No connection");
      return caches.match('/offline.html')
    })
    
  );
});