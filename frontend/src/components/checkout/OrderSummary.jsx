import React from 'react';
import { Shield, CreditCard, Truck } from 'lucide-react';

const OrderSummary = ({ cartTotal }) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm" data-testid="order-summary">
        <h3 className="text-xl font-semibold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Order Summary
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm md:text-base" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            <span>Subtotal</span>
            <span className="font-semibold">₹{cartTotal}</span>
          </div>
        </div>
        <div className="border-t border-[#F5E6E8] pt-4">
          <div className="flex justify-between text-base md:text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            <span>Total</span>
            <span className="text-[#E8A0A8]" data-testid="order-total">₹{cartTotal}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FDF2F8] p-6 rounded-2xl border border-[#F5E6E8]">
        <h4 className="text-lg font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Why Shop With Us
        </h4>
        <div className="space-y-4">
          <TrustBadge icon={Shield} color="green" title="Secure Payment" desc="Your data is protected" />
          <TrustBadge icon={CreditCard} color="blue" title="COD Available" desc="Pay when you receive" />
          <TrustBadge icon={Truck} color="orange" title="Fast Shipping" desc="Delivered in 3-5 days" />
        </div>

        <div className="mt-6 pt-4 border-t border-[#F5E6E8]">
          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            We Accept:
          </p>
          <div className="flex flex-wrap gap-2">
            {['UPI', 'Razorpay', 'Cards', 'Cash'].map((method) => (
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

const TrustBadge = ({ icon: Icon, color, title, desc }) => (
  <div className="flex gap-3">
    <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
      <Icon size={20} className={`text-${color}-600`} />
    </div>
    <div>
      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{title}</p>
      <p className="text-xs text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{desc}</p>
    </div>
  </div>
);

export default OrderSummary;
