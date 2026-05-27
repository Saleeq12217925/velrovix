import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages imports
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Timepieces from '../pages/Timepieces';
import Fragrances from '../pages/Fragrances';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import AdminProductEdit from './../pages/AdminProductEdit';
import OrderDetails from '../pages/OrderDetails';
import OrderSuccess from '../pages/OrderSuccess';
import OrderHistory from '../pages/OrderHistory';
import NotFound from '../pages/NotFound';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Layout wrappers
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-luxury-black text-luxury-cream">
      {/* Floating Glassmorphic Header */}
      <Navbar />

      {/* Cross-fading Cinematic Page Transit Boundaries */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/catalog" element={<PageWrapper><Catalog /></PageWrapper>} />
            <Route path="/timepieces" element={<PageWrapper><Timepieces /></PageWrapper>} />
            <Route path="/fragrances" element={<PageWrapper><Fragrances /></PageWrapper>} />
            <Route path="/products/:slug" element={<PageWrapper><ProductDetails /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />

            {/* Protected — must be logged in */}
            <Route path="/wishlist" element={<ProtectedRoute><PageWrapper><Wishlist /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageWrapper><OrderHistory /></PageWrapper></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><PageWrapper><OrderDetails /></PageWrapper></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><PageWrapper><OrderSuccess /></PageWrapper></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
            <Route path="/admin/product/:id/edit" element={<AdminRoute><PageWrapper><AdminProductEdit /></PageWrapper></AdminRoute>} />

            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Elegant Editorial Footer */}
      <Footer />
    </div>
  );
};

export default AppRoutes;
