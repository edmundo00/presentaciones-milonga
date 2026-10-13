// Guarda lo que se abre para que funcione sin internet: con red, lo último (y se guarda); sin red, lo guardado
const CACHE = "milongas-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const r = await fetch(e.request);
      if (r.ok) cache.put(e.request, r.clone());
      return r;
    } catch (err) {
      const guardado = await cache.match(e.request, {ignoreSearch: true});
      if (guardado) return guardado;
      throw err;
    }
  })());
});
