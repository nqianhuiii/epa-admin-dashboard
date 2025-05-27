// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm-O2KYkkChyWzRvIZpr2T2jACJyAC1S0",
  authDomain: "epa-fyp-5ffeb.firebaseapp.com",
  projectId: "epa-fyp-5ffeb",
  storageBucket: "epa-fyp-5ffeb.firebasestorage.app",
  messagingSenderId: "444616892950",
  appId: "1:444616892950:web:27eb09e3fa3504d7cb0b37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };