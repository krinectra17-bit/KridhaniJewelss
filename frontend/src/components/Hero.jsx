import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[70vh] md:min-h-[75vh] bg-[#FFF9FA] flex items-center py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="text-center">
          {/* Hindi Text */}
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-8" style={{ fontFamily: "'Mukta', sans-serif" }}>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#E8A0A8]">
              राधे राधे 🌸
            </h2>
          </div>

          {/* Main Heading */}
          <div className="mb-6 md:mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              PREMIUM{' '}
              <span className="text-[#E8A0A8] font-bold">RADHA RANI</span>
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mt-3">
              LADDU GOPAL
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-3">
              <span className="text-[#E8A0A8] font-bold">YUGAL JODI</span>
            </h1>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#DAA520] mt-3">
              & DIVINE JEWELLERY
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl italic text-[#8D6E63] mb-8 md:mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            Divine Elegance
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-[#5D4037] max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Handcrafted shringar items and jewelry for your beloved deities. Premium quality, devotional designs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToProducts}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white text-base md:text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="shop-now-btn"
            >
              <ShoppingBag size={22} />
              Shop Now
            </button>

            <Link
              to="/categories"
              className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-transparent border-2 border-[#E8A0A8] text-[#E8A0A8] text-base md:text-lg font-semibold rounded-full hover:bg-[#E8A0A8] hover:text-white transition-all duration-300"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="view-categories-btn"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
