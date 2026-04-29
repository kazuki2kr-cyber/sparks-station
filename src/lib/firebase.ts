import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7sZXiswvkItn1XUoUKeo9uTtsFBKrPnA",
  authDomain: "hayaoshi-aef9c.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://hayaoshi-aef9c-default-rtdb.firebaseio.com",
  projectId: "hayaoshi-aef9c",
  storageBucket: "hayaoshi-aef9c.firebasestorage.app",
  messagingSenderId: "425920833176",
  appId: "1:425920833176:web:c4ea28d55ec4629c2892ed",
  measurementId: "G-855K48N60H"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, realtimeDb, storage };
