/* JNEET+ AI service worker — makes the app shell open with no/poor network.
   - Navigations: network first (3.5s budget on slow networks), fall back to the
     cached app shell, so /notes etc. open offline.
   - Hashed build assets (/assets/*), icons, fonts: cache first.
   - /api and any cross-origin request are never touched or cached. */
const VERSION = "v1";
const SHELL = `jneet-shell-${VERSION}`;
const ASSETS = `jneet-assets-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.add(new Request("/", { cache: "reload" }))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const withTimeout = (p, ms) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error("timeout")), ms);
  p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;

  if (req.mode === "navigate") {
    // Static legal pages are real files, everything else is the SPA shell.
    event.respondWith((async () => {
      const cache = await caches.open(SHELL);
      try {
        const res = await withTimeout(fetch(req), 3500);
        if (res.ok && res.headers.get("content-type")?.includes("text/html")) cache.put(url.pathname.match(/\.html$/) ? req : "/", res.clone());
        return res;
      } catch {
        return (await cache.match(url.pathname.match(/\.html$/) ? req : "/")) || (await cache.match("/")) || Response.error();
      }
    })());
    return;
  }

  if (url.pathname.startsWith("/assets/") || /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(ASSETS);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    })());
  }
});
