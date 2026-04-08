import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaNqikRpUCESir-6W0UUFcpHmMNfy13EY",
  authDomain: "kridhani-jewels.firebaseapp.com",
  projectId: "kridhani-jewels",
  storageBucket: "kridhani-jewels.firebasestorage.app",
  messagingSenderId: "279864892909",
  appId: "1:279864892909:web:908a81238a8569ec3dbe4f"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Log service initialization
console.log('✅ Firebase Auth initialized');
console.log('✅ Firestore initialized');
console.log('✅ Storage initialized');

export default app;
