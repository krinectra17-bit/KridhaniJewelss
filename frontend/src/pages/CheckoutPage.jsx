import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderSuccess from '../components/checkout/OrderSuccess';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    paymentMethod: 'COD'
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedTotal, setSavedTotal] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid phone number';
    }
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const total = getCartTotal();
      setSavedTotal(total);
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total
      };

      const data = await createOrder(orderData);
      setOrderSuccess(data);
      clearCart();
    } catch (error) {
      console.error('Order failed', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return <OrderSuccess orderData={orderSuccess} formData={formData} cartTotal={savedTotal} />;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-8 md:mb-12" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CheckoutForm
              formData={formData}
              errors={errors}
              submitting={submitting}
              onFieldChange={handleChange}
              onSubmit={handleSubmit}
            />
            <OrderSummary cartTotal={getCartTotal()} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
