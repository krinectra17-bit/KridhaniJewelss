import React from 'react';

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

          <div>
            <h4 className="text-xl font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Payment Method
            </h4>
            <div className="space-y-3">
              <PaymentOption
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === 'COD'}
                onChange={onFieldChange}
                title="Cash on Delivery (COD)"
                desc="Pay when you receive"
                testId="payment-cod"
              />
              <PaymentOption
                name="paymentMethod"
                value="UPI"
                checked={formData.paymentMethod === 'UPI'}
                onChange={onFieldChange}
                title="UPI Payment"
                desc="Pay via UPI and share screenshot"
                testId="payment-upi"
              />
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
  );
};

const PaymentOption = ({ name, value, checked, onChange, title, desc, testId }) => (
  <label className="flex items-start gap-3 p-4 border-2 border-[#F5E6E8] rounded-lg cursor-pointer hover:border-[#E8A0A8]">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="mt-1 accent-[#E8A0A8]"
      data-testid={testId}
    />
    <div>
      <p className="text-sm font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {title}
      </p>
      <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {desc}
      </p>
    </div>
  </label>
);

export default CheckoutForm;
