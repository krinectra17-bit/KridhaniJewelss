import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop by Category
          </h2>
          <p className="text-sm md:text-base text-[#5D4037]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Explore our divine collection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#FFF9FA] p-8 md:p-12 rounded-2xl border-2 border-transparent hover:border-[#E8A0A8] hover:shadow-lg transition-all duration-300 cursor-pointer group"
              data-testid={`category-${category.id}`}
            >
              <h3 className="text-base md:text-lg font-medium text-center text-[#2C1810] group-hover:text-[#E8A0A8] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;