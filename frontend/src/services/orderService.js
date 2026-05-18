import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Get all orders (admin)
export const getOrders = async () => {
  const { data } = await axios.get(`${API}/api/orders`, { withCredentials: true });
  return data.map((order, idx) => ({ ...order, id: order.orderId || `order-${idx}` }));
};

// Create Razorpay order on backend
export const createRazorpayOrder = async (orderData) => {
  const { data } = await axios.post(`${API}/api/payment/create-order`, {
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
  const { data } = await axios.post(`${API}/api/payment/verify`, paymentData);
  return data;
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, status) => {
  const { data } = await axios.patch(`${API}/api/orders/${orderId}/status`, { status }, { withCredentials: true });
  return data;
};

// Get dashboard stats (admin)
export const getDashboardStats = async () => {
  const { data } = await axios.get(`${API}/api/dashboard/stats`, { withCredentials: true });
  return data;
};
