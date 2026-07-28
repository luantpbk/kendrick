// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyAI_O_9Ffe0Km_SXlhdxQuXGNHcH-XOP3g',
  authDomain: 'jvsconnection.firebaseapp.com',
  projectId: 'jvsconnection',
  storageBucket: 'jvsconnection.appspot.com',
  messagingSenderId: '413172745752',
  appId: '1:413172745752:web:4cdad8445b073576e2e56d',
  measurementId: 'G-L9YHP76243',
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  var strNotification = payload?.notification?.body.replace(/<[^>]+>/g, '');
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: strNotification,
    icon: './fcm.png',
  };

  self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
        })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client) return client.focus();
          }
          if (clients.openWindow) return clients.openWindow('https://admin.jvscorp.jp');
        }),
    );
  });
  self.registration.showNotification(notificationTitle, notificationOptions);
});
