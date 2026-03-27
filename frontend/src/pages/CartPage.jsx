import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

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
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="continue-shopping-empty"
            >
              Continue Shopping
            </Link>
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
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-[#F5E6E8] flex gap-4" data-testid={`cart-item-${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-[#E8A0A8] transition-colors"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex items-center gap-2 bg-[#FFF9FA] rounded-lg px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#E8A0A8] hover:text-[#D8909C]"
                        data-testid={`decrease-qty-${item.id}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-[#2C1810] w-8 text-center" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid={`quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#E8A0A8] hover:text-[#D8909C]"
                        data-testid={`increase-qty-${item.id}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-[#F5E6E8] shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold text-[#2C1810] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm md:text-base" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    <span>Subtotal</span>
                    <span className="font-semibold" data-testid="subtotal">₹{getCartTotal()}</span>
                  </div>
                </div>

                <div className="border-t border-[#F5E6E8] pt-4 mb-6">
                  <div className="flex justify-between text-base md:text-lg font-bold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    <span>Total</span>
                    <span className="text-[#E8A0A8]" data-testid="total">₹{getCartTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg mb-4"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="proceed-checkout"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-sm text-[#5D4037] hover:text-[#E8A0A8] transition-colors"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="continue-shopping"
                >
                  Continue Shopping
                </Link>
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
