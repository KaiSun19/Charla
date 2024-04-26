import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_SECRET_KEY,
  authDomain: "charla-409115.firebaseapp.com",
  projectId: "charla-409115",
  storageBucket: "charla-409115.appspot.com",
  messagingSenderId: "192786478356",
  appId: "1:192786478356:web:2451edfa7ec1a07720fe01",
  measurementId: "G-2L9TXJDK6Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
