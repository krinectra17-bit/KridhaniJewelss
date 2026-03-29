import React from 'react';
import { ShoppingCart, Zap, TrendingUp, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const showScarcity = product.stock < 10;

  return (
    <div className="bg-white rounded-2xl border border-[#F5E6E8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group" data-testid={`product-card-${product.id}`}>
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[#E8A0A8] text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
          ₹{product.price}
        </div>

        {/* Bestseller/Trending Badge */}
        {product.isBestseller && (
          <div className="absolute top-2 left-2 bg-[#DAA520] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <TrendingUp size={12} />
            Bestseller
          </div>
        )}
        {product.isTrending && !product.isBestseller && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Flame size={12} />
            Trending
          </div>
        )}

        {/* Scarcity Badge */}
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

        <h3 className="text-sm md:text-lg font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 md:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </h3>

        <p className="hidden md:block text-sm text-gray-600 line-clamp-1 mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          {product.description}
        </p>

        <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          ₹{product.price}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 border-2 border-[#E8A0A8] text-[#E8A0A8] text-xs md:text-sm font-semibold rounded-full hover:bg-[#E8A0A8] hover:text-white transition-all"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart size={14} className="md:w-4 md:h-4" />
            <span className="md:hidden">Add</span>
            <span className="hidden md:inline">Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white text-xs md:text-sm font-bold rounded-full shadow-md hover:shadow-xl transition-all"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            data-testid={`buy-now-${product.id}`}
          >
            <Zap size={14} className="md:w-4 md:h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;