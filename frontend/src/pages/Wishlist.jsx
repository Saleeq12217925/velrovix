import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// ── Single wishlist item row ───────────────────────────────────
const WishlistItem = ({ product, onRemove, onMoveToCart }) => {
  const imageUrl = product?.images?.[0]?.url;
  const price = product?.price?.toLocaleString?.() ?? product?.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
      className="group flex items-center gap-6 border-b border-white/5 py-7 hover:border-white/10 transition-colors duration-300"
    >
      {/* Product image */}
      <Link to={`/products/${product.slug}`} className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/8 bg-luxury-darkGray">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-luxury-neutralGray/30" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[8px] tracking-[0.3em] text-luxury-accent uppercase">
            {product?.category?.name || product?.category}
          </span>
          {product?.mood && (
            <span className="font-sans text-[8px] text-luxury-neutralGray/50">· {product.mood}</span>
          )}
        </div>
        <Link to={`/products/${product.slug}`} className="block font-serif text-base md:text-lg text-luxury-cream hover:text-luxury-accent transition-colors duration-300 truncate">
          {product.name}
        </Link>
        <p className="font-sans text-sm text-luxury-accent font-medium">
          ${price}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Move to cart */}
        <button
          onClick={() => onMoveToCart(product)}
          className="flex items-center gap-2 font-sans text-[9px] tracking-luxury text-luxury-cream/70 hover:text-luxury-accent border border-white/8 hover:border-luxury-accent/40 px-4 py-2.5 rounded-full transition-all duration-300"
          aria-label="Move to cart"
        >
          <ShoppingBag className="w-3 h-3" />
          <span className="hidden sm:inline">MOVE TO CART</span>
        </button>

        {/* Remove */}
        <button
          onClick={() => onRemove(product)}
          className="p-2 rounded-full text-luxury-neutralGray/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
          aria-label="Remove from wishlist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ── Main Wishlist page ─────────────────────────────────────────
const Wishlist = () => {
  const { wishlist, toggleWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleRemove = (product) => {
    toggleWishlist(product);
    showToast({ message: `${product.name} removed from wishlist`, type: 'wishlist' });
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product); // removes from wishlist
    showToast({ message: `${product.name} moved to cart`, type: 'cart' });
  };

  const handleClearAll = () => {
    clearWishlist();
    showToast({ message: 'Wishlist cleared', type: 'wishlist' });
  };

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ── Header ── */}
        <header className="space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold block"
          >
            CURATED DESIRES
          </motion.span>

          <div className="flex items-end justify-between gap-4 border-b border-white/5 pb-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl tracking-luxury text-luxury-cream"
            >
              The Wishlist
              {wishlistCount > 0 && (
                <span className="ml-4 font-sans text-sm text-luxury-accent font-normal">
                  ({wishlistCount} {wishlistCount === 1 ? 'piece' : 'pieces'})
                </span>
              )}
            </motion.h1>

            {wishlistCount > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleClearAll}
                className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray/50 hover:text-red-400 transition-colors duration-300 uppercase flex-shrink-0"
              >
                Clear All
              </motion.button>
            )}
          </div>
        </header>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {wishlistCount === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center py-28 text-center space-y-8"
            >
              {/* Decorative heart */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-luxury-neutralGray/20" />
                </div>
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(197,165,114,0.04) 0%, transparent 70%)' }} />
              </div>

              <div className="space-y-3 max-w-sm">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-luxury-accent/30" />
                  <span className="font-sans text-[8px] tracking-[0.4em] text-luxury-accent/60 uppercase">Empty Treasury</span>
                  <div className="w-8 h-[1px] bg-luxury-accent/30" />
                </div>
                <h2 className="font-serif text-2xl text-luxury-cream">No Pieces Curated Yet</h2>
                <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                  Your personal treasury awaits. Explore our archive and earmark the pieces that speak to your sensibility.
                </p>
              </div>

              <Link
                to="/catalog"
                className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.25em] font-bold uppercase text-luxury-black bg-luxury-accent px-8 py-4 rounded-full hover:bg-amber-400 transition-all duration-300"
              >
                EXPLORE THE ARCHIVE
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ) : (
            /* Wishlist items */
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <AnimatePresence mode="popLayout">
                {wishlist.map((product) => (
                  <WishlistItem
                    key={product._id || product.slug}
                    product={product}
                    onRemove={handleRemove}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </AnimatePresence>

              {/* Summary footer */}
              <motion.div
                layout
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-10 gap-6"
              >
                <div className="space-y-1">
                  <p className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray">
                    TOTAL WISHLIST VALUE
                  </p>
                  <p className="font-serif text-2xl text-luxury-accent">
                    ${wishlist.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    to="/catalog"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-sans text-[9px] tracking-luxury font-semibold uppercase border border-white/10 hover:border-luxury-accent/40 text-luxury-cream/70 hover:text-luxury-accent px-6 py-3.5 rounded-full transition-all duration-300"
                  >
                    CONTINUE BROWSING
                  </Link>
                  <button
                    onClick={() => {
                      wishlist.forEach((p) => handleMoveToCart(p));
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-sans text-[9px] tracking-luxury font-bold uppercase bg-luxury-accent text-luxury-black px-6 py-3.5 rounded-full hover:bg-amber-400 transition-all duration-300"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    ADD ALL TO CART
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Wishlist;
