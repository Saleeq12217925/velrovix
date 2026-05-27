# Velrovix — Full Project Implementation Roadmap

> A luxury cinematic e-commerce platform for premium watches and fragrances.
> Tech Stack: React + Vite + Tailwind + Framer Motion · Node.js + Express + MongoDB

---

## Legend
- ✅ Done
- 🟡 Skeleton only (UI exists, no logic)
- 🔲 Not started yet

---

## Phase 1 — Project Setup & Architecture
**Goal**: Scaffold the project, install all dependencies, configure design tokens, establish base routing.

### Backend ✅
- [x] `backend/package.json` — express, mongoose, helmet, cors, dotenv, bcryptjs, jsonwebtoken, multer, cloudinary, passport
- [x] `backend/server.js` — Express app with helmet, cors, json parser, rate limiter
- [x] `backend/config/db.js` — MongoDB connection with status listeners
- [x] `backend/middleware/errorMiddleware.js` — Global notFound + errorHandler
- [x] `backend/models/Product.js` — Full product schema (name, slug, price, category, mood, images, specs)
- [x] `backend/controllers/productController.js` — getProducts, getProductBySlug
- [x] `backend/routes/productRoutes.js` — GET `/`, GET `/:slug`
- [x] `backend/utils/seeder.js` — Sample luxury products seed data
- [x] `backend/.env` — PORT, MONGO_URI, JWT_SECRET, CLOUDINARY keys, GOOGLE keys

### Frontend ✅
- [x] `frontend/` — Vite + React 18 scaffolded
- [x] `frontend/package.json` — react-router-dom, framer-motion, axios, lucide-react, tailwindcss
- [x] `frontend/tailwind.config.js` — Custom luxury tokens (luxury-black, luxury-accent, luxury-cream, etc.)
- [x] `frontend/postcss.config.js`
- [x] `frontend/index.html` — SEO meta tags, title, font preconnect
- [x] `frontend/src/index.css` — Fonts (Cormorant, Inter), scrollbar, glass utilities
- [x] `frontend/src/main.jsx` — DOM mount
- [x] `frontend/src/App.jsx` — Loader (2.2s), BrowserRouter, AnimatePresence
- [x] `frontend/src/routes/AppRoutes.jsx` — All routes + wildcard 404
- [x] `frontend/src/pages/NotFound.jsx` — Cinematic 404 page

### Reusable Components ✅
- [x] `components/common/Button.jsx` — gold, outline, dark variants
- [x] `components/common/SectionTitle.jsx` — Serif heading + gold divider
- [x] `components/common/Loader.jsx` — Full-screen breathing logo entry
- [x] `components/common/AnimatedText.jsx` — Word-by-word Framer Motion reveal
- [x] `components/layout/Navbar.jsx` — Glassmorphic floating header, mobile drawer
- [x] `components/layout/Footer.jsx` — Editorial footer + newsletter form
- [x] `components/product/ProductCard.jsx` — Zoom hover, badges, wishlist/cart buttons
- [x] `components/product/MoodCard.jsx` — Full-bleed image card with overlay text

### Pages (Skeletons) 🟡
- [x] `pages/Home.jsx` — Full cinematic layout using static mock data
- [x] `pages/Catalog.jsx` — Skeleton placeholder
- [x] `pages/ProductDetails.jsx` — Skeleton placeholder
- [x] `pages/Login.jsx` — Form UI only, no logic
- [x] `pages/Register.jsx` — Form UI only, no logic
- [x] `pages/Cart.jsx` — Empty state placeholder
- [x] `pages/Wishlist.jsx` — Empty state placeholder
- [x] `pages/Profile.jsx` — Placeholder with mock info
- [x] `pages/AdminDashboard.jsx` — Stats cards placeholder

---

## Phase 2 — UI Foundation & Context System
**Goal**: Wire up global state (cart, wishlist, auth) and connect the homepage to the live backend.

### Backend 🔲
- [ ] `backend/routes/productRoutes.js` — Add featured, bestseller, newArrival query endpoints
- [ ] Seed the database using `seeder.js`

