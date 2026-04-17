import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, CreditCard } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const OrderSuccess = ({ orderData, cartTotal }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-8 md:p-12 rounded-2xl text-center shadow-sm" data-testid="order-success">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#2C1810] mb-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Payment Successful!
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Thank you for your order. We will ship it shortly.
            </p>

            {/* Order details card */}
            <div className="bg-[#FFF9FA] p-6 rounded-xl mb-8 text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F5E6E8]">
                <Package size={20} className="text-[#E8A0A8]" />
                <div>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Order ID</p>
                  <p className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="order-id-display">
                    {orderData.orderId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#F5E6E8]">
                <CreditCard size={20} className="text-[#E8A0A8]" />
                <div>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Payment ID</p>
                  <p className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="payment-id-display">
                    {orderData.paymentId}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-gray-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Amount Paid</span>
                <span className="text-lg font-bold text-green-600" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>₹{cartTotal}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full hover:shadow-lg transition-all"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                data-testid="back-to-home"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
