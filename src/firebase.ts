// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDD9BDUIB3ADk-6IEblRc8AzQ7wH_ge65E",
  authDomain: "e-commerce-3ae59.firebaseapp.com",
  projectId: "e-commerce-3ae59",
  storageBucket: "e-commerce-3ae59.firebasestorage.app",
  messagingSenderId: "360418149407",
  appId: "1:360418149407:web:2d717bcc736e4e2f8d812a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
