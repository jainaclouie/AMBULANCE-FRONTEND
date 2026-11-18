/* Service worker: shows phone notifications (Web Push) even when the app is closed. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Cordova Dispatch', body: event.data ? event.data.text() : '' };
  }
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-192.png',
    tag: data.tag || 'dispatch',
    data: data.data || {},
    requireInteraction: !!data.requireInteraction,
    renotify: !!data.renotify,
    vibrate: data.vibrate || [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Cordova Dispatch', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/crew';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
