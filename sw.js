// OpenGraph Lite Viewer v4408
// Service worker intentionally disabled for the local editor workflow.
// The viewer unregisters old service workers on load. This file remains only
// so stale registrations can update once and stop caching older config files.
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});
