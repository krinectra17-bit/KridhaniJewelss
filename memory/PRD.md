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
│   ├── server.py (FastAPI — auth, products, orders, payments, dashboard, tracking)
│   ├── .env (MONGO_URL, RAZORPAY keys)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.js (Routes: / /cart /checkout /categories /track-order /admin/*)
    │   ├── components/ (Navbar, WhatsAppButton, SearchOverlay, Footer, ProductCard, admin/, checkout/, ui/)
    │   ├── context/ (CartContext, AdminAuthContext, AuthContext)
    │   ├── pages/ (HomePage, CartPage, CheckoutPage, CategoriesPage, OrderTrackingPage, Admin pages)
    │   └── services/ (productService.js, orderService.js — axios API calls)
    └── .env (REACT_APP_BACKEND_URL, REACT_APP_RAZORPAY_KEY_ID)
```

## What's Implemented

### Storefront
- Home, Categories pages with product listings
- Real-time product search with debounce + highlighting
- **WhatsApp ordering** — "Order on WhatsApp" button on every product card (replaces Add to Cart/Buy Now)
- Pre-filled WhatsApp message with Product Name, Price, Category, Size, Link
- Floating WhatsApp contact button (+917357807298)
- Product size selector (per-size pricing)
- Sticky mobile CTA with WhatsApp order button

### Product Size Management
- Default sizes: 0, 0.5, 0.75, 1, 2, 3, 4, 5
- Custom sizes supported
- Each size has individual price
- Admin add/edit/remove sizes per product
- Size shown in cart, checkout, order details, admin orders

### Order Tracking
- Public page at /track-order
- Lookup by Order ID + Phone number
- Visual timeline with 7 steps (Order Placed → Delivered)
- Cancelled orders shown with red indicator
- Support email on tracking page

### Order Status Workflow
- 8 statuses: Order Placed, Confirmed, Processing, Packed, Shipped, Out for Delivery, Delivered, Cancelled
- Admin can update status with one click
- Changes reflect on customer tracking page

### Admin Panel (JWT-based)
- Login: admin@kridhanijewels.com / admin123
- Dashboard: orders, revenue, products, pending stats
- Products: Full CRUD with size management
- Orders: Expandable cards with item details, size info, 8-status workflow
- Protected routes with JWT auth

### Razorpay Payment
- Test mode: rzp_test_SeW6oqbjbZpQ7g
- Backend order creation + HMAC signature verification
- No COD — online payments only

### Contact Support
- Email: Kridhanijewels@gmail.com
- In footer (all pages), tracking page
- Clickable mailto links

## API Endpoints
- Auth: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Dashboard: GET /api/dashboard/stats (auth)
- Products: GET /api/products (public), POST/PUT/DELETE (auth)
- Orders: GET /api/orders (auth), PATCH /api/orders/{id}/status (auth)
- Order Tracking: POST /api/orders/track (public)
- Order Statuses: GET /api/orders/statuses (public)
- Payment: POST /api/payment/create-order, POST /api/payment/verify

## Credentials
- Admin: admin@kridhanijewels.com / admin123
- Razorpay Test: rzp_test_SeW6oqbjbZpQ7g

## Remaining / Future Tasks
- P1: Switch Razorpay to Live mode
- P2: Add more product seed data
- P3: Email notifications for new orders
