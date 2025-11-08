self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	// This looks to see if the current window is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === "/" && "focus" in client)
						return client.focus();
				}
				if (clients.openWindow) return clients.openWindow("/");
			})
	);
});

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  return self.clients.claim();
});

// Cache opcional:
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Push Notification:
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const title = data.title || "Notificação";
  const options = {
    body: data.body || "Você tem uma nova mensagem",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
