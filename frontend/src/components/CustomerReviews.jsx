import React from 'react';
import { Star, BadgeCheck } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      initial: 'P',
      rating: 5,
      review: 'Very सुंदर jewellery, quality amazing! Perfect for my Laddu Gopal ji 🙏',
      date: '2 weeks ago'
    },
    {
      name: 'Radhika Jain',
      location: 'Jaipur',
      initial: 'R',
      rating: 5,
      review: 'Packaging was premium and delivery was fast. Highly recommend!',
      date: '1 month ago'
    },
    {
      name: 'Neha Gupta',
      location: 'Delhi',
      initial: 'N',
      rating: 5,
      review: 'Perfect for Radha Krishna ji. Handmade quality is visible ✨',
      date: '3 weeks ago'
    },
    {
      name: 'Meera Patel',
      location: 'Ahmedabad',
      initial: 'M',
      rating: 5,
      review: 'Beautiful kundan work! My family loved it. Worth every penny 💕',
      date: '1 week ago'
    },
    {
      name: 'Anjali Verma',
      location: 'Pune',
      initial: 'A',
      rating: 5,
      review: 'Best quality shringar items! Will order again for sure 🌸',
      date: '4 days ago'
    },
    {
      name: 'Kavita Singh',
      location: 'Lucknow',
      initial: 'K',
      rating: 5,
      review: 'Lightweight and elegant. Perfect for daily puja. Thank you! 🙏',
      date: '5 days ago'
    }
  ];

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-5xl font-bold text-[#2C1810] mb-3 md:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-1 md:gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={`star-${i}`} size={16} className="md:w-5 md:h-5 text-[#E8A0A8] fill-[#E8A0A8]" />
            ))}
          </div>
          <p className="text-xs md:text-base text-[#5D4037] mb-1 md:mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            4.9/5 from 1000+ reviews
          </p>
          <p className="text-xs md:text-base text-[#E8A0A8] font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Loved by devotees across India 💕
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-[#FDF2F8] p-6 rounded-2xl border-2 border-[#F5E6E8] hover:border-[#E8A0A8] transition-all duration-300"
              data-testid={`review-${review.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E8A0A8]/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#E8A0A8]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {review.initial}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      {review.name}
                    </p>
                    <BadgeCheck size={16} className="text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {review.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={`star-${review.name}-${i}`} size={14} className="text-[#E8A0A8] fill-[#E8A0A8]" />
                ))}
              </div>

              <p className="text-sm text-gray-600 italic mb-3 leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                "{review.review}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {review.date}
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;