import React from 'react';
import { Shield, CreditCard, Truck } from 'lucide-react';

const OrderSummary = ({ cart, cartTotal }) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Cart items */}
      <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm" data-testid="order-summary">
        <h3 className="text-xl font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Order Summary
        </h3>
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="%23f3f4f6" width="48" height="48"/></svg>'; }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2C1810] truncate" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{item.name}</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-[#2C1810] flex-shrink-0" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#F5E6E8] pt-4">
          <div className="flex justify-between text-base md:text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            <span>Total</span>
            <span className="text-[#E8A0A8]" data-testid="order-total">₹{cartTotal}</span>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-[#FDF2F8] p-6 rounded-2xl border border-[#F5E6E8]">
        <h4 className="text-lg font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Why Shop With Us
        </h4>
        <div className="space-y-4">
          <TrustBadge icon={Shield} bgColor="bg-green-100" iconColor="text-green-600" title="100% Secure" desc="Encrypted payment via Razorpay" />
          <TrustBadge icon={CreditCard} bgColor="bg-blue-100" iconColor="text-blue-600" title="Multiple Options" desc="Cards, UPI, Wallets & Net Banking" />
          <TrustBadge icon={Truck} bgColor="bg-orange-100" iconColor="text-orange-600" title="Fast Shipping" desc="Delivered in 3-5 days" />
        </div>

        <div className="mt-6 pt-4 border-t border-[#F5E6E8]">
          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            We Accept:
          </p>
          <div className="flex flex-wrap gap-2">
            {['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallets'].map((method) => (
              <span key={method} className="px-3 py-1 bg-white border border-[#F5E6E8] rounded-lg text-xs font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrustBadge = ({ icon: Icon, bgColor, iconColor, title, desc }) => (
  <div className="flex gap-3">
    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{title}</p>
      <p className="text-xs text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{desc}</p>
    </div>
  </div>
);

export default OrderSummary;
