import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const OrderSuccess = ({ orderData, formData, cartTotal }) => {
  const navigate = useNavigate();

  const whatsappMessage = formData.paymentMethod === 'UPI'
    ? `Hi, I've placed order ${orderData.orderId}. Payment done via UPI. Total: ₹${cartTotal}`
    : `Hi, I've placed order ${orderData.orderId}. Will pay cash on delivery.`;
  const whatsappUrl = `https://wa.me/916378581829?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl text-center" data-testid="order-success">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Order Placed Successfully!
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Thank you for your order. We will contact you shortly.
            </p>
            <p className="text-sm text-gray-500 mb-8" data-testid="order-id-display">
              Order ID: <strong>{orderData.orderId}</strong>
            </p>

            {formData.paymentMethod === 'UPI' && (
              <div className="bg-[#FFF9FA] p-6 rounded-xl mb-8" data-testid="upi-instructions">
                <h3 className="text-xl font-semibold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  UPI Payment Instructions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      UPI ID: kridhani@upi
                    </p>
                    <button className="text-[#E8A0A8] hover:text-[#D8909C]" data-testid="copy-upi-btn">
                      <Copy size={20} />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    Amount: ₹{cartTotal}
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
                    data-testid="share-whatsapp-btn"
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
};

export default OrderSuccess;
