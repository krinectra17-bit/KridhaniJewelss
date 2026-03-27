import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Shield, CreditCard, Truck, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal()
      };

      const { data } = await axios.post(`${BACKEND_URL}/api/orders`, orderData);
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
    const whatsappMessage = formData.paymentMethod === 'UPI'
      ? `Hi, I've placed order ${orderSuccess.orderId}. Payment done via UPI. Total: ₹${getCartTotal()}`
      : `Hi, I've placed order ${orderSuccess.orderId}. Will pay cash on delivery.`;
    const whatsappUrl = `https://wa.me/916378581829?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-[#FFF9FA] py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl text-center">
              <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                Order Placed Successfully!
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Thank you for your order. We will contact you shortly.
              </p>

              {formData.paymentMethod === 'UPI' && (
                <div className="bg-[#FFF9FA] p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    UPI Payment Instructions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        UPI ID: kridhani@upi
                      </p>
                      <button className="text-[#E8A0A8] hover:text-[#D8909C]">
                        <Copy size={20} />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Amount: ₹{getCartTotal()}
                    </p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      After payment, share screenshot on WhatsApp: +91 6378581829
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-full"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      Share on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                data-testid="back-to-home"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-xl border border-[#F5E6E8]">
                <h3 className="text-2xl font-semibold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delivery Details
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                      data-testid="customer-name"
                    />
                    {errors.customerName && <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                      data-testid="customer-phone"
                    />
                    {errors.customerPhone && <p className="text-sm text-red-600 mt-1">{errors.customerPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      Delivery Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter complete delivery address"
                      className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                      data-testid="delivery-address"
                    />
                    {errors.deliveryAddress && <p className="text-sm text-red-600 mt-1">{errors.deliveryAddress}</p>}
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Payment Method
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-4 border-2 border-[#F5E6E8] rounded-lg cursor-pointer hover:border-[#E8A0A8]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={formData.paymentMethod === 'COD'}
                          onChange={handleChange}
                          className="mt-1 accent-[#E8A0A8]"
                          data-testid="payment-cod"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                            Pay when you receive
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 border-2 border-[#F5E6E8] rounded-lg cursor-pointer hover:border-[#E8A0A8]">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="UPI"
                          checked={formData.paymentMethod === 'UPI'}
                          onChange={handleChange}
                          className="mt-1 accent-[#E8A0A8]"
                          data-testid="payment-upi"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                            UPI Payment
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                            Pay via UPI and share screenshot
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg disabled:opacity-50"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    data-testid="place-order"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary & Trust Badges */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm">
                <h3 className="text-xl font-semibold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Order Summary
                </h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm md:text-base" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{getCartTotal()}</span>
                  </div>
                </div>
                <div className="border-t border-[#F5E6E8] pt-4">
                  <div className="flex justify-between text-base md:text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    <span>Total</span>
                    <span className="text-[#E8A0A8]">₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-[#FDF2F8] p-6 rounded-2xl border border-[#F5E6E8]">
                <h4 className="text-lg font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Why Shop With Us
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Shield size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Secure Payment
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Your data is protected
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        COD Available
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Pay when you receive
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Truck size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Fast Shipping
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        Delivered in 3-5 days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5E6E8]">
                  <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    We Accept:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['UPI', 'Razorpay', '💳 Cards', 'Cash'].map((method, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-[#F5E6E8] rounded-lg text-xs font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
