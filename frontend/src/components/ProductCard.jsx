import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className="fill-current">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.862-2.48-1.862-4.73s1.178-3.356 1.596-3.814c.418-.458.912-.572 1.216-.572.304 0 .608.002.874.016.28.014.656-.106.026 1.574-.286.742-1.596 3.888-1.738 4.168-.142.28-.236.608-.046.968.19.36.284.58.568.896.284.316.596.706.85.948.284.27.578.564.99.976.412.412.412.686.612 1.144.2.458.1.858-.05 1.2-.15.342-1.346 3.24-1.346 3.24s-.092.352.144.538c.236.186.786.516 1.332.886.546.37 1.116.722 1.346.836.458.228.786.19 1.074-.116.288-.306 1.232-1.436 1.56-1.928.328-.492.656-.41 1.1-.244.45.166 2.842 1.342 3.33 1.586.486.244.81.366.928.572.12.206.12 1.192-.27 2.292z" />
  </svg>
);

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();

  const hasSizes = product.sizes && product.sizes.length > 0;
  const currentPrice = selectedSize
    ? product.sizes.find(s => s.size === selectedSize)?.price || product.price
    : product.price;

  const handleOrderWhatsApp = () => {
    if (hasSizes && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    const url = getWhatsAppOrderUrl(product, selectedSize, currentPrice);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showScarcity = product.stock < 10;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl border border-[#F5E6E8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-[#E8A0A8] text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
          ₹{currentPrice}
        </div>
        {product.isBestseller && (
          <div className="absolute top-2 left-2 bg-[#DAA520] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <TrendingUp size={12} /> Bestseller
          </div>
        )}
        {product.isTrending && !product.isBestseller && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Flame size={12} /> Trending
          </div>
        )}
        {showScarcity && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
            Few left!
          </div>
        )}
      </div>

      <div className="p-3 md:p-5">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {product.category}
        </p>
        <h3 className="text-sm md:text-lg font-semibold text-gray-900 line-clamp-2 leading-snug mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </h3>
        <p className="hidden md:block text-sm text-gray-600 line-clamp-1 mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {product.description}
        </p>

        {/* Size selector */}
        {hasSizes && (
          <div className="mb-3" data-testid={`size-selector-${product.id}`}>
            <p className="text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Size:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(s.size); }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-2 transition-all ${
                    selectedSize === s.size
                      ? 'border-[#E8A0A8] bg-[#E8A0A8] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-[#E8A0A8]'
                  }`}
                  data-testid={`size-${product.id}-${s.size}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          ₹{currentPrice}
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); handleOrderWhatsApp(); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 bg-[#25D366] text-white text-xs md:text-sm font-bold rounded-full shadow-md hover:bg-[#1EBE5A] hover:shadow-xl transition-all duration-200"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          data-testid={`order-whatsapp-${product.id}`}
        >
          <WhatsAppIcon size={18} />
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
