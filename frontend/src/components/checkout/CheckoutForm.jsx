import React from 'react';
import { Lock } from 'lucide-react';

const CheckoutForm = ({ formData, errors, submitting, onFieldChange, onSubmit }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white p-6 md:p-8 rounded-xl border border-[#F5E6E8]">
        <h3 className="text-2xl font-semibold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Delivery Details
        </h3>

        <form onSubmit={onSubmit} className="space-y-6" data-testid="checkout-form">
          <div>
            <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={onFieldChange}
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
              onChange={onFieldChange}
              placeholder="10-digit mobile number"
              className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="customer-phone"
            />
            {errors.customerPhone && <p className="text-sm text-red-600 mt-1">{errors.customerPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Email (for receipt)
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail || ''}
              onChange={onFieldChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="customer-email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Delivery Address *
            </label>
            <textarea
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={onFieldChange}
              rows={4}
              placeholder="Enter complete delivery address"
              className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="delivery-address"
            />
            {errors.deliveryAddress && <p className="text-sm text-red-600 mt-1">{errors.deliveryAddress}</p>}
          </div>

          {errors.payment && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="payment-error">
              <p className="text-sm text-red-700 font-medium">{errors.payment}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-3 text-base hover:shadow-lg transition-all duration-200"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            data-testid="pay-now-btn"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock size={18} />
                Pay Now
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Secured by Razorpay. Your payment details are encrypted.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
