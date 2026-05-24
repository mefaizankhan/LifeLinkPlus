import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// Note: firebase/analytics is imported dynamically below to prevent adblockers from crashing the app

const firebaseConfig = {
  apiKey: "AIzaSyCkufJTUswOaFlx24LuywY7WiNmqIspiPM",
  authDomain: "lifelinkplus-10fe6.firebaseapp.com",
  projectId: "lifelinkplus-10fe6",
  storageBucket: "lifelinkplus-10fe6.firebasestorage.app",
  messagingSenderId: "56647609563",
  appId: "1:56647609563:web:87fa794d26850e514a30fe",
  measurementId: "G-DJF6SX8402"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (dynamically loaded to prevent ad-blockers from blocking the main bundle)
let analytics = null;
import("firebase/analytics")
  .then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("✅ Firebase Analytics initialized.");
      } else {
        console.log("⚠️ Firebase Analytics is not supported in this environment.");
      }
    });
  })
  .catch((err) => {
    console.warn("⚠️ Firebase Analytics failed to load (likely blocked by an adblocker):", err);
  });

// Firebase Cloud Messaging
export const messaging = getMessaging(app);

export { app, analytics };