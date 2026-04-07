import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
//

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
 // Firebase import
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDaMqikRpUCE3ir-6XM0UFcpHmMMFyi3EY",
  authDomain: "kridhani-jewels.firebaseapp.com",
  projectId: "kridhani-jewels",
  storageBucket: "kridhani-jewels.firebasestorage.app",
  messagingSenderId: "279864892909",
  appId: "1:279864892909:web:908a81238a8569eec3dbe4"
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);