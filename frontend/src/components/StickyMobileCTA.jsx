import React from 'react';

const WhatsAppIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className="fill-current">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.862-2.48-1.862-4.73s1.178-3.356 1.596-3.814c.418-.458.912-.572 1.216-.572.304 0 .608.002.874.016.28.014.656-.106.026 1.574-.286.742-1.596 3.888-1.738 4.168-.142.28-.236.608-.046.968.19.36.284.58.568.896.284.316.596.706.85.948.284.27.578.564.99.976.412.412.412.686.612 1.144.2.458.1.858-.05 1.2-.15.342-1.346 3.24-1.346 3.24s-.092.352.144.538c.236.186.786.516 1.332.886.546.37 1.116.722 1.346.836.458.228.786.19 1.074-.116.288-.306 1.232-1.436 1.56-1.928.328-.492.656-.41 1.1-.244.45.166 2.842 1.342 3.33 1.586.486.244.81.366.928.572.12.206.12 1.192-.27 2.292z" />
  </svg>
);

const StickyMobileCTA = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hello Kridhani Jewels,\n\nI would like to order from your collection. Please share more details.');
    window.open(`https://wa.me/917357807298?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#F5E6E8] shadow-2xl p-3 md:hidden" data-testid="mobile-cta">
      <div className="flex gap-3">
        <button
          onClick={openWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white font-bold rounded-full shadow-lg"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid="mobile-whatsapp-order"
        >
          <WhatsAppIcon />
          Order on WhatsApp
        </button>

        <button
          onClick={scrollToProducts}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-bold rounded-full shadow-lg"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid="mobile-browse-products"
        >
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
