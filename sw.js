/* OpenGraph Lite v3.1.0-rc.10: service-worker cleanup only. Do not cache viewer assets in local/dev builds. */
const OPENGRAPH_SW_VERSION = 'v3.1.0-rc.10-unified-multi-ogn-demo-route-20260831.9-cleanup';
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
        url.searchParams.set('ogv', 'v3.1.0-rc.10');
        url.searchParams.set('source', 'v3.1.0-rc.10-unified-multi-ogn-demo-route-20260831.9');
        url.searchParams.set('swreset', Date.now().toString());
        client.navigate(url.toString());
      }
    } catch (e) {}
  })());
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
});
