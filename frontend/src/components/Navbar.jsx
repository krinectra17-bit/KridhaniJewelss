import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Instagram, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const scrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold uppercase tracking-wide text-[#2C1810]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  KRIDHANI JEWELS
                </span>
                <span className="text-xs text-[#E8A0A8]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Divine Elegance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Home
              </Link>
              <button onClick={() => scrollToSection('products')} className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Products
              </button>
              <Link to="/categories" className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Categories
              </Link>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Contact
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative" data-testid="cart-icon">
                <ShoppingCart size={22} className="text-[#2C1810]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E8A0A8] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </Link>

              <a href="tel:+916378581829" className="hidden md:block" data-testid="phone-link">
                <Phone size={20} className="text-[#2C1810]" />
              </a>

              <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer" className="hidden md:block" data-testid="instagram-link">
                <Instagram size={20} className="text-[#2C1810]" />
              </a>

              <button onClick={() => setIsMenuOpen(true)} className="md:hidden" data-testid="hamburger-menu">
                <Menu size={24} className="text-[#2C1810]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300">
            <div className="p-6">
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4" data-testid="close-menu">
                <X size={24} className="text-[#2C1810]" />
              </button>

              <div className="mt-12 flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Home
                </Link>
                <button onClick={() => scrollToSection('products')} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8] text-left" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Products
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8] text-left" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Contact
                </button>
                <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  View All Categories
                </Link>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    CONNECT WITH US
                  </p>
                  <div className="flex gap-4">
                    <a href="tel:+916378581829">
                      <Phone size={20} className="text-[#2C1810]" />
                    </a>
                    <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer">
                      <Instagram size={20} className="text-[#2C1810]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
