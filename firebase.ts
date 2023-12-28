import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_BASE_API_KEY,
  authDomain: "photo-boot-6881b.firebaseapp.com",
  projectId: "photo-boot-6881b",
  storageBucket: "photo-boot-6881b.appspot.com",
  messagingSenderId: "21082021934",
  appId: process.env.NEXT_PUBLIC_FIRE_BASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
