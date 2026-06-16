import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Get all products (public)
export const getProducts = async () => {
  const { data } = await axios.get(`${API}/api/products`);
  return data;
};

// Get single product (public)
export const getProductById = async (productId) => {
  const { data } = await axios.get(`${API}/api/products/${productId}`);
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

// Upload image to backend - returns permanent URL
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post(`${API}/api/upload/image`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.url;
};
