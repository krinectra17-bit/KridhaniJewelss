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
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Get all orders (admin)
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

// Create Razorpay order on backend
export const createRazorpayOrder = async (orderData) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
    amount: orderData.totalAmount,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    deliveryAddress: orderData.deliveryAddress,
    items: orderData.items
  });
  return data;
};

// Verify payment & save order
export const verifyPaymentAndCreateOrder = async (paymentData) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/payment/verify`, paymentData);
  
  // Also save to Firestore for admin panel
  const now = new Date();
  await addDoc(collection(db, 'orders'), {
    orderId: data.orderId,
    customerName: paymentData.customerName,
    customerPhone: paymentData.customerPhone,
    deliveryAddress: paymentData.deliveryAddress,
    paymentMethod: 'Razorpay',
    items: paymentData.items,
    totalAmount: paymentData.totalAmount,
    razorpayOrderId: paymentData.razorpay_order_id,
    razorpayPaymentId: paymentData.razorpay_payment_id,
    paymentStatus: 'paid',
    status: 'confirmed',
    createdAt: now.toISOString()
  });
  
  return data;
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, status) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status,
    updatedAt: new Date().toISOString()
  });
};

// Get dashboard stats (admin)
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

// Helper to get product count
const getProductCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.size;
  } catch {
    return 0;
  }
};
