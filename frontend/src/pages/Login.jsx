import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const { loadWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please enter your email and password.');
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', form);
      login(data);

      // Restore this user's previously saved wishlist and cart
      const savedWishlist = JSON.parse(localStorage.getItem(`velrovix_wishlist_${data.user._id}`)) || [];
      const savedCart = JSON.parse(localStorage.getItem(`velrovix_cart_${data.user._id}`)) || [];
      loadWishlist(savedWishlist);
      savedCart.forEach(({ product, qty }) => addToCart(product, qty));

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex overflow-hidden">

      {/* ── Left Panel: Cinematic Editorial Image ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=90"
          alt="Luxury timepiece"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.35) saturate(0.8)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/20 via-transparent to-luxury-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />

        {/* Editorial content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-3xl tracking-editorial text-luxury-cream group-hover:text-luxury-accent transition-colors duration-500">
              VELROVIX
            </span>
            <span className="font-sans text-[8px] tracking-[0.45em] text-luxury-accent/80 font-light mt-0.5">
              HAUTE HÉRITAGE
            </span>
          </Link>

          {/* Quote block */}
          <div className="space-y-6 max-w-sm">
            {/* Gold line */}
            <div className="w-12 h-[1px] bg-luxury-accent" />
            <blockquote className="font-serif text-2xl text-luxury-cream leading-relaxed font-light italic">
              "Precision is not a trait — it is a discipline acquired over generations."
            </blockquote>
            <p className="font-sans text-[10px] tracking-luxury text-luxury-accent">
              — THE VELROVIX MANIFESTO
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-luxury-black relative">

        {/* Subtle radial glow behind form */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,165,114,0.05) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex flex-col items-center group">
              <span className="font-serif text-3xl tracking-editorial text-luxury-cream">VELROVIX</span>
              <span className="font-sans text-[8px] tracking-[0.45em] text-luxury-accent font-light mt-0.5">HAUTE HÉRITAGE</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-luxury-accent" />
              <span className="font-sans text-[9px] tracking-[0.35em] text-luxury-accent font-semibold">
                MEMBER ACCESS
              </span>
            </div>
            <h1 className="font-serif text-4xl text-luxury-cream tracking-wide leading-tight">
              Sign In
            </h1>
            <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
              Access your curated collection and exclusive privileges.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/8 border border-red-500/25 rounded-2xl px-5 py-3"
            >
              <p className="font-sans text-xs text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="font-sans text-[9px] tracking-[0.2em] text-luxury-neutralGray font-semibold uppercase block"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full bg-luxury-darkGray/60 border border-white/8 rounded-2xl px-5 py-4 font-sans text-xs text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none focus:border-luxury-accent/50 focus:bg-luxury-darkGray/80 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="font-sans text-[9px] tracking-[0.2em] text-luxury-neutralGray font-semibold uppercase block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-luxury-darkGray/60 border border-white/8 rounded-2xl px-5 py-4 pr-12 font-sans text-xs text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none focus:border-luxury-accent/50 focus:bg-luxury-darkGray/80 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-neutralGray/50 hover:text-luxury-accent transition-colors duration-300"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-between bg-luxury-accent text-luxury-black font-sans text-xs font-bold tracking-[0.2em] uppercase px-6 py-4 rounded-2xl hover:bg-amber-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-3 mx-auto">
                    <span className="w-3.5 h-3.5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                    AUTHENTICATING...
                  </span>
                ) : (
                  <>
                    <span>ENTER THE COLLECTION</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/6" />
            <span className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray/40">OR</span>
            <div className="flex-1 h-[1px] bg-white/6" />
          </div>

          {/* Register link */}
          <p className="text-center font-sans text-xs text-luxury-neutralGray">
            New to Velrovix?{' '}
            <Link
              to="/register"
              className="text-luxury-accent hover:text-luxury-cream transition-colors duration-300 font-semibold"
            >
              Create an Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