### Frontend 🔲
- [ ] `src/utils/api.js` — Axios instance with `baseURL: http://localhost:5000/api`
- [ ] `src/context/AuthContext.jsx` — `user`, `token`, `login()`, `logout()`, persist to localStorage
- [ ] `src/context/CartContext.jsx` — `cart[]`, `addToCart()`, `removeFromCart()`, `updateQty()`, `cartCount`, `cartTotal`
- [ ] `src/context/WishlistContext.jsx` — `wishlist[]`, `toggleWishlist()`, `isWishlisted()`
- [ ] Wrap all contexts in `App.jsx` (AuthProvider → CartProvider → WishlistProvider)
- [ ] `Navbar.jsx` — Connect cart badge and wishlist badge to real Context counts
- [ ] `Home.jsx` — Replace mock data with real Axios calls to `/api/products?featured=true`, `/api/products?bestseller=true`
- [ ] `ProductCard.jsx` — Connect heart button to WishlistContext `toggleWishlist()`

**Concepts taught**: Context API, useContext, localStorage persistence, Axios instance, useEffect data fetching

---

## Phase 3 — Authentication System
**Goal**: Full JWT-based registration, login, and Google OAuth. Protect frontend routes.

### Backend 🔲
- [ ] `backend/models/User.js` — name, email, password (hashed), role, googleId, avatar, wishlist[]
- [ ] `backend/middleware/authMiddleware.js` — `protect` (JWT verify), `adminOnly` (role check)
- [ ] `backend/utils/tokens.js` — `generateToken(userId)` using JWT sign
- [ ] `backend/services/authService.js` — hashPassword, comparePassword, generateTokenPair
- [ ] `backend/controllers/authController.js` — `signup`, `login`, `getMe`, `logout`
- [ ] `backend/routes/authRoutes.js` — POST `/signup`, POST `/login`, GET `/me`
- [ ] `backend/config/passport.js` — Google OAuth strategy setup
- [ ] Mount `/api/auth` in `server.js`
- [ ] `backend/routes/authRoutes.js` — Add Google OAuth routes (GET `/google`, GET `/google/callback`)

### Frontend 🔲
- [ ] `AuthContext.jsx` — Full implementation: POST to `/api/auth/login`, store token in localStorage
- [ ] `Login.jsx` — Real form: email + password → POST → save token → redirect to home
- [ ] `Register.jsx` — Real form: name + email + password → POST → auto-login → redirect
- [ ] `routes/ProtectedRoute.jsx` — If no token in AuthContext, redirect to `/login`
- [ ] `routes/AdminRoute.jsx` — If user.role !== 'admin', redirect to home
- [ ] Apply `ProtectedRoute` to: `/profile`, `/wishlist`, `/cart`, `/checkout`
- [ ] Apply `AdminRoute` to: `/admin`
- [ ] Google OAuth button in Login page

**Concepts taught**: JWT flow, bcrypt hashing, protected routes, localStorage token, role-based access

---

## Phase 4 — Product Catalog System
**Goal**: Full working editorial catalog with real data, search, filters, and immersive product detail pages.

### Backend 🔲
- [ ] `productController.js` — Add `searchProducts` with regex on name/description
- [ ] `productController.js` — Add `getRelatedProducts(slug)` by matching mood + different category
- [ ] Add text search index on Product model: `name`, `description`, `tags`

### Frontend 🔲
- [ ] `Catalog.jsx` — Full implementation:
  - Fetch `/api/products` with query params from URL
  - Display ProductCard grid with loading skeletons
  - Filter sidebar: Category (Watches/Perfumes), Mood chips, Price range slider
  - Search bar with debounce (wait 400ms before firing API call)
  - Sort by: newest, price low-high, price high-low
- [ ] `ProductDetails.jsx` — Full cinematic implementation:
  - Fullscreen hero image gallery with thumbnail switcher
  - Product name, price, mood tag, description
  - `richDescription` storytelling block
  - `specifications` map rendered as elegant key-value pairs
  - Fragrance notes visualizer for perfumes (animated bars for Top/Heart/Base)
  - Watch specs grid for watches
  - Add to Cart button (connected to CartContext)
  - Add to Wishlist button (connected to WishlistContext)
  - Related products section at bottom
