self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("push", (e) => {
  const res = e.data.text() || "NO PAYLOAD";
  const res_obj = JSON.parse(res);
  const options = {
    body: res_obj.body,
    icon: res_obj.icon,
    badge: res_obj.badge,
    image: res_obj.image,
    vibrate: res_obj.vibrate,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: res_obj.url,
    },
  };
  e.waitUntil(self.registration.showNotification(res_obj.title, options));
});

self.addEventListener("notificationclick", function (event) {
  const url = event.notification.data.url;
  if (url) {
    event.notification.close();
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === url && "focus" in client) return client.focus();
          }
          if (clients.openWindow) return clients.openWindow(url);
        })
    );
  }
});
