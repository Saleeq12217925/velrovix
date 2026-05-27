import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Star, Truck, ArrowRight, Home } from 'lucide-react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const hasRedirected = useRef(false);

  // If someone navigates here directly with no order state, send to profile
  useEffect(() => {
    if (!order && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/profile', { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  const orderRef = order._id?.slice(-8).toUpperCase();

  const milestones = [
    { icon: CheckCircle2, label: 'Acquisition Confirmed',  active: true },
    { icon: Star,         label: 'White-Glove Preparation', active: false },
    { icon: Truck,        label: 'Concierge Dispatch',      active: false },
    { icon: ShieldCheck,  label: 'Delivered with CoA',      active: false },
  ];

  return (
    <main className="min-h-screen bg-luxury-black relative flex items-center justify-center px-6 py-32 overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(197,165,114,0.08) 0%, transparent 70%)' }}
        />
        {/* Particle dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-luxury-accent/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i / 12) * Math.PI * 2) * 220,
              y: Math.sin((i / 12) * Math.PI * 2) * 220,
            }}
            transition={{ delay: 0.5 + i * 0.08, duration: 1.5, ease: 'easeOut' }}
            style={{
              top: '50%', left: '50%',
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 space-y-12 text-center">

        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-full border border-luxury-accent/30 flex items-center justify-center relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-luxury-accent/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <CheckCircle2 className="w-10 h-10 text-luxury-accent" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <span className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold uppercase">
            VELROVIX · ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-cream tracking-luxury">
            Order Confirmed!
          </h1>
          <p className="font-sans text-sm text-luxury-neutralGray leading-relaxed max-w-md mx-auto">
            Your order has been placed successfully. A dedicated team member will ensure your purchase is carefully packaged and on its way to you.
          </p>
          <div className="inline-flex items-center gap-2 bg-luxury-accent/10 border border-luxury-accent/20 px-4 py-2 rounded-full">
            <span className="font-sans text-[9px] text-luxury-neutralGray uppercase tracking-widest">Reference</span>
            <span className="font-mono text-sm text-luxury-accent font-semibold">#{orderRef}</span>
          </div>
        </motion.div>

        {/* Journey milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-luxury-darkGray/30 border border-white/5 rounded-2xl p-8"
        >
          <h3 className="font-sans text-[9px] tracking-[0.3em] text-luxury-cream uppercase mb-8">Your Order Journey</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-5 right-5 h-[1px] bg-white/5 z-0" />
            <div className="absolute top-5 left-5 w-0 h-[1px] bg-luxury-accent z-0 transition-all"
              style={{ width: `${(1 / (milestones.length - 1)) * 100}%` }} />
            {milestones.map(({ icon: Icon, label, active }, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  active
                    ? 'border-luxury-accent bg-luxury-accent/10 text-luxury-accent shadow-[0_0_15px_rgba(197,165,114,0.2)]'
                    : 'border-white/10 bg-luxury-black text-white/20'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`font-sans text-[8px] tracking-widest uppercase text-center leading-tight ${
                  active ? 'text-luxury-accent' : 'text-luxury-neutralGray/30'
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CoA Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="bg-gradient-to-br from-luxury-accent/10 to-transparent border border-luxury-accent/20 rounded-2xl p-6 flex items-start gap-4 text-left"
        >
          <ShieldCheck className="w-8 h-8 text-luxury-accent flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-serif text-lg text-luxury-cream mb-1">Certificate of Authenticity</h4>
            <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
              Your NFC-chipped Certificate of Authenticity is being prepared. It will arrive sealed in a lacquered Velrovix keepsake box alongside your acquisition, verifiable via our global registry.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={`/order/${order._id}`}
            className="group flex items-center justify-center gap-3 bg-luxury-accent text-luxury-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 rounded-xl hover:bg-amber-400 transition-all duration-300">
            VIEW FULL RECEIPT
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link to="/"
            className="group flex items-center justify-center gap-3 border border-white/10 text-luxury-neutralGray font-sans text-[10px] tracking-[0.2em] uppercase px-8 py-4 rounded-xl hover:border-white/20 hover:text-luxury-cream transition-all duration-300">
            <Home className="w-4 h-4" />
            RETURN TO VELROVIX
          </Link>
        </motion.div>

      </div>
    </main>
  );
};

export default OrderSuccess;
