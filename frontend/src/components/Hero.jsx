import React from 'react';
import { ShoppingBag, Heart, Gem, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_BG_DESKTOP = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/461862e9eb5dd01e97397139540d250cf6d4ced79ef87b62e2df477c8e95f95e.jpeg';
const HERO_BG_MOBILE = 'https://static.prod-images.emergentagent.com/jobs/4a51cfbf-7964-4e31-bf50-5b22f9ab4da2/images/d4867ff12bfd2abea3e9af2f9c2a293a930f3a664d0f1a7d5ea8d4c7515a917d.jpeg';

const featureCards = [
  { icon: Heart, label: ['Handmade', 'with Love'] },
  { icon: Gem, label: ['Pure & Premium', 'Quality'] },
  { icon: Sparkles, label: ['Perfect for', 'Gifting'] },
];

const FeatureCards = () => (
  <div
    className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10 max-w-2xl mx-auto p-2 md:p-3 rounded-2xl bg-white/55 backdrop-blur-md border border-white/70 shadow-[0_10px_40px_-15px_rgba(180,120,130,0.35)]"
    data-testid="hero-feature-cards"
  >
    {featureCards.map(({ icon: Icon, label }, i) => (
      <div
        key={i}
        className="text-center py-4 md:py-5 px-1 md:px-3 rounded-xl bg-white/70 border border-white/80 shadow-[0_6px_20px_-10px_rgba(200,130,140,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(200,130,140,0.55)] transition-all duration-300"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 mb-2 rounded-full bg-gradient-to-br from-[#FBE7EC] to-[#F6D3DC]">
          <Icon size={18} className="text-[#C77A8A]" strokeWidth={2.2} />
        </span>
        <p className="text-[11px] md:text-sm font-semibold text-[#4A2C33] leading-snug" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {label[0]}<br />{label[1]}
        </p>
      </div>
    ))}
  </div>
);

const GoldDivider = ({ ornament }) => (
  <div className="flex items-center justify-center gap-3 md:gap-4">
    <span className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent via-[#D9B26A] to-[#C9A24E]" />
    <span className="text-[#C9A24E] text-base md:text-lg">{ornament}</span>
    <span className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent via-[#D9B26A] to-[#C9A24E]" />
  </div>
);

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-[#FFF8FA]"
        data-testid="hero-section"
      >
        {/* Layered premium backdrop */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG_MOBILE}
            alt=""
            aria-hidden="true"
            className="md:hidden w-full h-full object-cover object-center"
            loading="eager"
          />
          <img
            src={HERO_BG_DESKTOP}
            alt=""
            aria-hidden="true"
            className="hidden md:block w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>
        {/* Softening overlay to keep the center clean & text readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 40%, rgba(255,248,250,0.72) 0%, rgba(255,245,248,0.5) 45%, rgba(255,244,247,0.2) 100%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FFF8FA] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFF9FB] to-transparent" />

        {/* Floating micro-accents */}
        <span className="hidden md:block absolute top-16 left-[14%] w-2.5 h-2.5 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
        <span className="hidden md:block absolute bottom-24 right-[16%] w-2 h-2 rounded-full bg-[#F3C9D3]/80 shadow-[0_0_10px_rgba(243,201,211,0.9)] animate-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-10 md:pt-16 md:pb-20 text-center">

          {/* Radhe Radhe */}
          <h2
            className="text-xl md:text-3xl font-semibold text-[#C77A8A] tracking-wide mb-4 md:mb-6"
            style={{ fontFamily: "'Mukta', sans-serif" }}
            data-testid="hero-radhe-radhe"
          >
            <span className="text-[#E9A7B4]">✿</span>{' '}॥ राधे राधे ॥{' '}<span className="text-[#E9A7B4]">✿</span>
          </h2>

          {/* Top gold divider */}
          <div className="mb-6 md:mb-8">
            <GoldDivider ornament="✦" />
          </div>

          {/* Main Heading */}
          <div className="mb-4 md:mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-[1.12] tracking-tight">
              PREMIUM RADHA RANI
            </h1>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] mt-1 md:mt-2 leading-[1.12] tracking-tight">
              LADDU GOPAL
            </h1>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#2C1810] mt-1 md:mt-2 leading-[1.12] tracking-tight">
              YUGAL JODI
            </h1>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#8B1E3F] mt-3 md:mt-4 tracking-wide">
              &amp; PYARE PRABHU KA SHRINGAR
            </h1>
          </div>

          {/* Ornamental floral divider */}
          <div className="mb-5 md:mb-7">
            <GoldDivider ornament="❁" />
          </div>

          {/* Tagline */}
          <p
            className="text-xl md:text-3xl italic text-[#8B1E3F] mb-4 md:mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Divine Elegance
          </p>

          {/* Description */}
          <p
            className="text-sm md:text-lg text-[#5D4037] max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Handcrafted shringar items and jewelry for your beloved deities. Premium quality, devotional designs.
          </p>

          {/* Feature Cards */}
          <FeatureCards />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-9 md:px-12 py-3.5 md:py-4 bg-gradient-to-r from-[#E2A0AD] via-[#D8909C] to-[#C8808C] text-white text-sm md:text-base font-bold rounded-full shadow-[0_12px_30px_-8px_rgba(200,128,140,0.6)] hover:shadow-[0_16px_38px_-8px_rgba(200,128,140,0.7)] hover:scale-[1.02] transition-all duration-300"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="shop-now-btn"
            >
              <ShoppingBag size={18} />
              Shop Now
            </button>

            <Link
              to="/categories"
              className="w-full sm:w-auto px-9 md:px-12 py-3.5 md:py-4 bg-white/70 backdrop-blur-md border border-[#EBC0C9] text-[#B76B7A] text-sm md:text-base font-semibold rounded-full shadow-[0_8px_24px_-12px_rgba(200,128,140,0.5)] hover:bg-white hover:text-[#8B1E3F] hover:scale-[1.02] transition-all duration-300 text-center"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="view-categories-btn"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
