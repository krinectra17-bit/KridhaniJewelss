import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Instagram, Menu, X, Search, MapPin, ShoppingCart } from 'lucide-react';
import { getProducts } from '../services/productService';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Load products once when search is first opened
  const loadProducts = useCallback(async () => {
    if (productsLoaded) return;
    try {
      const data = await getProducts();
      setAllProducts(data);
      setProductsLoaded(true);
    } catch (err) {
      console.error('Failed to load products for search', err);
    }
  }, [productsLoaded]);

  // Filter products with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, allProducts]);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen) {
      loadProducts();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen, loadProducts]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const scrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
    <div className="bg-[#d4af37] text-white text-center py-2 px-4 text-sm font-semibold">
  🎉 Grand Launch Offer! Flat 25% OFF on all handcrafted jewellery. Order via WhatsApp. Limited Time Offer!
</div>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-base md:text-lg font-bold uppercase tracking-wide text-[#2C1810]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  KRIDHANI JEWELS
                </span>
                <span className="text-xs text-[#E8A0A8]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Divine Elegance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Home
              </Link>
              <button onClick={() => scrollToSection('products')} className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Products
              </button>
              <Link to="/categories" className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Categories
              </Link>
              <Link to="/track-order" className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Track Order
              </Link>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-[#2C1810] hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Contact
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search trigger */}
              <button onClick={openSearch} className="p-1.5 hover:bg-[#FFF5F7] rounded-full transition-colors" data-testid="search-trigger-btn" aria-label="Search products">
                <Search size={20} className="text-[#2C1810]" />
              </button>

              <Link to="/track-order" className="p-1.5 hover:bg-[#FFF5F7] rounded-full transition-colors md:hidden" data-testid="track-order-icon" aria-label="Track order">
                <MapPin size={20} className="text-[#2C1810]" />
              </Link>

              <Link to="/cart" className="relative p-1.5 hover:bg-[#FFF5F7] rounded-full transition-colors" data-testid="cart-icon" aria-label="Shopping cart">
                <ShoppingCart size={20} className="text-[#2C1810]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E8A0A8] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-count-badge">
                    {cartCount}
                  </span>
                )}
              </Link>

              <a href="tel:+917357807298" className="hidden md:block" data-testid="phone-link">
                <Phone size={20} className="text-[#2C1810]" />
              </a>

              <a href="https://instagram.com/kridhani_jewels_" target="_blank" rel="noopener noreferrer" className="hidden md:block" data-testid="instagram-link">
                <Instagram size={20} className="text-[#2C1810]" />
              </a>

              <button onClick={() => setIsMenuOpen(true)} className="md:hidden" data-testid="hamburger-menu">
                <Menu size={24} className="text-[#2C1810]" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable search bar (slides down under navbar) */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 md:px-6 py-3 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-2xl mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewelry, shringar, dresses..."
                className="w-full pl-11 pr-10 py-3 bg-[#FFF9FA] border border-[#F5E6E8] rounded-xl text-sm text-[#2C1810] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]/50 focus:border-[#E8A0A8] shadow-sm transition-shadow focus:shadow-md"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                data-testid="search-input"
              />
              <button
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                data-testid="close-search-btn"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Search results overlay */}
      {searchOpen && searchQuery.trim().length > 0 && (
        <SearchOverlay results={searchResults} query={searchQuery} onClose={closeSearch} />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onScrollToSection={scrollToSection}
      />
    </>
  );
};

export default Navbar;
