import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Gem, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSiteSettings } from '../services/settingsService';

const TORAN_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/5fdbb82eeb065195cc2f159fe71b1da9f32161a547c19da940ec0fafaea280b2.jpeg';

const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-[#8B1E3F] via-[#6B1530] to-[#8B1E3F] text-white text-center py-2 px-4" data-testid="announcement-bar">
    <p className="text-xs md:text-sm font-medium tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <span className="text-yellow-300">✨</span> Janmashtami Special <span className="text-yellow-300">✨</span>{' '}Celebrate the Divine Birth of Krishna 🦚
    </p>
  </div>
);

const FeatureRow = ({ isJanmashtami }) => (
  <div className="flex items-center justify-center gap-0 mb-6 md:mb-10 mx-4">
    <div className="flex-1 max-w-[140px] md:max-w-[180px] text-center py-3 md:py-4 px-2 bg-white/60 backdrop-blur-sm rounded-l-xl border border-[#F5E6E8]">
      <Heart size={18} className="mx-auto mb-1 text-[#D8909C]" />
      <p className="text-[10px] md:text-xs font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Handmade<br/>with Love</p>
    </div>
    <div className="flex-1 max-w-[140px] md:max-w-[180px] text-center py-3 md:py-4 px-2 bg-white/60 backdrop-blur-sm border-y border-[#F5E6E8]">
      <Gem size={18} className="mx-auto mb-1 text-[#D8909C]" />
      <p className="text-[10px] md:text-xs font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Pure & Premium<br/>Quality</p>
    </div>
    <div className="flex-1 max-w-[140px] md:max-w-[180px] text-center py-3 md:py-4 px-2 bg-white/60 backdrop-blur-sm rounded-r-xl border border-[#F5E6E8]">
      <Sparkles size={18} className="mx-auto mb-1 text-[#D8909C]" />
      <p className="text-[10px] md:text-xs font-semibold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {isJanmashtami ? 'Perfect for\nJanmashtami' : 'Perfect for\nGifting'}
      </p>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  const [isJanmashtami, setIsJanmashtami] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then((s) => setIsJanmashtami(!!s.isJanmashtamiThemeActive))
      .catch(() => {});
  }, []);

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnnouncementBar />
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#FFF9FA] via-[#FFF5F0] to-[#FFF9FA]"
        data-testid="hero-section"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #E8A0A8 1px, transparent 1px), radial-gradient(circle at 80% 20%, #D4A574 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 80px 80px'
        }} />

        {/* Toran at top — Janmashtami only */}
        {isJanmashtami && (
          <div className="w-full bg-[#FFF9FA]">
            <img
              src={TORAN_IMG}
              alt="Floral toran decoration"
              className="w-full h-10 md:h-16 object-cover object-bottom"
              loading="eager"
            />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pb-6 md:pb-16">
          <div className="relative flex flex-col md:flex-row items-center md:items-start">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left pt-4 md:pt-10 relative z-10">

              {/* Radhe Radhe */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-6">
                <h2
                  className="text-xl md:text-4xl font-semibold text-[#D8909C]"
                  style={{ fontFamily: "'Mukta', sans-serif" }}
                >
                  🌸 ॥ राधे राधे ॥ 🌸
                </h2>
              </div>

              {/* Flute divider */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6 px-4">
                <span className="flex-1 max-w-[60px] md:max-w-[80px] h-px bg-gradient-to-r from-transparent to-[#D4A574]" />
                <span className="text-lg md:text-2xl" role="img" aria-label="flute">🪈</span>
                <span className="flex-1 max-w-[60px] md:max-w-[80px] h-px bg-gradient-to-l from-transparent to-[#D4A574]" />
              </div>

              {/* Main Heading */}
              <div className="mb-3 md:mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-tight">
                  PREMIUM <span className="font-bold">RADHA RANI</span>
                </h1>
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] mt-1 md:mt-2 leading-tight">
                  LADDU GOPAL
                </h1>
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] mt-1 md:mt-2 leading-tight">
                  YUGAL JODI
                </h1>
                <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-[#8B1E3F] mt-1 md:mt-2">
                  & PYARE PRABHU KA SHRINGAR
                </h1>
              </div>

              {/* Lotus divider */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-4 px-8">
                <span className="flex-1 max-w-[40px] md:max-w-[60px] h-px bg-[#D4A574]" />
                <span className="text-sm md:text-base text-[#D4A574]">❁</span>
                <span className="flex-1 max-w-[40px] md:max-w-[60px] h-px bg-[#D4A574]" />
              </div>

              {/* Tagline */}
              <p
                className="text-base md:text-2xl italic text-[#8B1E3F] mb-3 md:mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Divine Elegance
              </p>

              {/* Description */}
              <p
                className="text-sm md:text-base text-[#5D4037] max-w-xl mx-auto md:mx-0 mb-5 md:mb-8 leading-relaxed px-2 md:px-0"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Handcrafted shringar items and jewelry for your beloved deities. Premium quality, devotional designs.
              </p>

              {/* Feature Row */}
              <FeatureRow isJanmashtami={isJanmashtami} />

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 px-4 md:px-0 pb-4 md:pb-0">
                <button
                  onClick={scrollToProducts}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-[#D8909C] to-[#C8808C] text-white text-sm md:text-base font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="shop-now-btn"
                >
                  <ShoppingBag size={18} />
                  {isJanmashtami ? 'Shop Janmashtami Collection' : 'Shop Now'}
                </button>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-[#FFF9FA] border-2 border-[#E8A0A8] text-[#D8909C] text-sm md:text-base font-semibold rounded-full hover:bg-[#E8A0A8] hover:text-white transition-all duration-300 text-center"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="view-categories-btn"
                >
                  View All Categories
                </Link>
              </div>
            </div>


          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
