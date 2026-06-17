import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItemRow from '../components/CartItemRow';
import { getWhatsAppCartCheckoutUrl } from '../utils/whatsapp';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className="fill-current">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.862-2.48-1.862-4.73s1.178-3.356 1.596-3.814c.418-.458.912-.572 1.216-.572.304 0 .608.002.874.016.28.014.656-.106.026 1.574-.286.742-1.596 3.888-1.738 4.168-.142.28-.236.608-.046.968.19.36.284.58.568.896.284.316.596.706.85.948.284.27.578.564.99.976.412.412.412.686.612 1.144.2.458.1.858-.05 1.2-.15.342-1.346 3.24-1.346 3.24s-.092.352.144.538c.236.186.786.516 1.332.886.546.37 1.116.722 1.346.836.458.228.786.19 1.074-.116.288-.306 1.232-1.436 1.56-1.928.328-.492.656-.41 1.1-.244.45.166 2.842 1.342 3.33 1.586.486.244.81.366.928.572.12.206.12 1.192-.27 2.292z" />
  </svg>
);

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [info, setInfo] = useState({ name: '', phone: '', address: '', landmark: '', pinCode: '' });

  const handleChange = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

  const handleWhatsAppCheckout = () => {
    const { name, phone, address, landmark, pinCode } = info;
    if (!name.trim() || !phone.trim() || !address.trim() || !landmark.trim() || !pinCode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{6}$/.test(pinCode.trim())) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    const url = getWhatsAppCartCheckoutUrl(cart, {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      pinCode: pinCode.trim(),
    }, getCartTotal());
    window.open(url, '_blank', 'noopener,noreferrer');
    clearCart();
    toast.success('Order sent! Check WhatsApp.');
  };

  if (cart.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E8A0A8]/10 flex items-center justify-center">
              <ShoppingBag size={40} className="text-[#E8A0A8]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your cart is empty
            </h2>
            <p className="text-base text-gray-600 mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Add some divine items to your cart
            </p>
            <Link to="/" className="inline-block px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="continue-shopping-empty">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const font = { fontFamily: "'Nunito Sans', sans-serif" };
  const inputCls = "w-full px-4 py-3 border border-[#F5E6E8] rounded-xl text-sm text-[#2C1810] bg-white focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]/50 focus:border-[#E8A0A8]";

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-8 md:mb-12" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItemRow key={item.cartKey} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
              ))}
              <Link to="/" className="inline-block mt-4 text-sm text-[#5D4037] hover:text-[#E8A0A8] transition-colors" style={font} data-testid="continue-shopping">
                &larr; Continue Shopping
              </Link>
            </div>

            {/* Sidebar: Customer Info + Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Customer Details */}
              <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm" data-testid="customer-info-form">
                <h3 className="text-lg font-semibold text-[#2C1810] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delivery Details
                </h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name *" value={info.name} onChange={e => handleChange('name', e.target.value)} className={inputCls} style={font} data-testid="checkout-name" />
                  <input type="tel" placeholder="Phone Number *" value={info.phone} onChange={e => handleChange('phone', e.target.value)} className={inputCls} style={font} maxLength={10} data-testid="checkout-phone" />
                  <textarea placeholder="Full Address *" value={info.address} onChange={e => handleChange('address', e.target.value)} rows={2} className={inputCls + " resize-none"} style={font} data-testid="checkout-address" />
                  <input type="text" placeholder="Landmark *" value={info.landmark} onChange={e => handleChange('landmark', e.target.value)} className={inputCls} style={font} data-testid="checkout-landmark" />
                  <input type="text" placeholder="PIN Code *" value={info.pinCode} onChange={e => handleChange('pinCode', e.target.value)} className={inputCls} style={font} maxLength={6} data-testid="checkout-pincode" />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm sticky top-24" data-testid="order-summary">
                <h3 className="text-lg font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Order Summary
                </h3>
                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.cartKey} className="flex justify-between text-sm" style={font}>
                      <span className="text-[#5D4037] truncate mr-2">{item.name}{item.selectedSize ? ` (${item.selectedSize})` : ''} x{item.quantity}</span>
                      <span className="font-semibold text-[#2C1810] flex-shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F5E6E8] pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold" style={font}>
                    <span>Grand Total</span>
                    <span className="text-[#E8A0A8]" data-testid="grand-total">₹{getCartTotal()}</span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white text-base font-bold rounded-full shadow-lg hover:bg-[#1EBE5A] hover:shadow-xl transition-all duration-200"
                  style={font}
                  data-testid="place-order-whatsapp-btn"
                >
                  <WhatsAppIcon size={22} />
                  Place Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