- [ ] `components/product/FragranceNotes.jsx` — Animated bar chart for perfume notes
- [ ] `components/product/ProductGallery.jsx` — Multi-image smooth gallery switcher
- [ ] `components/product/SpecsGrid.jsx` — Key-value specs display for watches
- [ ] `components/common/SearchBar.jsx` — Debounced search input with gold styling

**Concepts taught**: URL query params, debounce, dynamic routing with `useParams`, conditional component rendering

---

## Phase 5 — Wishlist System
**Goal**: Wishlist fully functional across the app, synced with backend when logged in.

### Backend 🔲
- [ ] `backend/controllers/wishlistController.js` — `getWishlist`, `toggleWishlist`
- [ ] `backend/routes/wishlistRoutes.js` — GET `/`, POST `/:productId`
- [ ] Both routes protected with `authMiddleware.protect`
- [ ] Mount `/api/wishlist` in `server.js`

### Frontend 🔲
- [ ] `WishlistContext.jsx` — When logged in: sync toggles with `POST /api/wishlist/:id`; when guest: use localStorage
- [ ] `Wishlist.jsx` — Full page: grid of wishlisted ProductCards with remove button
- [ ] `ProductCard.jsx` — Heart icon shows filled state when product is in wishlist
- [ ] `ProductDetails.jsx` — Wishlist button integrated

**Concepts taught**: Optimistic UI (update state before API confirms), guest vs authenticated flows

---

## Phase 6 — Cart & Checkout
**Goal**: Full add-to-cart system with slide drawer, quantities, and fake checkout confirmation.

### Backend 🔲
- [ ] `backend/controllers/orderController.js` — `createOrder` (decrement stock, save order)
- [ ] `backend/models/Order.js` — user, items[], totalPrice, shippingAddress, status, paymentResult
- [ ] `backend/routes/orderRoutes.js` — POST `/` (create order), GET `/my-orders`
- [ ] Mount `/api/orders` in `server.js`

### Frontend 🔲
- [ ] `CartContext.jsx` — Full logic: addToCart, removeFromCart, updateQty, clear cart, persist to localStorage
- [ ] `Cart.jsx` — Full page: line items, qty stepper, subtotal, proceed to checkout button
- [ ] `components/layout/CartDrawer.jsx` — Slide-in panel from right side showing cart summary
- [ ] `pages/Checkout.jsx` — Shipping address form → confirm → POST `/api/orders` → order confirmation screen
- [ ] Route `/checkout` added to `AppRoutes.jsx` with ProtectedRoute
- [ ] Navbar cart icon opens CartDrawer

**Concepts taught**: Cart math, localStorage persistence, complex state mutations, form handling

---

## Phase 7 — Order Management
**Goal**: Users can view past orders and track status. Admins can update order status.

