var CACHE_NAME = 'pwa-app-manager';
var urlsToCache = [
  '/dashboard', '/audience','/inbox','/saves','/settings'
  ];
 
// Install a service worker
this.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
this.addEventListener('fetch', event => {
    if(!navigator.onLine){
        event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                // Cache hit - return response
                if (response) {
                  return response;
                }
                let requestUrl = event.request.clone();
                fetch(requestUrl);
              }
            )
        );
    }else{
     console.log('connected');
    }
});


