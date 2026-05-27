import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ShieldCheck, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SHIPPING_THRESHOLD = 10000;
const TAX_RATE = 0.08;

const Cart = () => {
  const { cart, cartTotal, cartCount, removeFromCart, updateQty, clearCart } = useCart();
  const { showToast } = useToast();

  const shipping = cartTotal > SHIPPING_THRESHOLD ? 0 : 150;
  const tax = Math.round(cartTotal * TAX_RATE);
  const orderTotal = cartTotal + shipping + tax;
  const shippingProgress = Math.min((cartTotal / SHIPPING_THRESHOLD) * 100, 100);

  const handleRemove = (product) => {
    removeFromCart(product._id || product.slug);
    showToast({ message: `${product.name} removed from allocation`, type: 'cart' });
  };

  return (
    <main className="min-h-screen bg-luxury-black relative pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      {/* ── Cinematic Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548171915-ff79a0b30c4c?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            filter: 'brightness(0.4) saturate(0.1)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, #060606 80%)' }} />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">

        {/* ── Header ── */}
        <header className="space-y-5">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold block">
            YOUR SHOPPING CART
          </motion.span>
          <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl tracking-luxury text-luxury-cream">
              Your Cart
              {cartCount > 0 && (
                <span className="ml-4 font-sans text-sm text-luxury-accent font-normal">
                  ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </motion.h1>
            {cartCount > 0 && (
              <button onClick={() => { clearCart(); showToast({ message: 'Cart cleared', type: 'cart' }); }}
                className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray/50 hover:text-red-400 transition-colors duration-300 uppercase flex-shrink-0">
                Clear All
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {cart.length === 0 ? (
            /* ── Empty state ── */
            <motion.div key="empty" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }} className="flex flex-col items-center justify-center py-28 text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-luxury-neutralGray/20" />
                </div>
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(197,165,114,0.04) 0%, transparent 70%)' }} />
              </div>
              <div className="space-y-3 max-w-sm">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-[1px] bg-luxury-accent/30" />
                  <span className="font-sans text-[8px] tracking-[0.4em] text-luxury-accent/60 uppercase">Empty</span>
                  <div className="w-8 h-[1px] bg-luxury-accent/30" />
                </div>
                <h2 className="font-serif text-2xl text-luxury-cream">Your Cart is Empty</h2>
                <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                  Explore our archive of rare timepieces and olfactory narratives waiting to be claimed.
                </p>
              </div>
              <Link to="/catalog"
                className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.25em] font-bold uppercase text-luxury-black bg-luxury-accent px-8 py-4 rounded-full hover:bg-amber-400 transition-all duration-300">
                EXPLORE THE ARCHIVE
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ) : (
            /* ── Allocation items + Summary ── */
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

              {/* Items list */}
              <div>
                <AnimatePresence mode="popLayout">
                  {cart.map(({ product, qty }) => {
                    const key = product._id || product.slug;
                    const imageUrl = product.images?.[0]?.url;
                    const lineTotal = (product.price * qty).toLocaleString();

                    return (
                      <motion.div key={key} layout
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.4 }}
                        className="group flex gap-6 py-8 border-b border-white/5 hover:border-luxury-accent/10 transition-colors duration-300">

                        {/* Image */}
                        <Link to={`/products/${product.slug}`} className="flex-shrink-0 w-24 h-28 rounded-xl overflow-hidden border border-white/8 bg-luxury-darkGray">
                          {imageUrl ? (
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-luxury-neutralGray/20" />
                            </div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <span className="font-sans text-[8px] tracking-[0.3em] text-luxury-accent uppercase">
                              {product?.category?.name || product?.category} {product?.mood ? `· ${product.mood}` : ''}
                            </span>
                            <Link to={`/products/${product.slug}`}>
                              <h2 className="font-serif text-lg text-luxury-cream hover:text-luxury-accent transition-colors duration-300 truncate mt-0.5">
                                {product.name}
                              </h2>
                            </Link>
                            <p className="font-sans text-xs text-luxury-neutralGray mt-0.5">
                              ${product.price?.toLocaleString()} per piece
                            </p>
                          </div>

                          {/* Qty controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                              <button onClick={() => updateQty(key, qty - 1)} aria-label="Decrease"
                                className="px-3 py-2 text-luxury-cream/60 hover:text-luxury-accent hover:bg-white/5 transition-all duration-200">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-sans text-xs text-luxury-cream">{qty}</span>
                              <button onClick={() => updateQty(key, qty + 1)} aria-label="Increase"
                                className="px-3 py-2 text-luxury-cream/60 hover:text-luxury-accent hover:bg-white/5 transition-all duration-200">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {/* CoA badge */}
                            <div className="flex items-center gap-1.5 text-luxury-accent/60">
                              <ShieldCheck className="w-3 h-3" />
                              <span className="font-sans text-[8px] tracking-widest uppercase">Certificate Included</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: total + remove */}
                        <div className="flex flex-col items-end justify-between flex-shrink-0">
                          <button onClick={() => handleRemove(product)} aria-label="Remove"
                            className="p-1.5 text-luxury-neutralGray/30 hover:text-red-400 transition-colors duration-300">
                            <X className="w-4 h-4" />
                          </button>
                          <div className="text-right">
                            <p className="font-sans text-[8px] tracking-luxury text-luxury-neutralGray mb-1">LINE TOTAL</p>
                            <p className="font-serif text-lg text-luxury-accent">${lineTotal}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Continue shopping */}
                <div className="pt-8">
                  <Link to="/catalog" className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray/50 hover:text-luxury-accent transition-colors duration-300 uppercase">
                    ← Continue Browsing
                  </Link>
                </div>
              </div>

              {/* ── Order Summary ── */}
              <motion.aside layout
                className="border border-white/8 rounded-2xl overflow-hidden bg-luxury-darkGray/20 sticky top-28">

                {/* Summary header */}
                <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
                  <div className="w-4 h-[1px] bg-luxury-accent" />
                  <h3 className="font-sans text-[9px] tracking-[0.3em] text-luxury-cream font-semibold uppercase">Order Summary</h3>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* Complimentary shipping progress */}
                  {cartTotal < SHIPPING_THRESHOLD && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-sans text-[9px] text-luxury-accent uppercase tracking-widest flex items-center gap-1.5">
                          <Truck className="w-3 h-3" /> Free Shipping Progress
                        </span>
                        <span className="font-sans text-[9px] text-luxury-neutralGray">
                          ${(SHIPPING_THRESHOLD - cartTotal).toLocaleString()} away
                        </span>
                      </div>
                      <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-luxury-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${shippingProgress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Line items */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-luxury-neutralGray">Subtotal</span>
                      <span className="font-sans text-xs text-luxury-cream">${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-luxury-neutralGray">Shipping</span>
                      <span className={`font-sans text-xs ${shipping === 0 ? 'text-emerald-400' : 'text-luxury-cream'}`}>
                        {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-xs text-luxury-neutralGray">Tax (8%)</span>
                      <span className="font-sans text-xs text-luxury-cream">${tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/8 pt-4 flex justify-between items-baseline">
                    <span className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Total</span>
                    <span className="font-serif text-2xl text-luxury-accent">${orderTotal.toLocaleString()}</span>
                  </div>

                  {/* CTA */}
                  <Link to="/checkout"
                    className="group flex items-center justify-between w-full bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-4 rounded-xl hover:bg-amber-400 transition-all duration-300">
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  {/* Trust badges */}
                  <div className="pt-2 space-y-2.5">
                    {[
                       { icon: ShieldCheck, text: 'Certificate of Authenticity included' },
                      { icon: Star, text: 'Premium delivery available' },
                      { icon: Truck, text: 'Insured worldwide shipping' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-luxury-accent/50 flex-shrink-0" />
                        <span className="font-sans text-[9px] text-luxury-neutralGray/60 leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Cart;
