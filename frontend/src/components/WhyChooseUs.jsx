import React from 'react';
import { Heart, Award, Sparkles, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Heart,
      title: 'Handmade with Love',
      description: 'Each piece is crafted with devotion and care for your deities'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest materials and traditional craftsmanship'
    },
    {
      icon: Sparkles,
      title: 'Spiritual Designs',
      description: 'Authentic devotional designs blessed with tradition'
    },
    {
      icon: Users,
      title: '1000+ Happy Customers',
      description: 'Trusted by devotees across India for quality'
    }
  ];

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-5xl font-semibold text-[#2C1810] mb-2 md:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Choose Kridhani Jewels
          </h2>
          <p className="text-xs md:text-base text-[#5D4037]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Experience the divine difference in every piece
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border-2 border-transparent hover:border-[#E8A0A8] hover:shadow-lg transition-all duration-300 text-center"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8A0A8]/10 flex items-center justify-center">
                  <Icon size={28} className="text-[#E8A0A8]" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-[#5D4037] leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;