'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "da6836add1c12d8d6118a621ae5902c0",
"assets/AssetManifest.bin.json": "741c63f2773eebf7dbd5d83643b20e85",
"assets/AssetManifest.json": "549283abce992173cc8d6457939e7031",
"assets/FontManifest.json": "759e5e562241f23be10781d9ba7aba13",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/fonts/Tajawal-Bold.ttf": "73222b42f57d11db8ed71c1752e121c0",
"assets/fonts/Tajawal-Medium.ttf": "1472d65abf09fa765956fd3d32dadf48",
"assets/images/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png": "a4be512e7195b6b733d9110b408f075d",
"assets/images/email.png": "c32338f34b5871fb35443812a61c262a",
"assets/images/facebook-logo.png": "654968b3afbccac492c7025c104896ec",
"assets/images/Group%25207.png": "ef921da463745f187604ad3e7dc5c532",
"assets/images/icon.jpg": "c4adc7551629de02ab8381e8d7280ae8",
"assets/images/icon_logo.jpg": "c898bbde2dff4e8aef47e37bff6d0d25",
"assets/images/internet.png": "bcbfe36ce0280290a2a59d75456eb04b",
"assets/images/telephone.png": "901c72840d0f779cd5ee147d75d20e5c",
"assets/images/user.png": "ccf06429758ead3a0001c880240b2e9c",
"assets/images/waite.json": "576f38ecdb5da7091749c3ecb4cb9f24",
"assets/images/whatsapp.png": "f33779e9d1e56011099c4d3b4fb76285",
"assets/NOTICES": "5a23c9934d24d4101ab127b206299f9f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/uicons_bold_rounded/font/uicons_bold_rounded.ttf": "edc9ae25a3b63b7a354338147fbeaa30",
"assets/packages/uicons_bold_straight/font/uicons_bold_straight.ttf": "553af576fba028fa0d0da64c37b534ca",
"assets/packages/uicons_brands/font/uicons_brands.ttf": "efbfb2a241ff49f1a22160361b66a1a3",
"assets/packages/uicons_regular_rounded/font/uicons_regular_rounded.ttf": "ef9bc8b8078dffe8491fb20e5c521280",
"assets/packages/uicons_regular_straight/font/uicons_regular_straight.ttf": "741d4bdce4e72aa808046a72b0d995eb",
"assets/packages/uicons_solid_rounded/font/uicons_solid_rounded.ttf": "4b98c06c43f97bf30373fc23e0648d98",
"assets/packages/uicons_solid_straight/font/uicons_solid_straight.ttf": "4cfd54f5ee52863f78707b11893a21fa",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "e0cf41e3fdc47cda0808c08b2422a279",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "c7cd5976fca20b8d876824c0955a9623",
"icons/Icon-512.png": "ff5a9a6650e7d17c130683be6ebb7064",
"icons/Icon-maskable-192.png": "c7cd5976fca20b8d876824c0955a9623",
"icons/Icon-maskable-512.png": "ff5a9a6650e7d17c130683be6ebb7064",
"index.html": "36e6e8cbd6ac07633cd483d3369d1aa0",
"/": "36e6e8cbd6ac07633cd483d3369d1aa0",
"main.dart.js": "d12d0f8f6061eba8a8d6c2f4e60d8740",
"manifest.json": "6313264d0f44d0ab3e5e755b4f55fddb",
"version.json": "8e7bd9742e1f54b1ca5c443ab0e74c96"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
