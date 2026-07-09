import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const CATEGORIES = [
  'Yugal Jodi Shringar',
  'Bal Radha Rani Shringar',
  'Laddu Gopal Shringar',
  'Jewelry',
  'Traditional'
];

const CategoriesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get('cat') || null;

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayCategories = activeCat ? [activeCat] : CATEGORIES;

  const groupedProducts = CATEGORIES.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeCat || 'All Categories'}
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {activeCat ? `Browse our ${activeCat} collection` : 'Explore our complete collection of divine jewelry and shringar items'}
            </p>
            {activeCat && (
              <button onClick={() => navigate('/categories')} className="mt-4 text-sm text-[#E8A0A8] hover:underline" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                ← View All Categories
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button onClick={() => navigate('/categories')} className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${!activeCat ? 'bg-[#E8A0A8] text-white border-[#E8A0A8]' : 'border-[#F5E6E8] text-[#5D4037] hover:border-[#E8A0A8]'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => navigate(`/categories?cat=${encodeURIComponent(c)}`)} className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${activeCat === c ? 'bg-[#E8A0A8] text-white border-[#E8A0A8]' : 'border-[#F5E6E8] text-[#5D4037] hover:border-[#E8A0A8]'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>{c}</button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                No Products Available
              </h3>
              <p className="text-base text-gray-600 mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Check back later for our divine collection
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Back to Home
              </a>
            </div>
          ) : (
            <>
              {displayCategories.map((category, index) => {
                const categoryProducts = groupedProducts[category];
                if (!categoryProducts || categoryProducts.length === 0) return null;

                return (
                  <div key={category} className="mb-12 md:mb-16">
                    <div className="mb-6 md:mb-8">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {category}
                      </h2>
                      <div className="w-20 h-1 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                      {categoryProducts.map((product, prodIndex) => {
                        const isFirst = prodIndex === 0;
                        const enhancedProduct = {
                          ...product,
                          isBestseller: isFirst && index % 2 === 0,
                          isTrending: isFirst && index % 2 === 1
                        };
                        return <ProductCard key={product.id} product={enhancedProduct} />;
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="text-center py-8">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  data-testid="back-to-top"
                >
                  Back to Top ↑
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;