import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/common/Loader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [loading, setLoading] = useState(true);

  // Trigger luxury slow intro reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
            {/* Intro Loader Gate */}
            <AnimatePresence mode="wait">
              {loading && <Loader key="loader" />}
            </AnimatePresence>

            {/* Main Core Routing & Structure */}
            {!loading && <AppRoutes />}
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
