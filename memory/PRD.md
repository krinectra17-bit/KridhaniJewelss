# Kridhani Jewels — PRD

## Problem Statement
Complete e-commerce website for "Kridhani Jewels" — devotional jewelry brand selling shringar items for Radha Krishna and Laddu Gopal deities. Custom JWT admin panel, cart + WhatsApp checkout, dynamic product pages, categories filtering, New Arrivals, premium Soft Pink + White UI.

## User Preferences
- Language: Hinglish (mix of Hindi + English). Respond in Hinglish, English for technical specifics.
- Design: Premium, elegant, blush pink + white. Do NOT add heavy decorative elements to Hero/Footer without explicit ask.

## Environments
- PREVIEW (dev): https://divine-jewelry-shop.preview.emergentagent.com
- PRODUCTION: https://kridhanijewels.com (deployed; requires redeploy to push changes)

## Architecture
- Backend: FastAPI + MongoDB (Motor), JWT auth, /api prefixed routes, settings + orders + products.
- Frontend: React 18, Tailwind, React Router, Context API (Cart, Auth).

## Credentials
- Admin: krinectra@kridhanijewels.com / Krinectra@1708 (see test_credentials.md)

## Implemented
- Storefront, cart, WhatsApp checkout, product detail pages, categories, New Arrivals.
- MongoDB image storage, SEO hardening.
- Global Settings API + admin Seasonal (Janmashtami) toggle.
- 2026-06: Hero section premium redesign — timeless luxury blush-pink aesthetic. Generated soft 3D backdrop (drapery/petals/pearls/gold), glass feature cards, gold dividers, refined CTAs. Removed Janmashtami-specific hero styling (toran + conditional text). Kept exact copy and 2 CTA buttons (Shop Now, View All Categories). Only Hero.jsx changed.
- Fixed 3 bare-except lint errors in backend/server.py (product routes).

## Backlog
- P0: Emergent-managed Google Sign-in (call integration_expert before coding). NOT STARTED.
- P1: Email notifications for new orders.
- P1: Invoice PDF generation.
- P2: Bulk product upload (CSV import).

## Notes
- Auth = integration; always route through integration_expert before writing auth code.
- Janmashtami seasonal toggle still controls rest of site; hero is now timeless regardless.
