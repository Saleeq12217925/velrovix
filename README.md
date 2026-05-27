# Velrovix — Haute Héritage

Velrovix is a premium, full-stack cinematic e-commerce platform designed for luxury timepieces and haute fragrances. Built to mimic the digital storefronts of ultra-high-end fashion houses, it focuses on immersive UI/UX, robust security, and seamless state management.

## 🌟 Key Features
- **Cinematic UI/UX:** Built with React, Tailwind CSS, and Framer Motion for smooth, editorial-style page transitions and glassmorphic elements.
- **Dynamic "Mood" Engine:** Products can be curated and filtered by distinct aesthetics (Royal, Minimal, Bold).
- **Secure Authentication:** Custom JWT-based Auth flow with role-based access control (Admin vs Member).
- **The Control Console:** A fully bespoke Admin Dashboard for real-time inventory management, Cloudinary image uploading, and order fulfillment tracking.
- **Cart & Wishlist Architecture:** Persistent local state management with dynamic pricing calculations and a visually cohesive 3-step checkout flow.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion, Context API
- **Backend:** Node.js, Express, Mongoose, JSON Web Tokens (JWT)
- **Database & Storage:** MongoDB Atlas, Cloudinary
- **Security:** Helmet, Express Rate Limiter, CORS, Bcryptjs

## 📸 Platform Architecture
- **`/catalog`**: Advanced filtering logic by category, mood, and live search.
- **`/admin`**: Protected route strictly enforcing `isAdmin` middleware. Handles full CRUD operations for the product database.
- **`/orders`**: Dynamic post-purchase tracking mapping backend statuses to frontend visual milestones.
