import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2C1810] text-white" id="contact" data-testid="footer-section">

      {/* Janmashtami festive strip */}
      <div className="bg-gradient-to-r from-[#8B1E3F] via-[#6B1530] to-[#8B1E3F] text-center py-2 px-4" data-testid="footer-banner-strip">
        <p className="text-xs md:text-sm font-medium tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          <span className="text-yellow-300">✨</span>{' '}
          <span className="text-yellow-300">Janmashtami Special</span>{' '}
          <span className="text-yellow-300">✨</span>{' '}
          <span className="text-white/70 hidden sm:inline">Celebrate the Divine Birth of Krishna</span>{' '}
          <span>🦚</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">

        {/* Radhe Radhe + flute — small festive accent */}
        <div className="text-center mb-8">
          <p className="text-base md:text-lg text-[#E8A0A8]" style={{ fontFamily: "'Mukta', sans-serif" }}>
            🌸 ॥ राधे राधे ॥ 🌸
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-8 md:w-12 h-px bg-[#D4A574]/40" />
            <span className="text-sm">🪈</span>
            <span className="w-8 md:w-12 h-px bg-[#D4A574]/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              KRIDHANI JEWELS
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Handcrafted devotional jewelry & shringar items for Radha Krishna and Laddu Gopal with love and devotion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#E8A0A8] mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Home</Link>
              <Link to="/categories" className="block text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Categories</Link>
              <Link to="/track-order" className="block text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Track Order</Link>
              <Link to="/terms" className="block text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Terms &amp; Conditions</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#E8A0A8] mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Contact Us
            </h4>
            <div className="space-y-3">
              <a href="tel:+917357807298" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                <Phone size={16} /> +91 73578 07298
              </a>
              <a href="mailto:Kridhanijewels@gmail.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="footer-support-email">
                <Mail size={16} /> Kridhanijewels@gmail.com
              </a>
              <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                <Instagram size={16} /> @kridhani_jewels_
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-300" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                <MapPin size={16} className="flex-shrink-0 mt-0.5" /> Jaipur, Rajasthan, India
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#E8A0A8] mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Customer Support
            </h4>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Need help? Reach out to us anytime:
            </p>
            <a href="mailto:Kridhanijewels@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8A0A8]/20 border border-[#E8A0A8]/30 rounded-lg text-sm font-semibold text-[#E8A0A8] hover:bg-[#E8A0A8]/30 transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="footer-contact-support-btn">
              <Mail size={14} /> Email Support
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-400" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            &copy; {new Date().getFullYear()} Kridhani Jewels. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 mt-1"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Website Designed & Developed by
            <span style={{ color: "#E5E4E2", fontWeight: "bold" }}>
              {" "}Krishna Soni
              </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
