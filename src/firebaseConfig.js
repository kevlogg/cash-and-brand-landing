import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Production configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAmtjr1hsdLEOdoigmWfQym5DjXa-RQio",
  authDomain: "brianrecke.firebaseapp.com",
  projectId: "brianrecke",
  storageBucket: "brianrecke.firebasestorage.app",
  messagingSenderId: "217664900228",
  appId: "1:217664900228:web:3f974477b1e44368a506d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
