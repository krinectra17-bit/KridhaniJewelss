import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const StickyMobileCTA = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#F5E6E8] shadow-2xl p-3 md:hidden" data-testid="mobile-cta">
      <div className="flex gap-3">
        <Link
          to="/cart"
          className="relative flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-[#E8A0A8] text-[#E8A0A8] font-semibold rounded-full"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid="mobile-view-cart"
        >
          <ShoppingBag size={18} />
          View Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#E8A0A8] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <button
          onClick={scrollToProducts}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-bold rounded-full shadow-lg"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid="mobile-order-now"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;