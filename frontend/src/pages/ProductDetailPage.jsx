import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProductById } from '../services/productService';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className="fill-current">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.862-2.48-1.862-4.73s1.178-3.356 1.596-3.814c.418-.458.912-.572 1.216-.572.304 0 .608.002.874.016.28.014.656-.106.026 1.574-.286.742-1.596 3.888-1.738 4.168-.142.28-.236.608-.046.968.19.36.284.58.568.896.284.316.596.706.85.948.284.27.578.564.99.976.412.412.412.686.612 1.144.2.458.1.858-.05 1.2-.15.342-1.346 3.24-1.346 3.24s-.092.352.144.538c.236.186.786.516 1.332.886.546.37 1.116.722 1.346.836.458.228.786.19 1.074-.116.288-.306 1.232-1.436 1.56-1.928.328-.492.656-.41 1.1-.244.45.166 2.842 1.342 3.33 1.586.486.244.81.366.928.572.12.206.12 1.192-.27 2.292z" />
  </svg>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">Product not found</p>
            <Link to="/" className="text-[#E8A0A8] hover:underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  // Product schema markup for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": { "@type": "Brand", "name": "Kridhani Jewels" },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": currentPrice,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://kridhanijewels.com/product/${product.id}`
    }
  };

  return (
    <div>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <div className="min-h-screen bg-[#FFF9FA] py-6 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#5D4037] hover:text-[#E8A0A8] mb-6 transition-colors" data-testid="back-to-home">
            <ChevronLeft size={18} /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" data-testid={`product-detail-${product.id}`}>
            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#F5E6E8] bg-white shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
                data-testid="product-detail-image"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-[#E8A0A8] font-semibold mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {product.category}
              </p>
              <h1 className="text-2xl md:text-4xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="product-detail-name">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-[#5D4037] leading-relaxed mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="product-detail-description">
                {product.description}
              </p>

              {/* Size selector */}
              {hasSizes && (
                <div className="mb-6" data-testid="product-detail-sizes">
                  <p className="text-sm font-semibold text-[#2C1810] mb-3" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Select Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                          selectedSize === s.size
                            ? 'border-[#E8A0A8] bg-[#E8A0A8] text-white shadow-md'
                            : 'border-[#F5E6E8] text-[#5D4037] hover:border-[#E8A0A8]'
                        }`}
                        data-testid={`detail-size-${s.size}`}
                      >
                        {s.size} — &#8377;{s.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <p className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-6" style={{ fontFamily: "'Nunito Sans', sans-serif" }} data-testid="product-detail-price">
                &#8377;{currentPrice}
              </p>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleOrderWhatsApp}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 bg-[#25D366] text-white text-base font-bold rounded-full shadow-lg hover:bg-[#1EBE5A] hover:shadow-xl transition-all duration-200"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                data-testid="product-detail-whatsapp-btn"
              >
                <WhatsAppIcon size={22} />
                Order on WhatsApp
              </button>

              {product.stock < 10 && (
                <p className="mt-4 text-sm text-red-500 font-semibold animate-pulse">Only a few left in stock!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
