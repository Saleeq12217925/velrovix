import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Heart, ShoppingBag, LogOut, ChevronRight, Package, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

// ── Info Row ──────────────────────────────────────────────────
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <Icon className="w-3.5 h-3.5 text-luxury-accent/60" />
      <span className="font-sans text-[9px] tracking-[0.25em] text-luxury-neutralGray uppercase">{label}</span>
    </div>
    <span className="font-sans text-xs text-luxury-cream">{value}</span>
  </div>
);

// ── Stat card ─────────────────────────────────────────────────
const StatCard = ({ label, value, to, icon: Icon }) => (
  <Link to={to} className="group flex flex-col justify-between p-6 border border-white/5 rounded-xl hover:border-luxury-accent/30 transition-all duration-300 bg-luxury-darkGray/20 hover:bg-luxury-darkGray/40">
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-5 h-5 text-luxury-accent/60 group-hover:text-luxury-accent transition-colors duration-300" />
      <ChevronRight className="w-3.5 h-3.5 text-luxury-neutralGray/30 group-hover:text-luxury-accent group-hover:translate-x-0.5 transition-all duration-300" />
    </div>
    <div className="space-y-1">
      <p className="font-serif text-2xl text-luxury-cream">{value}</p>
      <p className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">{label}</p>
    </div>
  </Link>
);

// ── Main Profile ──────────────────────────────────────────────
const Profile = () => {
  const { user, logout } = useAuth();
  const { wishlistCount, clearWishlist } = useWishlist();
  const { cartCount, clearCart } = useCart();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        setOrders(data.orders);
      } catch (error) {
        showToast({ message: 'Failed to load acquisition history', type: 'error' });
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user, showToast]);

  const handleLogout = () => {
    // Persist wishlist before clearing
    if (user?._id) {
      const wishlist = JSON.parse(localStorage.getItem('velrovix_wishlist') || '[]');
      const cart = JSON.parse(localStorage.getItem('velrovix_cart') || '[]');
      localStorage.setItem(`velrovix_wishlist_${user._id}`, JSON.stringify(wishlist));
      localStorage.setItem(`velrovix_cart_${user._id}`, JSON.stringify(cart));
    }
    logout();
    clearCart();
    clearWishlist();
    showToast({ message: 'Signed out successfully', type: 'success' });
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'V';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Charter Member';

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ── Header ── */}
        <header className="space-y-2">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-[9px] tracking-[0.4em] text-luxury-accent font-semibold block"
          >
            THE COLLECTOR'S CONSOLE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl tracking-luxury text-luxury-cream"
          >
            My Profile
          </motion.h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* ── Left: Identity card ── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center p-8 border border-white/5 rounded-xl bg-luxury-darkGray/20 space-y-4">
              {/* Monogram avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border border-luxury-accent/30 flex items-center justify-center bg-luxury-accent/5">
                  <span className="font-serif text-2xl text-luxury-accent">{initials}</span>
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-luxury-black" />
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-xl text-luxury-cream tracking-wide">{user?.name || 'Collector'}</h2>
                <p className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray">Member since {memberSince}</p>
              </div>

              {/* Role badge */}
              <div className={`flex items-center gap-1.5 font-sans text-[8px] tracking-[0.3em] font-bold uppercase px-4 py-1.5 rounded-full border ${
                user?.role === 'admin'
                  ? 'border-amber-400/40 text-amber-400 bg-amber-400/5'
                  : 'border-luxury-accent/20 text-luxury-accent bg-luxury-accent/5'
              }`}>
                <Shield className="w-2.5 h-2.5" />
                {user?.role === 'admin' ? 'Administrator' : 'Collector Member'}
              </div>
            </div>

            {/* Account details */}
            <div className="border border-white/5 rounded-xl px-6 py-2 bg-luxury-darkGray/20">
              <InfoRow label="Name" value={user?.name || '—'} icon={User} />
              <InfoRow label="Email" value={user?.email || '—'} icon={Mail} />
              <InfoRow label="Role" value={user?.role === 'admin' ? 'Administrator' : 'Member'} icon={Shield} />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 font-sans text-[9px] tracking-[0.3em] uppercase text-luxury-neutralGray/60 hover:text-red-400 border border-white/5 hover:border-red-400/20 rounded-xl py-3.5 transition-all duration-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              SIGN OUT
            </button>

            {/* Admin link */}
            {user?.role === 'admin' && (
              <Link to="/admin"
                className="w-full flex items-center justify-between font-sans text-[9px] tracking-luxury uppercase text-amber-400 border border-amber-400/20 hover:border-amber-400/50 rounded-xl py-3.5 px-5 transition-all duration-300 group">
                <span>ADMIN DASHBOARD</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            )}
          </div>

          {/* ── Right: Stats + Quick Actions ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Orders" value={loadingOrders ? '…' : orders.length} to="/orders" icon={Package} />
              <StatCard label="Wishlist" value={wishlistCount} to="/wishlist" icon={Heart} />
              <StatCard label="Cart" value={cartCount} to="/cart" icon={ShoppingBag} />
            </div>

            {/* Your Orders CTA */}
            <Link
              to="/orders"
              className="group flex items-center justify-between w-full bg-luxury-darkGray/30 border border-white/5 hover:border-luxury-accent/30 rounded-xl px-6 py-5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-luxury-accent/10 border border-luxury-accent/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-luxury-accent" />
                </div>
                <div>
                  <p className="font-serif text-base text-luxury-cream">Your Orders</p>
                  <p className="font-sans text-[10px] text-luxury-neutralGray">
                    {loadingOrders ? 'Loading…' : orders.length === 0 ? 'No orders placed yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''} — tap to view all`}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-luxury-neutralGray group-hover:text-luxury-accent group-hover:translate-x-1 transition-all duration-300" />
            </Link>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Browse Timepieces', to: '/catalog?category=watches' },
                { label: 'Browse Fragrances', to: '/catalog?category=perfumes' },
                { label: 'My Wishlist', to: '/wishlist' },
                { label: 'Shopping Cart', to: '/cart' },
              ].map((link) => (
                <Link key={link.to} to={link.to}
                  className="group flex items-center justify-between font-sans text-[9px] tracking-luxury text-luxury-neutralGray hover:text-luxury-cream border border-white/5 hover:border-white/10 rounded-xl px-5 py-3.5 transition-all duration-300">
                  {link.label.toUpperCase()}
                  <ChevronRight className="w-3 h-3 text-luxury-accent/0 group-hover:text-luxury-accent/60 transition-colors duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Profile;
