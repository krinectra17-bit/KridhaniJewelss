import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';

const TORAN_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/5fdbb82eeb065195cc2f159fe71b1da9f32161a547c19da940ec0fafaea280b2.jpeg';
const PEACOCK_FEATHER = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/47a84c2bd48c711885318262fcc78d459a4d0719ac60618e8f1c01f80ef5ff80.jpeg';
const BELL_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/d28aed9683c8efce8d8f386757548cccd72ed65d00dff765bd88f4fa965f9f67.jpeg';
const TEMPLE_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/94c453a8e25ff86db489b7c01e3889d1453bcb72432394d763204076c9aa9352.jpeg';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" id="contact" data-testid="footer-section">

      {/* 1. Top Banner Strip — Janmashtami Special */}
      <div className="bg-gradient-to-r from-[#8B1E3F] via-[#6B1530] to-[#8B1E3F] text-center py-2.5 px-4" data-testid="footer-banner-strip">
        <p className="text-xs md:text-sm font-semibold tracking-wider" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          <span className="text-yellow-300">✨</span>
          <span className="text-yellow-300 mx-1">Janmashtami Special</span>
          <span className="text-yellow-300">✨</span>
          <span className="text-white/80 hidden sm:inline mx-1">Celebrate the Divine Birth of Krishna</span>
          <span className="ml-1">🦚</span>
        </p>
      </div>

      {/* 2. Floral Garland Border (Toran) with Hanging Bells */}
      <div className="relative bg-[#FFF0F2]">
        <img
          src={TORAN_IMG}
          alt="Floral toran garland"
          className="w-full h-12 md:h-20 object-cover object-bottom"
          loading="lazy"
        />
        {/* Hanging bells */}
        <img
          src={BELL_IMG}
          alt="Temple bell"
          className="absolute left-[12%] md:left-[18%] top-6 md:top-10 w-8 h-10 md:w-12 md:h-16 object-contain"
          style={{ mixBlendMode: 'multiply' }}
          loading="lazy"
        />
        <img
          src={BELL_IMG}
          alt="Temple bell"
          className="absolute right-[12%] md:right-[18%] top-6 md:top-10 w-8 h-10 md:w-12 md:h-16 object-contain"
          style={{ mixBlendMode: 'multiply' }}
          loading="lazy"
        />
      </div>

      {/* Main Footer Body */}
      <div className="relative bg-gradient-to-b from-[#FFF0F2] via-[#FCEAEC] to-[#F8DDE0]">

        {/* 3. Peacock Feather Accents — top corners */}
        <img
          src={PEACOCK_FEATHER}
          alt="Peacock feather"
          className="absolute top-0 left-0 w-20 md:w-32 lg:w-40 opacity-40 pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
          loading="lazy"
        />
        <img
          src={PEACOCK_FEATHER}
          alt="Peacock feather"
          className="absolute top-0 right-0 w-20 md:w-32 lg:w-40 opacity-40 pointer-events-none"
          style={{ mixBlendMode: 'multiply', transform: 'scaleX(-1)' }}
          loading="lazy"
        />

        {/* 5. Temple Silhouette Background — bottom layer */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-40 overflow-hidden pointer-events-none">
          <img
            src={TEMPLE_IMG}
            alt=""
            className="w-full h-full object-cover object-top opacity-15"
            style={{ mixBlendMode: 'multiply' }}
            loading="lazy"
          />
        </div>

        {/* Scattered petals — decorative CSS */}
        <div className="absolute top-16 left-[10%] w-3 h-3 bg-[#E8A0A8] rounded-full opacity-20 rotate-45 pointer-events-none" />
        <div className="absolute top-28 right-[15%] w-2 h-2 bg-[#D8909C] rounded-full opacity-25 pointer-events-none" />
        <div className="absolute top-40 left-[30%] w-2.5 h-2.5 bg-[#E8A0A8] rounded-full opacity-15 rotate-12 pointer-events-none" />
        <div className="absolute bottom-32 right-[25%] w-3 h-3 bg-[#D8909C] rounded-full opacity-20 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6">

          {/* 4. Devotional Hindi Text — Radhe Radhe + Flute */}
          <div className="text-center mb-8 md:mb-10">
            <h2
              className="text-xl md:text-3xl font-semibold text-[#8B1E3F]"
              style={{ fontFamily: "'Mukta', sans-serif" }}
            >
              🌸 ॥ राधे राधे ॥ 🌸
            </h2>
            {/* Flute (Bansuri) divider */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="w-10 md:w-16 h-px bg-gradient-to-r from-transparent to-[#D4A574]" />
              <span className="text-base md:text-xl" role="img" aria-label="flute">🪈</span>
              <span className="w-10 md:w-16 h-px bg-gradient-to-l from-transparent to-[#D4A574]" />
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand */}
            <div>
              <h3
                className="text-base md:text-lg font-bold text-[#8B1E3F] mb-3"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                KRIDHANI JEWELS
              </h3>
              <p
                className="text-xs md:text-sm text-[#5D4037] leading-relaxed"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Handcrafted devotional jewelry & shringar items for Radha Krishna and Laddu Gopal with love and devotion.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider text-[#8B1E3F] mb-3"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/categories', label: 'Categories' },
                  { to: '/new-arrivals', label: 'New Arrivals' },
                  { to: '/track-order', label: 'Track Order' },
                  { to: '/terms', label: 'Terms & Conditions' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="block text-xs md:text-sm text-[#5D4037] hover:text-[#8B1E3F] transition-colors"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider text-[#8B1E3F] mb-3"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Contact Us
              </h4>
              <div className="space-y-2.5">
                <a
                  href="tel:+917357807298"
                  className="flex items-center gap-2 text-xs md:text-sm text-[#5D4037] hover:text-[#8B1E3F] transition-colors"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  <Phone size={14} className="text-[#D8909C] flex-shrink-0" /> +91 73578 07298
                </a>
                <a
                  href="mailto:Kridhanijewels@gmail.com"
                  className="flex items-center gap-2 text-xs md:text-sm text-[#5D4037] hover:text-[#8B1E3F] transition-colors"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="footer-support-email"
                >
                  <Mail size={14} className="text-[#D8909C] flex-shrink-0" /> Kridhanijewels@gmail.com
                </a>
                <a
                  href="https://instagram.com/kridhani_jewels_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs md:text-sm text-[#5D4037] hover:text-[#8B1E3F] transition-colors"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  <Instagram size={14} className="text-[#D8909C] flex-shrink-0" /> @kridhani_jewels_
                </a>
                <div
                  className="flex items-start gap-2 text-xs md:text-sm text-[#5D4037]"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                  <MapPin size={14} className="text-[#D8909C] flex-shrink-0 mt-0.5" /> Jaipur, Rajasthan, India
                </div>
              </div>
            </div>

            {/* WhatsApp Order + Social */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider text-[#8B1E3F] mb-3"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Order on WhatsApp
              </h4>
              <a
                href="https://wa.me/917357807298?text=Hi%20Kridhani%20Jewels!%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs md:text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                data-testid="footer-whatsapp-btn"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="https://instagram.com/kridhani_jewels_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 flex items-center justify-center hover:bg-[#8B1E3F] hover:text-white text-[#8B1E3F] transition-all duration-200"
                  data-testid="footer-social-instagram"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="tel:+917357807298"
                  className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 flex items-center justify-center hover:bg-[#8B1E3F] hover:text-white text-[#8B1E3F] transition-all duration-200"
                  data-testid="footer-social-phone"
                  aria-label="Call us"
                >
                  <Phone size={16} />
                </a>
                <a
                  href="mailto:Kridhanijewels@gmail.com"
                  className="w-9 h-9 rounded-full bg-[#8B1E3F]/10 flex items-center justify-center hover:bg-[#8B1E3F] hover:text-white text-[#8B1E3F] transition-all duration-200"
                  data-testid="footer-social-email"
                  aria-label="Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-4">
            <span className="flex-1 max-w-[80px] md:max-w-[120px] h-px bg-gradient-to-r from-transparent to-[#D4A574]" />
            <span className="text-sm text-[#D4A574]">❁</span>
            <span className="flex-1 max-w-[80px] md:max-w-[120px] h-px bg-gradient-to-l from-transparent to-[#D4A574]" />
          </div>

          {/* Copyright */}
          <div className="text-center relative z-10">
            <p
              className="text-[10px] md:text-xs text-[#5D4037]/70"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              &copy; {new Date().getFullYear()} Kridhani Jewels. All rights reserved.
            </p>
            <p
              className="text-[10px] md:text-xs text-[#5D4037]/50 mt-1"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              Website Designed & Developed by
              <span className="font-semibold text-[#8B1E3F]/60"> Krishna Soni</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
