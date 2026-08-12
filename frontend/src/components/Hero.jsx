import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Gem, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSiteSettings } from '../services/settingsService';

const KRISHNA_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/0fad0117c02101a3c14af994ec64532b53c558fe06f100e52b1f9e9b6eaf94e5.jpeg';
const TORAN_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/5fdbb82eeb065195cc2f159fe71b1da9f32161a547c19da940ec0fafaea280b2.jpeg';
const PEACOCK_FEATHER = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/47a84c2bd48c711885318262fcc78d459a4d0719ac60618e8f1c01f80ef5ff80.jpeg';
const BELL_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/d28aed9683c8efce8d8f386757548cccd72ed65d00dff765bd88f4fa965f9f67.jpeg';
const TEMPLE_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/94c453a8e25ff86db489b7c01e3889d1453bcb72432394d763204076c9aa9352.jpeg';
const FLUTES_IMG = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/749a1cf53c402ed8c5abd55f1a680b25d8b45bad506758cccd0cb55d26e29450.jpeg';

const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-[#8B1E3F] via-[#6B1530] to-[#8B1E3F] text-white text-center py-2 px-4" data-testid="announcement-bar">
    <p className="text-xs md:text-sm font-medium tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <span className="text-yellow-300">✨</span> Handmade & Customised Jewellery Available | Made to Match Your Style <span className="text-yellow-300">✨</span>
    </p>
  </div>
);

const FeatureRow = ({ isJanmashtami }) => (
  <div className="flex items-center justify-center md:justify-start gap-0 mb-6 md:mb-10 mx-4 md:mx-0">
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

        {/* ===== TORAN GARLAND ===== */}
        <div className="relative w-full bg-[#FFF9FA]">
          <img
            src={TORAN_IMG}
            alt="Floral toran garland"
            className="w-full h-12 md:h-20 object-cover object-bottom"
            loading="eager"
          />
          {/* Hanging bells */}
          <img src={BELL_IMG} alt="" className="absolute left-[15%] md:left-[20%] top-6 md:top-10 w-7 h-9 md:w-11 md:h-14 object-contain" style={{ mixBlendMode: 'multiply' }} loading="eager" />
          <img src={BELL_IMG} alt="" className="absolute right-[15%] md:right-[20%] top-6 md:top-10 w-7 h-9 md:w-11 md:h-14 object-contain" style={{ mixBlendMode: 'multiply' }} loading="eager" />
        </div>

        {/* ===== PEACOCK FEATHERS — TOP CORNERS ===== */}
        <img src={PEACOCK_FEATHER} alt="" className="absolute left-0 top-12 md:top-16 w-16 md:w-28 lg:w-36 opacity-50 pointer-events-none" style={{ mixBlendMode: 'multiply' }} loading="eager" />
        <img src={PEACOCK_FEATHER} alt="" className="absolute right-0 top-12 md:top-16 w-16 md:w-28 lg:w-36 opacity-50 pointer-events-none" style={{ mixBlendMode: 'multiply', transform: 'scaleX(-1)' }} loading="eager" />

        {/* ===== SCATTERED PETALS ===== */}
        <div className="absolute top-[35%] right-[40%] w-2.5 h-2.5 bg-[#F0B0B8] rounded-full opacity-30 rotate-45 pointer-events-none" />
        <div className="absolute top-[50%] right-[30%] w-2 h-2 bg-[#E8A0A8] rounded-full opacity-25 pointer-events-none" />
        <div className="absolute top-[60%] left-[8%] w-3 h-3 bg-[#F0B0B8] rounded-full opacity-20 rotate-12 pointer-events-none" />
        <div className="absolute top-[45%] right-[15%] w-2 h-2 bg-[#D8909C] rounded-full opacity-20 pointer-events-none" />
        <div className="absolute top-[70%] left-[25%] w-2.5 h-2.5 bg-[#E8A0A8] rounded-full opacity-15 rotate-[-20deg] pointer-events-none" />

        {/* ===== MAIN CONTENT ===== */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pb-6 md:pb-16">
          <div className="relative flex flex-col md:flex-row items-center md:items-start">

            {/* Text content — left on desktop, centered on mobile */}
            <div className="flex-1 text-center md:text-left pt-4 md:pt-10 relative z-10">

              {/* Radhe Radhe */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-4">
                <h2
                  className="text-xl md:text-4xl font-semibold text-[#D8909C]"
                  style={{ fontFamily: "'Mukta', sans-serif" }}
                >
                  🌸 ॥ राधे राधे ॥ 🌸
                </h2>
              </div>

              {/* Crossed Flutes */}
              <div className="flex items-center justify-center md:justify-start mb-4 md:mb-6">
                <img src={FLUTES_IMG} alt="Bansuri flutes" className="w-16 h-10 md:w-24 md:h-14 object-contain" style={{ mixBlendMode: 'multiply' }} loading="eager" />
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
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-4 px-8 md:px-0">
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

            {/* ===== KRISHNA IMAGE — right side ===== */}
            <div className="md:flex-shrink-0 md:w-[420px] lg:w-[480px] relative mt-2 md:mt-6 self-end pointer-events-none">
              <img
                src={KRISHNA_IMG}
                alt="Baby Krishna Laddu Gopal"
                className="w-[240px] md:w-full ml-auto md:ml-0 opacity-90"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* ===== PEACOCK FEATHERS — BOTTOM CORNERS ===== */}
        <img src={PEACOCK_FEATHER} alt="" className="absolute left-0 bottom-0 w-20 md:w-32 lg:w-40 opacity-40 pointer-events-none rotate-[30deg] origin-bottom-left" style={{ mixBlendMode: 'multiply' }} loading="lazy" />
        <img src={PEACOCK_FEATHER} alt="" className="absolute right-0 bottom-0 w-20 md:w-32 lg:w-40 opacity-40 pointer-events-none rotate-[-30deg] origin-bottom-right" style={{ mixBlendMode: 'multiply', transform: 'scaleX(-1) rotate(-30deg)' }} loading="lazy" />

        {/* ===== TEMPLE SILHOUETTE — BOTTOM ===== */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-28 overflow-hidden pointer-events-none">
          <img src={TEMPLE_IMG} alt="" className="w-full h-full object-cover object-top opacity-15" style={{ mixBlendMode: 'multiply' }} loading="lazy" />
        </div>
      </section>
    </>
  );
};

export default Hero;
