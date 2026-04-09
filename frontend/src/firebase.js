import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Web App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaNqikRpUCESir-6W0UUFcpHmMNfy13EY",
  authDomain: "kridhani-jewels.firebaseapp.com",
  projectId: "kridhani-jewels",
  storageBucket: "kridhani-jewels.firebasestorage.app",
  messagingSenderId: "279864892909",
  appId: "1:279864892909:web:908a81238a8569ec3dbe4f"
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('❌ Firebase configuration is incomplete');
}

// Initialize Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App initialized successfully');
  console.log('📋 Project:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Verify services are ready
console.log('✅ Firebase Auth ready');
console.log('✅ Firestore ready');
console.log('✅ Storage ready');
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);

export default app;
