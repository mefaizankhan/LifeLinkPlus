import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const VAPID_KEY =
    "BD1dC1VWg3oB3gEP8-DaTfBBNK6sN69glTJYbdO18NCfwIozOzbKdzgaBsI46OeSt0irmfR3gqmCD2wPDNHac1Q";

// Request notification permission + generate token
export const requestNotificationPermission = async () => {
    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.warn("❌ Notification permission denied");
            return null;
        }

        console.log("✅ Notification permission granted");

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
        });

        if (token) {

            return token;

        } else {

            console.warn("⚠️ No FCM token generated");
            return null;

        }

    } catch (error) {

        console.error(
            "❌ Error getting notification permission:",
            error
        );

        return null;
    }
};

// Foreground notification listener
export const onMessageListener = () =>
    new Promise((resolve) => {

        onMessage(messaging, (payload) => {

            console.log(
                "📩 Foreground Notification:",
                payload
            );

            resolve(payload);

        });

    });