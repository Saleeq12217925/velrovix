import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = 'cart', duration = 3000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ── Rendered outside the tree, fixed to the viewport ──
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingBag, X, CheckCircle } from 'lucide-react';

const ICONS = {
  cart: <ShoppingBag className="w-4 h-4 text-luxury-accent" />,
  wishlist: <Heart className="w-4 h-4 text-luxury-accent fill-luxury-accent" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
};

const ACCENT = {
  cart: 'border-l-luxury-accent',
  wishlist: 'border-l-luxury-accent',
  success: 'border-l-emerald-400',
};

const ToastContainer = ({ toasts, onDismiss }) => (
  <div
    aria-live="polite"
    className="fixed bottom-8 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
  >
    <AnimatePresence mode="sync">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`pointer-events-auto flex items-center gap-4 bg-luxury-darkGray/90 backdrop-blur-xl border border-white/10 border-l-2 ${ACCENT[toast.type] || ACCENT.cart} rounded-xl px-5 py-4 shadow-2xl min-w-[240px] max-w-[300px]`}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {ICONS[toast.type] || ICONS.cart}
          </div>

          {/* Message */}
          <p className="flex-1 font-sans text-xs text-luxury-cream leading-relaxed">
            {toast.message}
          </p>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 text-luxury-neutralGray/50 hover:text-luxury-cream transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-luxury-accent/50 rounded-b-xl"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default ToastProvider;
