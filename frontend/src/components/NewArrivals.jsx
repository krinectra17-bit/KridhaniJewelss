import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';

const NewArrivals = () => {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProducts();
        setItems(all.filter(p => p.isNewArrival).slice(0, 8));
      } catch {}
    };
    load();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-8 md:py-16 bg-[#FFF9FA]" data-testid="new-arrivals-section">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>
              New Arrivals
            </h2>
            <p className="text-xs md:text-sm text-[#5D4037] mt-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Discover our latest handcrafted jewellery collection
            </p>
          </div>
          <Link
            to="/new-arrivals"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#E8A0A8] hover:text-[#D8909C] transition-colors"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            data-testid="view-all-new-arrivals"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile swipeable */}
        <div
          ref={scrollRef}
          className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map(p => (
            <div key={p.id} className="snap-start flex-shrink-0" style={{ width: '78vw' }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="md:hidden text-center mt-4">
          <Link
            to="/new-arrivals"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8A0A8]"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            View All New Arrivals <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
