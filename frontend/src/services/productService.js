import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload image to Firebase Storage
export const uploadProductImage = async (file) => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Add new product
export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// Get all products
export const getProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    // Fallback if index not created yet
    if (error.code === 'failed-precondition') {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      return docs;
    }
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, productData);
};

// Delete product
export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
};
