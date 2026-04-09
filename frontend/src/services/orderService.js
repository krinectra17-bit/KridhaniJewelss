import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc,
  updateDoc, 
  doc,
  query,
  orderBy 
} from 'firebase/firestore';

// Get all orders
export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      return docs;
    }
    throw error;
  }
};

// Create a new order (from checkout)
export const createOrder = async (orderData) => {
  const now = new Date();
  const orderId = `KJ${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
  
  const order = {
    ...orderData,
    orderId,
    status: 'pending',
    createdAt: now.toISOString()
  };
  
  await addDoc(collection(db, 'orders'), order);
  return { orderId, message: 'Order placed successfully' };
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status,
    updatedAt: new Date().toISOString()
  });
};

// Get dashboard stats
export const getDashboardStats = async () => {
  const orders = await getOrders();
  const products = await getProductCount();
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending' || !order.status).length;
  
  return {
    totalOrders,
    totalRevenue,
    totalProducts: products,
    pendingOrders,
    recentOrders: orders.slice(0, 5)
  };
};

// Helper to get product count for dashboard
const getProductCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.size;
  } catch {
    return 0;
  }
};
