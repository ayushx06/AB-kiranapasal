# Abhishek Kirana Pasal

Nepal's first digital kirana store experience for Pokhara: a mobile-first React storefront with phone OTP login, cart, checkout, live order tracking, admin operations, Firestore data, Cloudinary images, PDF invoices, and PWA support.

## Screenshots

Add screenshots in `public/` after branding and product photography are finalized.

## Prerequisites

- Node.js 20+
- Firebase project with Firestore, Auth, and Cloud Functions enabled
- Cloudinary unsigned upload preset
- eSewa merchant details and Khalti public key for production payments

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase browser API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket id |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender id |
| `VITE_FIREBASE_APP_ID` | Firebase web app id |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset |
| `VITE_ESEWA_MERCHANT_ID` | eSewa merchant code |
| `VITE_KHALTI_PUBLIC_KEY` | Khalti public key |
| `VITE_SHOP_PHONE` | Public shop phone number |
| `VITE_SHOP_WHATSAPP` | WhatsApp support number |
| `VITE_ADMIN_EMAIL` | Default admin login email display |

## Firebase Setup

Enable Phone Authentication for customers and Email/Password Authentication for admins. Firestore collections used by the app are `products`, `orders`, `customers`, `settings`, and `delivery_zones`. Deploy rules with:

```bash
firebase deploy --only firestore:rules
```

Create an admin by setting `customers/{uid}.isAdmin` to `true` after the admin user signs in once.

## Cloudinary Setup

Create an unsigned upload preset and add its name to `VITE_CLOUDINARY_UPLOAD_PRESET`. Product image uploads from the admin form store only secure Cloudinary URLs in Firestore.

## Payments

Cash on Delivery and Bank Transfer are ready for manual operation. eSewa redirects to the payment gateway with order details. Khalti expects the Khalti Checkout SDK to be loaded in production.

## Seed Data

```bash
export $(cat .env.local | xargs)
npm run seed
```

## Deployment

For Vercel:

```bash
npm run build
vercel --prod
```

For Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting,firestore:rules,functions
```

## Data Summary

- `products`: catalog, prices, inventory, images, active flags
- `orders`: customer order items, payment, delivery, status timeline
- `customers`: phone, profile, totals, admin flag
- `settings/shop`: opening status, delivery rules, banners, contacts
- `delivery_zones`: Pokhara zones, distance, charge, estimated minutes

## Contributing

Keep all secrets in `.env.local`, preserve mobile-first layouts, and test checkout, cart persistence, admin product edits, and order status updates before deploying.
