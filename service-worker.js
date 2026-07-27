// ── Service Worker — SoneSoneMommy POS v2 (PWA offline support) ──────────────
// ဒီ file ကို update ထုတ်တိုင်း အောက်က CACHE_NAME ကို v1 → v2 → v3 ... လို့ ပြောင်းပါ
// (မပြောင်းရင် user တွေရဲ့ browser က ဟောင်းတဲ့ cache version ကို ဆက်သုံးနေမှာမို့
//  ပြင်ထားတဲ့ ပြောင်းလဲမှုတွေ မမြင်ရနိုင်ပါ)
const CACHE_NAME = "ssm-pos-v2-r1";

// App shell — offline ဖြစ်ရင်တောင် ချက်ချင်း ပြန်ဖွင့်လို့ရအောင် အရင်ဆုံး cache ချထားမယ့် file တွေ
const PRECACHE_URLS = [
  "./",
  "index.html",
  "login.html",
  "firebase-init.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.all(
          PRECACHE_URLS.map(function (url) {
            return cache.add(url).catch(function () {});
          })
        );
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
          return res;
        })
        .catch(function () { return caches.match(req).then(function (r) { return r || caches.match("index.html"); }); })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      var fetchPromise = fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
