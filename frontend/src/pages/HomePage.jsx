import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import InstagramSection from '../components/InstagramSection';
import Footer from '../components/Footer';
import StickyMobileCTA from '../components/StickyMobileCTA';
import { ShoppingBag } from 'lucide-react';
import { getProducts } from '../services/productService';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Navbar />
      <Hero />
      <SocialProof />
      <Categories />

      {/* Products Section */}
      <section id="products" className="py-8 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-5xl font-bold text-[#2C1810] mb-2 md:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Collection
            </h2>
            <p className="text-xs md:text-base text-[#5D4037]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Premium devotional items for your deities
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 md:py-24 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E8A0A8]/10 flex items-center justify-center">
                <ShoppingBag size={40} className="text-[#E8A0A8]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                No Products Yet
              </h3>
              <p className="text-base text-gray-600 mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Our beautiful collection is coming soon. Check back later for divine jewelry and shringar items.
              </p>
              <a
                href="/#contact"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-full"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                Contact Us
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <CustomerReviews />
      <InstagramSection />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default HomePage;
