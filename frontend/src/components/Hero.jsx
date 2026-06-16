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
    <section className="min-h-[65vh] md:min-h-[75vh] bg-[#FFF9FA] flex items-center py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="text-center">
          {/* Hindi Text */}
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-8" style={{ fontFamily: "'Mukta', sans-serif" }}>
            <h2 className="text-2xl md:text-5xl font-semibold text-[#E8A0A8]">
             🌸 राधे राधे 🌸
            </h2>
          </div>

          {/* Main Heading */}
          <div className="mb-4 md:mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              PREMIUM{' '}
              <span className="font-bold">RADHA RANI</span>
            </h1>
            <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold text-gray-900 mt-2 md:mt-3 leading-tight">
              LADDU GOPAL
            </h1>
            <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold mt-2 md:mt-3 leading-tight">
              <span className="font-bold">YUGAL JODI</span>
            </h1>
            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold text-[#8B1E3F] mt-2 md:mt-3">
              & PYARE PRABHU KA SHRINGAR
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-base md:text-2xl italic text-[#8B1E3F] mb-4 md:mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            Divine Elegance
          </p>

          {/* Description */}
          <p className="text-sm md:text-lg text-[#5D4037] max-w-2xl mx-auto mb-6 md:mb-12 leading-relaxed px-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Handcrafted shringar items and jewelry for your beloved deities. Premium quality, devotional designs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
            <button 
              onClick={scrollToProducts}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 md:px-12 py-3 md:py-5 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white text-sm md:text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="shop-now-btn"
            >
              <ShoppingBag size={20} className="md:w-[22px] md:h-[22px]" />
              Shop Now
            </button>

            <Link
              to="/categories"
              className="w-full sm:w-auto px-8 md:px-12 py-3 md:py-5 bg-transparent border-2 border-[#E8A0A8] text-[#E8A0A8] text-sm md:text-lg font-semibold rounded-full hover:bg-[#E8A0A8] hover:text-white transition-all duration-300 text-center"
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
