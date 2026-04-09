import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

const SearchOverlay = ({ results, query, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    addToCart(product);
    onClose();
    navigate('/checkout');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
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
              {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="text-[#2C1810] font-semibold">{query}</span>"
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

                  {/* Price + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-base font-bold text-[#2C1810]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>₹{product.price}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-1.5 border border-[#E8A0A8] text-[#E8A0A8] rounded-lg hover:bg-[#E8A0A8] hover:text-white transition-colors"
                        title="Add to Cart"
                        data-testid={`search-add-cart-${product.id}`}
                      >
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="p-1.5 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white rounded-lg hover:shadow-md transition-all"
                        title="Buy Now"
                        data-testid={`search-buy-now-${product.id}`}
                      >
                        <Zap size={14} />
                      </button>
                    </div>
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
