import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import SizeManager from '../components/admin/SizeManager';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/productService';
import { toast } from 'sonner';

const DEFAULT_SIZES = ['0', '0.5', '0.75', '1', '2', '3', '4', '5'];

const FirebaseAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', image: '', description: '', stock: 100, sizes: []
  });
  

  const categories = ['Yugal Jodi Shringar', 'Bal Radha Rani Shringar', 'Laddu Gopal Shringar', 'Jewelry', 'Traditional'];

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadProductImage(file);
      setFormData({ ...formData, image: imageUrl });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sizes: formData.sizes.map(s => ({ size: s.size, price: parseFloat(s.price) }))
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated');
      } else {
        await addProduct(productData);
        toast.success('Product added');
      }
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
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
      stock: product.stock || 100,
      sizes: product.sizes || []
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', image: '', description: '', stock: 100, sizes: [] });
    setEditingProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg hover:shadow-lg transition-all" data-testid="add-product-btn">
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <p className="text-xl font-bold text-[#E8A0A8] mb-1">₹{product.price}</p>
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-xs text-gray-500 mb-3">{product.sizes.length} size{product.sizes.length > 1 ? 's' : ''} available</p>
                )}
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-[#E8A0A8] text-[#E8A0A8] rounded-lg hover:bg-[#E8A0A8] hover:text-white transition-colors" data-testid={`edit-product-${product.id}`}>
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors" data-testid={`delete-product-${product.id}`}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]" required data-testid="product-name-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]" required data-testid="product-category-select">
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Base Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]" required min="0" step="0.01" data-testid="product-price-input" />
                </div>

                {/* SIZE MANAGEMENT */}
                <SizeManager
                  sizes={formData.sizes}
                  basePrice={formData.price}
                  onSizesChange={(newSizes) => setFormData({ ...formData, sizes: newSizes })}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Product Image</label>
                  <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                      <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    {formData.image && <img src={formData.image} alt="Preview" className="h-10 w-10 object-cover rounded" />}
                  </div>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8] mt-2" placeholder="Or paste image URL" required data-testid="product-image-url-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]" rows={3} required data-testid="product-description-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]" required min="0" data-testid="product-stock-input" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" data-testid="cancel-product-btn">Cancel</button>
                  <button type="submit" disabled={uploading} className="flex-1 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg disabled:opacity-50" data-testid="submit-product-btn">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FirebaseAdminProducts;
