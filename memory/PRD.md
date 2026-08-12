# Kridhani Jewels — Product Requirements Document

## Problem Statement
Create a complete e-commerce website for "Kridhani Jewels" — a devotional jewelry brand selling shringar items for Radha Krishna and Laddu Gopal deities.

## Core Requirements
- Custom JWT-based Admin Panel
- Shopping cart with WhatsApp checkout (collects customer details, sends formatted order on WhatsApp)
- Dynamic Product Detail Pages, Categories filtering, "New Arrivals" section
- Premium UI matching Kridhani Jewels brand (Soft Pink + White)
- Admin management for products, sizes, categories, theme toggles

## Tech Stack
React 18, Tailwind CSS, FastAPI, MongoDB (Motor), JWT Auth, React Router, Context API

## Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI, JWT Auth, MongoDB, GridFS/Binary Image Storage, Settings API)
│   ├── tests/
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/ (Hero, Navbar, ProductCard, CartItemRow, etc.)
    │   ├── pages/ (HomePage, CartPage, ProductDetailPage, FirebaseAdminProducts, FirebaseAdminSettings, etc.)
    │   ├── context/ (CartContext, AuthContext)
    │   ├── services/ (productService, orderService, settingsService)
    │   └── utils/ (whatsapp.js)
```

## DB Schema
- `users`: {email, password_hash, name, role}
- `products`: {name, price, originalPrice, image, category, description, sizes, isNewArrival, isBestseller, isTrending, stock}
- `orders`: {orderId, customerName, customerPhone, deliveryAddress, paymentMethod, items, totalAmount, status}
- `images`: MongoDB binary storage (base64 encoded, accessed via /api/images/{id})
- `settings`: {key: "site", isJanmashtamiThemeActive: bool, updatedAt}

## Key API Endpoints
- `POST /api/auth/login` — Admin login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `GET/POST/PUT/DELETE /api/products` — Product CRUD
- `GET/POST /api/orders` — Orders
- `GET /api/categories` — Categories
- `POST /api/upload/image` — Image upload (admin, 5MB limit)
- `GET /api/images/{id}` — Serve images from MongoDB
- `GET /api/settings` — Public site settings (theme toggle state)
- `PUT /api/settings` — Admin-only update site settings
- `GET /api/sitemap.xml` — SEO sitemap

## Completed Features (as of Aug 12, 2026)
- [x] Full storefront with Navbar, Hero, Categories, Products, Footer
- [x] Admin Panel: Dashboard, Products CRUD, Orders, Settings
- [x] Cart system + WhatsApp checkout (single & multi-item)
- [x] Dynamic Product Detail Pages with size/price variants
- [x] New Arrivals section with admin toggle
- [x] Clickable Category Cards
- [x] MongoDB persistent image storage (survives redeployments)
- [x] SEO: Sitemap, robots.txt, schema markup, alt tags
- [x] Security: Headers, rate limiting, secure cookies, upload auth
- [x] Favicon
- [x] Janmashtami Hero Theme (conditional, toggle-controlled)
- [x] Seasonal Theme Admin Toggle (Settings page)
- [x] Announcement bar restored to original text
- [x] Scroll-to-top on navigation
- [x] Terms & Conditions page
- [x] Code quality refactoring

## Backlog
- [ ] P2: Email notifications for new orders
- [ ] P2: Invoice PDF generation
