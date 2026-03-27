import React from 'react';
import { Instagram } from 'lucide-react';

const InstagramSection = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white text-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Follow Us on Instagram
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          See more divine designs
        </p>

        <a
          href="https://instagram.com/kridhani_jewels_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm md:text-lg font-semibold rounded-full hover:shadow-lg transition-all"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid="instagram-button"
        >
          <Instagram size={20} />
          @kridhani_jewels_
        </a>
      </div>
    </section>
  );
};

export default InstagramSection;