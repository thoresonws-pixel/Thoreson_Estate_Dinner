// Thoreson Estate Dinner — Service Worker
// Handles FCM background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyApHrYubqWrR4m0ihdpq6Ym40jv4HTQ5i0",
    authDomain: "thoreson-estate.firebaseapp.com",
    databaseURL: "https://thoreson-estate-default-rtdb.firebaseio.com",
    projectId: "thoreson-estate",
    storageBucket: "thoreson-estate.firebasestorage.app",
    messagingSenderId: "182924616892",
    appId: "1:182924616892:web:8153e1c69895cee665dcb9"
});

const messaging = firebase.messaging();

// Handle background FCM messages (app closed or backgrounded)
messaging.onBackgroundMessage(function(payload) {
    const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Thoreson Estate';
    const body  = (payload.notification && payload.notification.body)  || (payload.data && payload.data.body)  || 'New information available.';
    return self.registration.showNotification(title, {
        body: body,
        icon: '/Thors_Murder_Mysteries/icon-192.png',
        badge: '/Thors_Murder_Mysteries/icon-192.png',
        tag: 'thoreson-fcm',
        renotify: true
    });
});

// Tap notification -> focus app
self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].url.includes('Thors_Murder_Mysteries') && 'focus' in clients[i]) {
                    return clients[i].focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow('/Thors_Murder_Mysteries/authenticated-dashboard.html');
            }
        })
    );
});

// Foreground fallback via postMessage
self.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
        e.waitUntil(
            self.registration.showNotification(e.data.title, {
                body: e.data.body,
                icon: '/Thors_Murder_Mysteries/icon-192.png',
                tag: e.data.tag || 'thoreson-' + Date.now(),
                renotify: true
            })
        );
    }
});

self.addEventListener('install', function() {
    self.skipWaiting();
    caches.keys().then(function(keys) {
        return Promise.all(keys.map(function(key) { return caches.delete(key); }));
    }).catch(function() {});
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(keys) {
                return Promise.all(keys.map(function(key) { return caches.delete(key); }));
            })
        ])
    );
});
