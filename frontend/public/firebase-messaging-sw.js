importScripts(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyCkufJTUswOaFlx24LuywY7WiNmqIspiPM",
    authDomain: "lifelinkplus-10fe6.firebaseapp.com",
    projectId: "lifelinkplus-10fe6",
    storageBucket: "lifelinkplus-10fe6.firebasestorage.app",
    messagingSenderId: "56647609563",
    appId: "1:56647609563:web:87fa794d26850e514a30fe",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    console.log(
        "[firebase-messaging-sw.js] Background message:",
        payload
    );

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/logo.png",
        }
    );

});