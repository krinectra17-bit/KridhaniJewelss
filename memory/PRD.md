# Kridhani Jewels - Product Requirements Document

## Original Problem Statement
Build a complete e-commerce website for "Kridhani Jewels" - a devotional jewelry brand selling shringar items for Radha Krishna and Laddu Gopal deities. Customer-facing storefront + secure Admin Panel.

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Lucide React
- **Backend**: FastAPI + MongoDB (sole data layer)
- **Payments**: Razorpay (test mode — DO NOT switch to live)
- **Auth**: JWT with httpOnly cookies

## Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI — auth, products, orders, payments, dashboard, tracking)
│   ├── tests/ (Pytest test suite)
│   ├── .env (MONGO_URL, RAZORPAY keys, JWT_SECRET, ADMIN creds)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.js (Routes)
    │   ├── components/ (Navbar, MobileMenu, SearchOverlay, Footer, ProductCard, CartItemRow, WhatsAppButton, admin/SizeManager, admin/AdminLayout, etc.)
    │   ├── context/ (CartContext, AdminAuthContext, AuthContext)
    │   ├── pages/ (HomePage, CartPage, CheckoutPage, CategoriesPage, OrderTrackingPage, FirebaseAdmin* pages)
    │   ├── services/ (productService.js, orderService.js)
    │   └── utils/ (whatsapp.js)
    └── .env (REACT_APP_BACKEND_URL, REACT_APP_RAZORPAY_KEY_ID)
```

## What's Implemented

### Storefront
- Home, Categories pages with product listings
- Real-time product search with debounce + highlighting
- WhatsApp ordering — "Order on WhatsApp" button on every product card
- Product size selector (per-size pricing)
- Floating WhatsApp contact button

### Admin Panel (JWT-based)
- Login: krinectra@kridhanijewels.com / Krinectra@1708
- Dashboard: orders, revenue, products, pending stats
- Products: Full CRUD with SizeManager component
- Orders: Expandable cards with item details, 8-status workflow
- Settings page

### Order Tracking
- Public page at /track-order
- Lookup by Order ID + Phone number
- Visual timeline with 7 steps

### Razorpay Payment (Test Mode)
- Backend order creation + HMAC signature verification

### Code Quality Refactoring (June 2026)
- Extracted MobileMenu from Navbar.jsx
- Extracted SizeManager from FirebaseAdminProducts.jsx (also fixed array index keys)
- Extracted CartItemRow from CartPage.jsx
- Refactored send_order_notification into _log_order_to_console + _build_order_email_html
- Removed hardcoded secrets from server.py and test files
- Fixed stale test credentials in test_size_order_tracking.py
- Deleted unused AdminDashboard.jsx (dead code)
- Fixed React key warning in RecentOrdersTable.jsx

### Cart + WhatsApp Checkout System (June 2026)
- "Add to Cart" button on every product card and detail page
- Cart icon in navbar with real-time item count badge
- Cart page with delivery details form (Name, Phone, Address, Landmark, PIN)
- "Place Order on WhatsApp" generates formatted multi-product order message
- Cart persists in localStorage, clears after checkout
- Both "Add to Cart" and "Buy Now on WhatsApp" (single product) available

### Product Detail Page (June 2026)
- Clickable product cards navigate to /product/:id
- Full product detail view with large image, name, description, sizes with prices, WhatsApp order button
- "Back to Shop" navigation link
- Reuses existing WhatsApp ordering flow and styles

### SEO Optimization (June 2026)
- Dynamic sitemap at /api/sitemap.xml with all pages and product URLs
- robots.txt with Sitemap directive, blocks /admin/, /cart, /checkout
- Homepage: unique meta description, keywords, canonical URL, Open Graph + Twitter meta tags
- Organization JSON-LD schema on all pages (via index.html)
- Product JSON-LD schema on product detail pages
- All images have descriptive alt text

## API Endpoints
- Auth: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
- Dashboard: GET /api/dashboard/stats (auth)
- Products: GET /api/products (public), POST/PUT/DELETE (auth)
- Orders: GET /api/orders (auth), PATCH /api/orders/{id}/status (auth)
- Order Tracking: POST /api/orders/track (public)
- Order Statuses: GET /api/orders/statuses (public)
- Payment: POST /api/payment/create-order, POST /api/payment/verify

## Remaining / Future Tasks
- P2: Email notifications for new orders (SendGrid)
- P2: Invoice PDF generation
- P2: Product image file upload via API (currently URL-based)
- P3: Advanced analytics in Admin dashboard
- P3: SEO optimizations
