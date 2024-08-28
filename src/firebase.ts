import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlk52Ot_m9e-WTxFAjylg6R5yjGSe9qos",
  authDomain: "commerce-58f10.firebaseapp.com",
  projectId: "commerce-58f10",
  storageBucket: "commerce-58f10.appspot.com",
  messagingSenderId: "892359909689",
  appId: "1:892359909689:web:699dddffd78a43874588e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
