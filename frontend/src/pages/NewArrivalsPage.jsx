import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProducts();
        setProducts(all.filter(p => p.isNewArrival));
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    let list = category === 'all' ? [...products] : products.filter(p => p.category === category);
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort]);

  const visible = filtered.slice(0, visibleCount);
  const font = { fontFamily: "'Nunito Sans', sans-serif" };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="new-arrivals-page-title">
              New Arrivals
            </h1>
            <p className="text-sm md:text-base text-[#5D4037]" style={font}>
              Our latest handcrafted jewellery — freshly added to the collection
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8" data-testid="new-arrivals-filters">
            <div className="relative">
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setVisibleCount(12); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#F5E6E8] rounded-xl text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]/50"
                style={font}
                data-testid="category-filter"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D4037] pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#F5E6E8] rounded-xl text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]/50"
                style={font}
                data-testid="sort-filter"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D4037] pointer-events-none" />
            </div>
            <span className="text-xs text-[#5D4037] ml-auto" style={font}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="text-center py-20"><p className="text-gray-500">Loading...</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-[#E8A0A8] mb-4" />
              <p className="text-lg text-[#2C1810] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>No new arrivals yet</p>
              <p className="text-sm text-[#5D4037] mt-1" style={font}>Check back soon for fresh additions</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {visible.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {visibleCount < filtered.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount(v => v + 12)}
                    className="px-10 py-3 border-2 border-[#E8A0A8] text-[#E8A0A8] font-semibold rounded-full hover:bg-[#E8A0A8] hover:text-white transition-all"
                    style={font}
                    data-testid="load-more-btn"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
