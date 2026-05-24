import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let firebaseInitialized = false;

export const initFirebase = () => {
    try {

        // Prevent multiple initialization
        if (admin.apps.length) {
            console.log("🔥 Firebase already initialized");
            firebaseInitialized = true;
            return;
        }

        // Firebase key path
        const serviceAccountPath =
            process.env.FIREBASE_SERVICE_ACCOUNT ||
            path.resolve("./serviceAccountKey.json");

        // Check if file exists
        if (!fs.existsSync(serviceAccountPath)) {

            console.warn(
                "⚠️ Firebase serviceAccountKey.json not found. Push notifications are disabled."
            );

            return;
        }

        // Read service account
        const serviceAccount = JSON.parse(
            fs.readFileSync(serviceAccountPath, "utf8")
        );

        // Initialize Firebase
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        firebaseInitialized = true;

        console.log("✅ Firebase Admin SDK initialized successfully.");

    } catch (error) {

        console.error(
            "❌ Firebase Initialization Error:",
            error.message
        );

    }
};

export const sendPushNotification = async (
    fcmToken,
    title,
    body,
    data = {}
) => {
    try {

        // Check initialization
        if (!firebaseInitialized || !admin.apps.length) {

            console.warn(
                "⚠️ Firebase is not initialized. Notification skipped."
            );

            return null;
        }

        // Validate token
        if (!fcmToken) {

            console.warn(
                "⚠️ Missing FCM token."
            );

            return null;
        }

        const message = {
            notification: {
                title,
                body,
            },

            data: Object.keys(data).reduce((acc, key) => {
                acc[key] = String(data[key]);
                return acc;
            }, {}),

            token: fcmToken,
        };

        const response = await admin.messaging().send(message);

        console.log(
            "✅ Successfully sent push notification:",
            response
        );

        return response;

    } catch (error) {

        console.error(
            "❌ Error sending push notification:",
            error.message
        );

        return null;
    }
};

export default admin;