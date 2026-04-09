# Kridhani Jewels - Product Requirements Document

## Original Problem Statement
Build a complete e-commerce website for "Kridhani Jewels" - a devotional jewelry brand selling shringar items for Radha Krishna and Laddu Gopal deities. The app requires a customer-facing storefront (React, Tailwind CSS) and a secure Admin Panel with Firebase Integration (Authentication, Firestore, and Storage).

## User Personas
1. **Customers** - Browse products, add to cart, checkout with COD/UPI
2. **Admin** - Manage products, orders, view dashboard analytics

## Core Requirements
- Responsive storefront with Home, Categories, Cart, and Checkout pages
- Clean, premium "Soft Pink + White" theme
- Firebase-integrated Admin Panel with secure login (Email/Password)
- Admin dashboard displaying orders, products, and revenue
- Product management (Add/Edit/Delete) with image uploads
- Order management (View details, Update status)

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Shadcn/UI, Lucide React icons
- **Backend**: FastAPI + MongoDB (legacy, mostly replaced by Firestore for admin features)
- **Firebase**: Authentication, Firestore, Storage (primary data layer for products & orders)

## Architecture
```
/app/
├── backend/
│   ├── server.py (FastAPI - legacy MongoDB API)
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.js (Routes)
    │   ├── firebase.js (Firebase init with user-provided config)
    │   ├── components/
    │   │   ├── admin/ (AdminLayout, StatCard, RecentOrdersTable)
    │   │   ├── checkout/ (CheckoutForm, OrderSummary, OrderSuccess)
    │   │   └── ui/ (Navbar, Hero, ProductCard, etc.)
    │   ├── context/ (CartContext, AdminAuthContext, AuthContext)
    │   ├── pages/ (HomePage, CartPage, CheckoutPage, CategoriesPage, FirebaseAdmin*)
    │   └── services/ (productService.js, orderService.js - Firestore)
    └── public/
        └── setup-admin.html (Firebase admin user setup utility)
```

## Data Flow
- **Products**: Admin adds via Firebase Admin Panel → Firestore → Public storefront reads from Firestore
- **Orders**: Customer checkout → Firestore → Admin views in Firebase Admin Panel
- **Auth**: Firebase Authentication (Email/Password) for admin access

## What's Implemented (Feb 2026)

### Phase 1: Storefront ✅
- Home page with hero, social proof, categories, products, reviews, footer
- Categories page with products grouped by category
- Cart with localStorage persistence
- Checkout with form validation, COD/UPI payment options
- Mobile-responsive design with sticky CTA
- **Real-time product search** with debounce, text highlighting, add-to-cart from results
- **Floating WhatsApp contact button** (visible on all public pages, hidden on admin)

### Phase 2: Firebase Admin Panel ✅
- Firebase Authentication login (admin@kridhani.com)
- Protected admin routes with redirect
- Dashboard with real-time stats (orders, revenue, products, pending)
- Product CRUD (Add/Edit/Delete with image upload to Firebase Storage)
- Order management (View details, Update status)
- Settings page with account info
- Admin sidebar with navigation

### Phase 3: Data Unification ✅
- Storefront reads products from Firestore (not MongoDB)
- Checkout saves orders to Firestore (not MongoDB)
- Admin dashboard shows real-time Firestore data

### Phase 4: Code Quality ✅
- Refactored CheckoutPage into CheckoutForm, OrderSummary, OrderSuccess components
- Refactored Dashboard into StatCard, RecentOrdersTable components
- Cleaned up console logging noise
- Removed old MongoDB admin routes (redirected to Firebase admin)
- Added data-testid attributes throughout
- Error handling for Firestore index issues

## Firebase Config
- Project: kridhani-jewels
- Auth: Email/Password enabled
- Firestore: products, orders collections
- Storage: Product images

## Admin Credentials
- Email: admin@kridhani.com
- Password: admin123

## Remaining / Future Tasks
- P2: Add more product categories and seed data
- P3: Add customer order tracking
- P3: Configure Firestore security rules for production
- P3: Move Firebase config to environment variables for deployment flexibility
