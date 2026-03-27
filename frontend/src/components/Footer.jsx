import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C1810] py-12 text-[#FFF8E1]" id="contact">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl md:text-3xl text-[#DAA520] mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              KRIDHANI JEWELS
            </h3>
            <p className="text-base md:text-lg text-[#E8A0A8] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Divine Elegance
            </p>
            <p className="text-sm leading-relaxed opacity-80 mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Handcrafted shringar items specially for Radha Krishna and Laddu Gopal. Every piece is made with devotion, love, and attention to detail.
            </p>
            <p className="text-3xl text-[#DAA520]">ॐ</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl text-[#DAA520] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Home
              </Link>
              <Link to="/#products" className="text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Products
              </Link>
              <Link to="/cart" className="text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Cart
              </Link>
              <Link to="/#contact" className="text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl text-[#DAA520] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact Us
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+916378581829" className="flex items-center gap-3 text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="footer-phone">
                <Phone size={18} />
                +91 63785 81829
              </a>
              <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm opacity-80 hover:text-[#DAA520] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="footer-instagram">
                <Instagram size={18} />
                @kridhani_jewels_
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-60" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            © 2026 Kridhani Jewels. Made with devotion ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;