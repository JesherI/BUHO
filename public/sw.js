const CACHE = "buho-cache-v2";
const CORE_ASSETS = [
  new Request("/", { credentials: "omit" }),
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE_ASSETS))
      .catch(() => Promise.resolve())
  );
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
self.addEventListener("message", (e) => {
  if (e && e.data === "PURGE_CACHE") {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => caches.open(CACHE));
  }
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const sameOrigin = u.origin === self.location.origin;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).catch(() => caches.match("/")));
    return;
  }
  if (!sameOrigin) return;
  const d = r.destination;
  const allow = d === "script" || d === "style" || d === "image" || d === "font";
  if (!allow) return;
  e.respondWith(
    caches.match(r).then((cached) => {
      const fp = fetch(r, { cache: "no-store" })
        .then((res) => {
          const ct = res.headers.get("Content-Type") || "";
          const cc = res.headers.get("Cache-Control") || "";
          if (
            res.ok &&
            res.type === "basic" &&
            !/text\/html/i.test(ct) &&
            !/application\/json/i.test(ct) &&
            !/no-store|private/i.test(cc)
          ) {
            const cp = res.clone();
            caches.open(CACHE).then((c) => c.put(r, cp));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fp;
    })
  );
});