### Backend 🔲
- [ ] `orderController.js` — `getMyOrders`, `getOrderById` (user's own orders only)
- [ ] `orderController.js` — `getAllOrders`, `updateOrderStatus` (admin only)
- [ ] Routes protected accordingly with `protect` and `adminOnly`

### Frontend 🔲
- [ ] `Profile.jsx` — Full implementation: tabs for "My Details" and "Order History"
- [ ] `pages/OrderDetails.jsx` — Single order view: items list, status timeline, shipping info
- [ ] `components/profile/OrderCard.jsx` — Compact order summary card with status badge
- [ ] `components/profile/StatusTimeline.jsx` — Visual step tracker: pending → processing → shipped → delivered
- [ ] Route `/orders/:id` added to `AppRoutes.jsx`

**Concepts taught**: Nested data relationships (order → user → products), status state machines

---

## Phase 8 — Admin Dashboard
**Goal**: Admin can view platform stats, manage products, and process orders.

### Backend 🔲
- [ ] `backend/controllers/adminController.js` — `getDashboardStats` (total revenue, order count, product count, user count)
- [ ] `productController.js` — `createProduct`, `updateProduct`, `deleteProduct` (admin only, with Cloudinary upload)
- [ ] `backend/middleware/uploadMiddleware.js` — Multer memory storage for image buffer before Cloudinary
- [ ] `backend/config/cloudinary.js` — Cloudinary SDK v2 configuration
- [ ] `backend/routes/adminRoutes.js` — GET `/stats`, product CRUD, order management
- [ ] Mount `/api/admin` in `server.js`

### Frontend 🔲
- [ ] `AdminDashboard.jsx` — Full stats grid: revenue, orders, products, users; recent orders table
- [ ] `pages/admin/AdminProducts.jsx` — Product table with edit/delete, add new product button
- [ ] `pages/admin/AdminProductForm.jsx` — Rich form: name, price, category, mood, images (multi-upload), specs
- [ ] `pages/admin/AdminOrders.jsx` — Orders table with status dropdown per row
- [ ] `components/admin/StatCard.jsx` — Animated number counter metric card
- [ ] `components/admin/DataTable.jsx` — Sortable, paginated data table component

**Concepts taught**: File upload flow (Multer → Cloudinary), admin-only guards, multi-step forms

---

## Phase 9 — Recommendation Engine
**Goal**: "You may also like" and mood-based discovery throughout the site.

### Backend 🔲
- [ ] `productController.js` — `getRecommendations(slug)`: fetch products with same `mood`, exclude current, limit 4
- [ ] `productController.js` — `getMoodProducts(mood)`: fetch all products of a given mood
- [ ] Route: GET `/api/products/:slug/recommendations`
- [ ] Route: GET `/api/products/mood/:mood`

### Frontend 🔲
- [ ] `ProductDetails.jsx` — "You May Also Like" section using recommendations API
- [ ] `Home.jsx` — "Shop By Mood" mood cards link to filtered catalog with real data
- [ ] `components/product/RecommendationRow.jsx` — Horizontal scroll luxury product row
- [ ] `Catalog.jsx` — Mood filter chips update URL query and refetch

**Concepts taught**: Heuristic recommendation logic, compound MongoDB queries, horizontal scroll UX

---

## Phase 10 — Final Polish & Deployment
**Goal**: Everything feels premium. Ship to production.

### Backend 🔲
- [ ] Set `NODE_ENV=production` in Render environment variables
- [ ] Add MongoDB Atlas production connection string
- [ ] Add all Cloudinary, JWT, Google OAuth production keys
- [ ] Deploy to **Render** (free tier Node.js web service)

### Frontend 🔲
- [ ] `components/common/Skeleton.jsx` — Shimmer loading placeholder for product grids
- [ ] `components/feedback/Toast.jsx` — Elegant gold toast notifications (success, error, info)
- [ ] Apply skeletons to: Catalog, ProductDetails, Profile orders
- [ ] Apply toasts to: Add to cart, Add to wishlist, Login success, Order placed
- [ ] Responsive audit: test all pages at mobile (375px), tablet (768px), desktop (1280px)
- [ ] Set `VITE_API_URL` environment variable for production backend URL
- [ ] Update `api.js` to use `import.meta.env.VITE_API_URL`
- [ ] Deploy to **Vercel** (automatic GitHub integration)

**Concepts taught**: Environment variables for deployment, shimmer UX, toast notification systems, responsive breakpoints

---

## 📊 Complete Progress Overview

| Phase | Focus Area | Backend | Frontend | Status |
|:------|:-----------|:--------|:---------|:-------|
| 1 | Setup & Architecture | ✅ | ✅ | **Done** |
| 2 | Context & Live Data | 🔲 Seed DB | 🔲 Context + Axios | **Next** |
| 3 | Authentication | 🔲 JWT + OAuth | 🔲 Login/Register | Pending |
| 4 | Product Catalog | 🔲 Search | 🔲 Catalog + Details | Pending |
| 5 | Wishlist | 🔲 Routes | 🔲 Context sync | Pending |
| 6 | Cart & Checkout | 🔲 Orders model | 🔲 Drawer + Checkout | Pending |
| 7 | Order Management | 🔲 Controllers | 🔲 Profile + Tracking | Pending |
| 8 | Admin Dashboard | 🔲 Cloudinary | 🔲 Admin pages | Pending |
| 9 | Recommendations | 🔲 Mood queries | 🔲 Related products | Pending |
| 10 | Polish & Deploy | 🔲 Render | 🔲 Vercel | Pending |
