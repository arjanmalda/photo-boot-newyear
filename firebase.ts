import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBLN6EIpDGe0l0cDzMZEZ7mw2FdytyFW7o",
  authDomain: "photo-boot-6881b.firebaseapp.com",
  projectId: "photo-boot-6881b",
  storageBucket: "photo-boot-6881b.appspot.com",
  messagingSenderId: "21082021934",
  appId: "1:21082021934:web:62acdc365a7c6c5b7ebfbf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
