import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Get all products (public)
export const getProducts = async () => {
  const { data } = await axios.get(`${API}/api/products`);
  return data;
};

// Add new product (admin)
export const addProduct = async (productData) => {
  const { data } = await axios.post(`${API}/api/products`, productData, { withCredentials: true });
  return data;
};

// Update product (admin)
export const updateProduct = async (productId, productData) => {
  const { data } = await axios.put(`${API}/api/products/${productId}`, productData, { withCredentials: true });
  return data;
};

// Delete product (admin)
export const deleteProduct = async (productId) => {
  const { data } = await axios.delete(`${API}/api/products/${productId}`, { withCredentials: true });
  return data;
};

// Upload image - returns the URL directly (paste URL approach)
export const uploadProductImage = async (file) => {
  // For now, return object URL for preview. Admin can paste actual hosted URLs.
  return URL.createObjectURL(file);
};
