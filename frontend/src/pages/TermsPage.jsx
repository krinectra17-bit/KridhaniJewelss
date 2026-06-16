import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    title: '1. Prepaid Orders Only',
    items: [
      'We accept prepaid orders only.',
      'Cash on Delivery (COD) is not available.',
      'Orders are processed only after successful payment.',
    ],
  },
  {
    title: '2. No Return Policy',
    items: [
      'No returns will be accepted after purchase.',
      'Customers are requested to review product details carefully before placing an order.',
    ],
  },
  {
    title: '3. No Exchange Policy',
    items: [
      'No exchanges will be provided under any circumstances.',
      'All sales are final.',
    ],
  },
  {
    title: '4. Product Information',
    items: [
      'Product images are displayed as accurately as possible.',
      'Slight variations in color, size, or appearance may occur due to lighting, photography, or screen settings.',
    ],
  },
  {
    title: '5. Shipping & Delivery',
    items: [
      'Delivery timelines are estimates and may vary by location.',
      'We are not responsible for courier delays caused by third-party shipping partners.',
    ],
  },
  {
    title: '6. Order Cancellation',
    items: [
      'Orders cannot be cancelled once dispatched.',
      'We reserve the right to cancel any order due to stock issues, pricing errors, or unforeseen circumstances.',
    ],
  },
  {
    title: '7. Pricing',
    items: [
      'Prices may change without prior notice.',
      'In case of pricing errors, we reserve the right to cancel the order and issue a refund if payment has already been received.',
    ],
  },
  {
    title: '8. Intellectual Property',
    items: [
      'All website content, images, logos, product photos, and designs are the property of Kridhani Jewels and may not be copied or used without permission.',
    ],
  },
  {
    title: '9. Limitation of Liability',
    items: [
      'Kridhani Jewels shall not be liable for indirect, incidental, or consequential damages arising from the use of the website or products.',
    ],
  },
  {
    title: '10. Governing Law',
    items: [
      'These Terms & Conditions are governed by the laws of India.',
    ],
  },
];

const TermsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1
            className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="terms-page-title"
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-[#5D4037] mb-10" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <p className="text-sm text-[#5D4037] leading-relaxed mb-8" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Welcome to Kridhani Jewels. By accessing our website and placing an order, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} data-testid={`terms-section-${section.title.split('.')[0].trim()}`}>
                <h2 className="text-lg font-bold text-[#2C1810] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {section.title}
                </h2>
                <ul className="space-y-2 pl-5 list-disc">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-[#5D4037] leading-relaxed" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#F5E6E8]">
            <p className="text-sm text-[#5D4037]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              If you have any questions regarding these terms, please contact us at{' '}
              <a href="mailto:Kridhanijewels@gmail.com" className="text-[#E8A0A8] hover:underline">
                Kridhanijewels@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
