# Kridhani Jewels - Product Requirements Document

## Original Problem Statement
Build a complete e-commerce website for "Kridhani Jewels" - a devotional jewelry brand selling shringar items for Radha Krishna and Laddu Gopal deities. Customer-facing storefront + secure Admin Panel.

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Lucide React
- **Backend**: FastAPI + MongoDB (sole data layer)
- **Payments**: Razorpay (test mode)
- **Auth**: JWT with httpOnly cookies

## Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI — auth, products, orders, payments, dashboard)
│   ├── .env (MONGO_URL, RAZORPAY keys)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.js (Routes: / /cart /checkout /categories /admin/*)
    │   ├── components/ (Navbar, WhatsAppButton, SearchOverlay, admin/, checkout/, ui/)
    │   ├── context/ (CartContext, AdminAuthContext, AuthContext)
    │   ├── pages/ (HomePage, CartPage, CheckoutPage, CategoriesPage, Admin pages)
    │   └── services/ (productService.js, orderService.js — axios API calls)
    └── .env (REACT_APP_BACKEND_URL, REACT_APP_RAZORPAY_KEY_ID)
```

## What's Implemented

### Storefront ✅
- Home, Categories, Cart, Checkout pages
- Mobile-responsive with sticky CTA
- Real-time product search with debounce + text highlighting
- Floating WhatsApp button (+917357807298)

### Admin Panel ✅ (JWT-based, NO Firebase)
- Login: admin@kridhanijewels.com / admin123
- Dashboard: orders, revenue, products, pending stats + recent orders
- Products: Full CRUD (Add/Edit/Delete)
- Orders: View all, update status
- Protected routes with JWT auth
- Admin sidebar navigation

### Razorpay Payment ✅
- Test mode: rzp_test_SeW6oqbjbZpQ7g
- Backend order creation + HMAC signature verification
- Checkout.js popup with dynamic cart total
- No COD — online payments only

### Data Flow
- Products: Admin adds via /admin/products → MongoDB → Storefront reads from /api/products
- Orders: Customer checkout → Razorpay → /api/payment/verify → MongoDB → Admin views at /admin/orders
- Auth: JWT cookie via /api/auth/login

## Admin Credentials
- Email: admin@kridhanijewels.com
- Password: admin123

## Remaining / Future Tasks
- P1: Switch Razorpay to Live mode for production
- P2: Add more product categories and seed data
- P3: Customer order tracking page
- P3: Email notifications for new orders
