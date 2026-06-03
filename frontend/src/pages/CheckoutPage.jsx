import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderSuccess from '../components/checkout/OrderSuccess';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedTotal, setSavedTotal] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const total = getCartTotal();
      setSavedTotal(total);

      const items = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.selectedSize || null
      }));

      // 1. Create Razorpay order on backend
      const razorpayOrder = await createRazorpayOrder({
        totalAmount: total,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        items
      });

      // 2. Open Razorpay checkout popup
      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Kridhani Jewels',
        description: `Order: ${items.map(i => `${i.productName} x${i.quantity}`).join(', ')}`.substring(0, 255),
        order_id: razorpayOrder.orderId,
        handler: async (response) => {
          // 3. Verify payment on backend
          try {
            const result = await verifyPaymentAndCreateOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerName: formData.customerName,
              customerPhone: formData.customerPhone,
              deliveryAddress: formData.deliveryAddress,
              items,
              totalAmount: total
            });

            setOrderSuccess(result);
            clearCart();
          } catch (verifyErr) {
            console.error('Payment verification failed', verifyErr);
            setErrors({ payment: 'Payment verification failed. Please contact support with your payment ID.' });
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail || '',
          contact: formData.customerPhone
        },
        notes: {
          delivery_address: formData.deliveryAddress.substring(0, 255)
        },
        theme: {
          color: '#E8A0A8'
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setSubmitting(false);
        setErrors({
          payment: `Payment failed: ${response.error.description || 'Something went wrong'}. Please try again.`
        });
      });
      rzp.open();
    } catch (error) {
      console.error('Checkout failed', error);
      setErrors({ payment: 'Could not initiate payment. Please try again.' });
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return <OrderSuccess orderData={orderSuccess} cartTotal={savedTotal} />;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#FFF9FA] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2C1810] mb-8 md:mb-12" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CheckoutForm
              formData={formData}
              errors={errors}
              submitting={submitting}
              onFieldChange={handleChange}
              onSubmit={handleSubmit}
            />
            <OrderSummary cart={cart} cartTotal={getCartTotal()} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
