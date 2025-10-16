import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);

export const getFirebaseAuth = async () => {
  if (typeof window === "undefined") return null;
  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
};

export async function initAnalytics() {
  if (typeof window !== "undefined") {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) return getAnalytics(app);
  }
  return null;
}

export default app;
