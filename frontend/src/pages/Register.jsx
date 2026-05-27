import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) return setError('All fields are required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    try {
      setLoading(true);
      const { data } = await api.post('/auth/signup', form);
      login(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex overflow-hidden">

      {/* ── Left Panel: Cinematic Editorial Image ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90"
          alt="Luxury fragrance"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.3) saturate(0.7)' }}
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
            <div className="w-12 h-[1px] bg-luxury-accent" />
            <blockquote className="font-serif text-2xl text-luxury-cream leading-relaxed font-light italic">
              "To wear luxury is to declare that you understand the language of the extraordinary."
            </blockquote>
            <p className="font-sans text-[10px] tracking-luxury text-luxury-accent">
              — THE VELROVIX MANIFESTO
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-luxury-black relative">

        {/* Subtle radial glow */}
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
                JOIN THE COLLECTION
              </span>
            </div>
            <h1 className="font-serif text-4xl text-luxury-cream tracking-wide leading-tight">
              Create Account
            </h1>
            <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
              Begin your journey into precision and rare luxury.
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
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="register-name"
                className="font-sans text-[9px] tracking-[0.2em] text-luxury-neutralGray font-semibold uppercase block"
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full bg-luxury-darkGray/60 border border-white/8 rounded-2xl px-5 py-4 font-sans text-xs text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none focus:border-luxury-accent/50 focus:bg-luxury-darkGray/80 transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="register-email"
                className="font-sans text-[9px] tracking-[0.2em] text-luxury-neutralGray font-semibold uppercase block"
              >
                Email Address
              </label>
              <input
                id="register-email"
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
                htmlFor="register-password"
                className="font-sans text-[9px] tracking-[0.2em] text-luxury-neutralGray font-semibold uppercase block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
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
                id="register-submit"
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-between bg-luxury-accent text-luxury-black font-sans text-xs font-bold tracking-[0.2em] uppercase px-6 py-4 rounded-2xl hover:bg-amber-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-3 mx-auto">
                    <span className="w-3.5 h-3.5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                    CREATING ACCOUNT...
                  </span>
                ) : (
                  <>
                    <span>JOIN THE COLLECTION</span>
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

          {/* Login link */}
          <p className="text-center font-sans text-xs text-luxury-neutralGray">
            Already a member?{' '}
            <Link
              to="/login"
              className="text-luxury-accent hover:text-luxury-cream transition-colors duration-300 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
