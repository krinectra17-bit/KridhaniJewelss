import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Web App Configuration (CORRECTED)
const firebaseConfig = {
  apiKey: "AIzaSyDaMqikRpUCE3ir-6XM0UFcpHmMMFyi3EY",
  authDomain: "kridhani-jewels.firebaseapp.com",
  projectId: "kridhani-jewels",
  storageBucket: "kridhani-jewels.appspot.com",
  messagingSenderId: "279864892909",
  appId: "1:279864892909:web:908a81238a8569eec3dbe4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
