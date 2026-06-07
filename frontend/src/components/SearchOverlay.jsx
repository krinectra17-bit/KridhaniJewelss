import React from 'react';
import { X } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

/** Highlight matching substring inside text */
const Highlight = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#E8A0A8]/30 text-[#2C1810] rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

const WhatsAppIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className="fill-current">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.862-2.48-1.862-4.73s1.178-3.356 1.596-3.814c.418-.458.912-.572 1.216-.572.304 0 .608.002.874.016.28.014.656-.106.026 1.574-.286.742-1.596 3.888-1.738 4.168-.142.28-.236.608-.046.968.19.36.284.58.568.896.284.316.596.706.85.948.284.27.578.564.99.976.412.412.412.686.612 1.144.2.458.1.858-.05 1.2-.15.342-1.346 3.24-1.346 3.24s-.092.352.144.538c.236.186.786.516 1.332.886.546.37 1.116.722 1.346.836.458.228.786.19 1.074-.116.288-.306 1.232-1.436 1.56-1.928.328-.492.656-.41 1.1-.244.45.166 2.842 1.342 3.33 1.586.486.244.81.366.928.572.12.206.12 1.192-.27 2.292z" />
  </svg>
);

const SearchOverlay = ({ results, query, onClose }) => {
  const handleOrderWhatsApp = (product) => {
    const url = getWhatsAppOrderUrl(product);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60]" data-testid="search-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Results panel */}
      <div className="relative max-w-2xl mx-auto mt-20 md:mt-24 mx-4 md:mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[70vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;<span className="text-[#2C1810] font-semibold">{query}</span>&rdquo;
            </p>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" data-testid="close-search-overlay">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Results list */}
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {results.length === 0 ? (
              <div className="px-6 py-16 text-center" data-testid="no-search-results">
                <p className="text-gray-400 text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>No products found</p>
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Try a different search term</p>
              </div>
            ) : (
              results.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FFF9FA] transition-colors" data-testid={`search-result-${product.id}`}>
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="12">No img</text></svg>'; }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      <Highlight text={product.category || ''} query={query} />
                    </p>
                    <p className="text-sm font-semibold text-[#2C1810] truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <Highlight text={product.name} query={query} />
                    </p>
                    <p className="text-xs text-gray-500 truncate" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      <Highlight text={product.description || ''} query={query} />
                    </p>
                  </div>

                  {/* Price + WhatsApp button */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-base font-bold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>₹{product.price}</span>
                    <button
                      onClick={() => handleOrderWhatsApp(product)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#1EBE5A] transition-all shadow-sm"
                      data-testid={`search-whatsapp-${product.id}`}
                    >
                      <WhatsAppIcon />
                      Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
