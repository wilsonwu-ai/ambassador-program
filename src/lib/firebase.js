import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration
// Uses environment variables if available, otherwise falls back to defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDExample_Replace_With_Your_Key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "snappy-ambassador.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "snappy-ambassador",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "snappy-ambassador.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abc123def456ghi789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for data reliability
// This ensures data is stored locally and synced when online
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn("Firebase persistence failed: Multiple tabs open");
  } else if (err.code === "unimplemented") {
    // The current browser doesn't support persistence
    console.warn("Firebase persistence not supported in this browser");
  }
});

export { db };
export default app;
