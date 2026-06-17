const CACHE_NAME = 'epa-physics-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/shared.css',
  '/shared-core.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Chapter HTMLs
  '/Chapter 1 Force and Motion.html',
  '/Chapter 2 Particle Dynamics 质点动力学.html',
  '/Chapter 3 Rotation of Rigid Body 刚体转动.html',
  '/Chapter 4 Special Relativity 狭义相对论.html',
  '/Chapter 5 Mechanical Vibration.html',
  '/Chapter 6 Mechanical Wave.html',
  '/Chapter 7 Kinetic Theory of Ideal Gas.html',
  '/Chapter 8 Thermodynamics.html',
  // JSON quiz data
  '/ch1.json', '/ch2.json', '/ch3.json', '/ch4.json',
  '/ch5.json', '/ch6.json', '/ch7.json', '/ch8.json',
];

// Install: pre-cache core shell
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first for static, network-first for slides (big images lazy-loaded)
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // Slides: network-first with cache fallback (they're lazy-loaded anyway)
  if (url.pathname.indexOf('/slides/') >= 0) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // MathJax CDN: network-first (CDN should be fast)
  if (url.hostname.indexOf('cdn.jsdelivr.net') >= 0) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Everything else: cache-first, background network update
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var fetchPromise = fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
      return cached || fetchPromise;
    })
  );
});
