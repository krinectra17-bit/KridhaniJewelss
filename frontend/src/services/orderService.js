import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy 
} from 'firebase/firestore';

// Get all orders
export const getOrders = async () => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    recentOrders: orders.slice(0, 5)
  };
};
