/* OpenGraph Lite v2.0.0-rc.45: service-worker cleanup only. Do not cache viewer assets in local/dev builds. */
const OPENGRAPH_SW_VERSION = 'v2.0.0-rc.45-functional-picker-runtime-20260829.69-cleanup';
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    } catch (e) {}
    try {
      await self.registration.unregister();
    } catch (e) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        const url = new URL(client.url);
        url.searchParams.set('ogv', 'v2.0.0-rc.45');
        url.searchParams.set('source', 'v2.0.0-rc.45-functional-picker-runtime-20260829.69');
        url.searchParams.set('swreset', Date.now().toString());
        client.navigate(url.toString());
      }
    } catch (e) {}
  })());
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
});
