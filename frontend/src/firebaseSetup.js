import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// This script helps create the initial admin user
export const createAdminUser = async (email, password) => {
  try {
    console.log('🔧 Creating admin user:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Admin user created successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.code, error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ User already exists');
    }
    throw error;
  }
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    console.log('Auth instance:', auth ? '✅ Connected' : '❌ Not connected');
    console.log('Current user:', auth.currentUser ? auth.currentUser.email : 'No user logged in');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

// Run this in browser console to create admin user:
// import { createAdminUser } from './firebaseSetup';
// createAdminUser('admin@kridhani.com', 'admin123');
