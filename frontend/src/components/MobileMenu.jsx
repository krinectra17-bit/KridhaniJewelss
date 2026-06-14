import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, X } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, onScrollToSection }) => {
  if (!isOpen) return null;

  const handleNavClick = (action) => {
    onClose();
    if (typeof action === 'function') action();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4" data-testid="close-menu">
            <X size={24} className="text-[#2C1810]" />
          </button>

          <div className="mt-12 flex flex-col gap-6">
            <Link to="/" onClick={onClose} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Home
            </Link>
            <button onClick={() => handleNavClick(() => onScrollToSection('products'))} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8] text-left" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Products
            </button>
            <Link to="/categories" onClick={onClose} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Categories
            </Link>
            <Link to="/track-order" onClick={onClose} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Track Order
            </Link>
            <button onClick={() => handleNavClick(() => onScrollToSection('contact'))} className="text-base font-medium text-[#2C1810] hover:text-[#E8A0A8] text-left" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Contact
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                CONNECT WITH US
              </p>
              <div className="flex gap-4">
                <a href="tel:+916378581829" data-testid="mobile-menu-phone">
                  <Phone size={20} className="text-[#2C1810]" />
                </a>
                <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer" data-testid="mobile-menu-instagram">
                  <Instagram size={20} className="text-[#2C1810]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
