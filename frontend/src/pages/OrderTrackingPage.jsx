import React, { useState } from 'react';
import { Search, Package, CheckCircle, Truck, MapPin, Clock, AlertCircle, Mail } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_BACKEND_URL;

const ALL_STATUSES = [
  { key: 'Order Placed', icon: Package, label: 'Order Placed' },
  { key: 'Confirmed', icon: CheckCircle, label: 'Confirmed' },
  { key: 'Processing', icon: Clock, label: 'Processing' },
  { key: 'Packed', icon: Package, label: 'Packed' },
  { key: 'Shipped', icon: Truck, label: 'Shipped' },
  { key: 'Out for Delivery', icon: MapPin, label: 'Out for Delivery' },
  { key: 'Delivered', icon: CheckCircle, label: 'Delivered' },
];

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('Please enter both Order ID and phone number');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data } = await axios.post(`${API}/api/orders/track`, { orderId: orderId.trim(), phone: phone.trim() });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Order not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => ALL_STATUSES.findIndex(s => s.key === status);
  const isCancelled = order?.status === 'Cancelled';

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Track Your Order
            </h1>
            <p className="text-base text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Enter your Order ID and phone number to track
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-[#F5E6E8] p-6 md:p-8 mb-8 shadow-sm" data-testid="track-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Order ID</label>
                <input
                  type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. KJ20260518192500"
                  className="w-full px-4 py-3 border border-[#F5E6E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="track-order-id"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Phone Number</label>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-[#F5E6E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="track-phone"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all" data-testid="track-submit-btn">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Searching...
                </span>
              ) : (
                <><Search size={18} /> Track Order</>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3" data-testid="track-error">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{error}</p>
            </div>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-6" data-testid="order-details">
              {/* Order info card */}
              <div className="bg-white rounded-2xl border border-[#F5E6E8] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>Order Details</h2>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`} data-testid="order-status-badge">
                    {order.status || 'Order Placed'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Detail label="Order ID" value={order.orderId} testId="detail-order-id" />
                  <Detail label="Customer" value={order.customerName} testId="detail-customer-name" />
                  <Detail label="Phone" value={order.customerPhone} testId="detail-phone" />
                  <Detail label="Total Amount" value={`₹${order.totalAmount}`} testId="detail-total" />
                  <Detail label="Payment" value={order.paymentMethod || 'Razorpay'} />
                  <Detail label="Order Date" value={order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl border border-[#F5E6E8] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Items Ordered</h3>
                <div className="divide-y divide-gray-100">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{item.productName}</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                          Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              {!isCancelled ? (
                <div className="bg-white rounded-2xl border border-[#F5E6E8] p-6 shadow-sm" data-testid="status-timeline">
                  <h3 className="text-lg font-bold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Order Progress</h3>
                  <div className="relative">
                    {ALL_STATUSES.map((step, idx) => {
                      const currentIdx = getStatusIndex(order.status || 'Order Placed');
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      const StepIcon = step.icon;
                      return (
                        <div key={step.key} className="flex items-start gap-4 relative" data-testid={`timeline-step-${step.key.replace(/\s/g, '-').toLowerCase()}`}>
                          {/* Connector line */}
                          {idx < ALL_STATUSES.length - 1 && (
                            <div className={`absolute left-5 top-10 w-0.5 h-8 ${idx < currentIdx ? 'bg-[#E8A0A8]' : 'bg-gray-200'}`} />
                          )}
                          {/* Circle */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCurrent ? 'bg-[#E8A0A8] text-white ring-4 ring-[#E8A0A8]/20' :
                            isCompleted ? 'bg-[#E8A0A8] text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <StepIcon size={18} />
                          </div>
                          {/* Label */}
                          <div className="pb-8">
                            <p className={`text-sm font-semibold ${isCompleted ? 'text-[#2C1810]' : 'text-gray-400'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-[#E8A0A8] font-medium mt-0.5">Current status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
                  <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-red-800 mb-1">Order Cancelled</h3>
                  <p className="text-sm text-red-600">This order has been cancelled. Contact support for more info.</p>
                </div>
              )}

              {/* Support */}
              <div className="bg-[#FDF2F8] rounded-2xl border border-[#F5E6E8] p-6 text-center" data-testid="tracking-support">
                <Mail size={24} className="text-[#E8A0A8] mx-auto mb-2" />
                <p className="text-sm text-gray-700 mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Need help with your order?</p>
                <a href="mailto:Kridhanijewels@gmail.com" className="text-sm font-semibold text-[#E8A0A8] hover:underline" data-testid="support-email-link">
                  Kridhanijewels@gmail.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Detail = ({ label, value, testId }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{label}</p>
    <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid={testId}>{value}</p>
  </div>
);

export default OrderTrackingPage;
