import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    isBestseller: false,
    isTrending: false,
    stock: 100
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await axios.put(
          `${BACKEND_URL}/api/products/${editingProduct.id}`,
          productData,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${BACKEND_URL}/api/products`, productData, { withCredentials: true });
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        isBestseller: false,
        isTrending: false,
        stock: 100
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      isBestseller: product.isBestseller || false,
      isTrending: product.isTrending || false,
      stock: product.stock || 100
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${productId}`, { withCredentials: true });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Failed to delete product');
    }
  };

  const categories = [
    'Laddu Gopal Shringar',
    'Dresses',
    'Radha Krishna Items',
    'Jewelry',
    'Traditional'
  ];

  return (
    <div className="min-h-screen bg-[#FFF9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                KRIDHANI JEWELS
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Admin Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-[#E8A0A8]"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="logout-btn"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package size={28} className="text-[#E8A0A8]" />
            <h2 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Products Management
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                category: '',
                price: '',
                image: '',
                description: '',
                isBestseller: false,
                isTrending: false,
                stock: 100
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            data-testid="add-product-btn"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              No products yet. Add your first product to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-[#F5E6E8] overflow-hidden" data-testid={`admin-product-${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {product.category}
                  </p>
                  <h3 className="text-lg font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-[#E8A0A8] mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    ₹{product.price}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {product.isBestseller && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Bestseller</span>
                    )}
                    {product.isTrending && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Trending</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-[#E8A0A8] text-[#E8A0A8] rounded-lg hover:bg-[#E8A0A8] hover:text-white transition-colors"
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  required
                  data-testid="product-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  required
                  data-testid="product-category-input"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  required
                  min="0"
                  step="0.01"
                  data-testid="product-price-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  placeholder="https://example.com/image.jpg"
                  required
                  data-testid="product-image-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  rows={3}
                  required
                  data-testid="product-description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  required
                  min="0"
                  data-testid="product-stock-input"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-[#E8A0A8]"
                    data-testid="product-bestseller-input"
                  />
                  <span className="text-sm">Bestseller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#E8A0A8]"
                    data-testid="product-trending-input"
                  />
                  <span className="text-sm">Trending</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  data-testid="cancel-product-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg"
                  data-testid="save-product-btn"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
