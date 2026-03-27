import React from 'react';
import { Users, Star } from 'lucide-react';

const SocialProof = () => {
  return (
    <div className="bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] py-3 md:py-4 text-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-2 text-white">
          <Users size={20} className="md:hidden" />
          <Users size={24} className="hidden md:block" />
          <Star size={20} className="md:hidden fill-white" />
          <Star size={24} className="hidden md:block fill-white" />
          <div>
            <p className="text-sm md:text-base font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              1000+ Happy Customers ❤️
            </p>
            <p className="text-xs md:text-sm opacity-90" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Loved by devotees across India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;