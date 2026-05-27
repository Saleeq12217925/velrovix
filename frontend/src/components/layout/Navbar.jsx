import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount, clearCart, cart } = useCart();
  const { wishlistCount, clearWishlist, wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  // Save wishlist/cart to user-specific key before clearing so it restores on next login
  const handleLogout = () => {
    if (user?._id) {
      localStorage.setItem(`velrovix_wishlist_${user._id}`, JSON.stringify(wishlist));
      localStorage.setItem(`velrovix_cart_${user._id}`, JSON.stringify(cart));
    }
    logout();
    clearCart();
    clearWishlist();
  };

  // Listen for scrolls to add darker backdrop for cinematic readability
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-4 glass-panel-strong shadow-goldGlow' 
        : 'py-6 bg-transparent border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Left Side: Navigation Links (flex-1 to push center logo perfectly to middle) */}
        <div className="hidden lg:flex items-center space-x-8 flex-1">
          
          {/* TIMEPIECES MEGA MENU */}
          <div className="group relative py-4">
            <Link to="/timepieces" className="font-sans text-xs tracking-luxury text-luxury-cream/80 group-hover:text-luxury-accent transition-colors duration-300">
              TIMEPIECES
            </Link>
            
            {/* Dropdown Panel */}
            <div className="absolute top-full left-0 w-[600px] pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 z-50 translate-y-2 group-hover:translate-y-0">
              <div className="glass-panel-strong border border-white/10 p-8 grid grid-cols-3 gap-6 shadow-2xl">
                
                {/* Style 1: Dress Watches */}
                <Link to="/catalog?category=watches&search=dress" className="space-y-3 group/item">
                  <div className="overflow-hidden h-24 border border-white/5 rounded">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" alt="Dress Watches" className="w-full h-full object-cover brightness-75 group-hover/item:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-sans text-[10px] tracking-widest text-luxury-cream group-hover/item:text-luxury-accent uppercase">Dress</h4>
                </Link>

                {/* Style 2: Chronographs */}
                <Link to="/catalog?category=watches&search=chronograph" className="space-y-3 group/item">
                  <div className="overflow-hidden h-24 border border-white/5 rounded">
                    <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=400&q=80" alt="Chronographs" className="w-full h-full object-cover brightness-75 group-hover/item:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-sans text-[10px] tracking-widest text-luxury-cream group-hover/item:text-luxury-accent uppercase">Chronograph</h4>
                </Link>

                {/* Style 3: Divers */}
                <Link to="/catalog?category=watches&search=diver" className="space-y-3 group/item">
                  <div className="overflow-hidden h-24 border border-white/5 rounded">
                    <img src="https://images.unsplash.com/photo-1542496658-e33a6d0d655f?auto=format&fit=crop&w=400&q=80" alt="Divers" className="w-full h-full object-cover brightness-75 group-hover/item:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-sans text-[10px] tracking-widest text-luxury-cream group-hover/item:text-luxury-accent uppercase">Diver</h4>
                </Link>

              </div>
            </div>
          </div>

          <Link to="/fragrances" className="font-sans text-xs tracking-luxury text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
            FRAGRANCES
          </Link>
          <Link to="/catalog" className="font-sans text-xs tracking-luxury text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
            COLLECTIONS
          </Link>
        </div>

        {/* Center: Cinematic Logo */}
        <Link to="/" className="flex flex-col items-center select-none group">
          <span className="font-serif text-2xl md:text-3xl tracking-editorial text-luxury-cream group-hover:text-luxury-accent transition-colors duration-500">
            VELROVIX
          </span>
          <span className="font-sans text-[7px] tracking-[0.45em] text-luxury-accent font-light -mt-0.5">
            HAUTE HÉRITAGE
          </span>
        </Link>

        {/* Right Side: Action Icons (flex-1 and justify-end to balance left side) */}
        <div className="flex-1 flex items-center justify-end space-x-6">
          <Link to="/catalog" aria-label="Search" className="text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
            <Search className="w-[18px] h-[18px] stroke-[1.25]" />
          </Link>
          
          <Link to="/wishlist" aria-label="Curated Wishlist" className="relative text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
            <Heart className="w-[18px] h-[18px] stroke-[1.25]" />
            <span className="absolute -top-1.5 -right-2 bg-luxury-accent text-luxury-black font-sans text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90">
              {wishlistCount}
            </span>
          </Link>

          <Link to="/cart" aria-label="Cinematic Cart" className="relative text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.25]" />
            <span className="absolute -top-1.5 -right-2 bg-luxury-accent text-luxury-black font-sans text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center scale-90">
              {cartCount}
            </span>
          </Link>

          {/* User / Auth */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  aria-label="Admin Console"
                  className="flex items-center gap-1.5 font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-luxury-black bg-luxury-accent px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors duration-300"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="font-sans text-[10px] tracking-luxury text-luxury-accent font-semibold hover:text-luxury-cream transition-colors duration-300 truncate max-w-[80px]"
                aria-label="My Profile"
              >
                {user?.name?.split(' ')[0].toUpperCase()}
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-luxury-cream/60 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="w-[16px] h-[16px] stroke-[1.25]" />
              </button>
            </div>
          ) : (
            <Link to="/login" aria-label="Account Portal" className="hidden sm:inline-block text-luxury-cream/80 hover:text-luxury-accent transition-colors duration-300">
              <User className="w-[18px] h-[18px] stroke-[1.25]" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-luxury-cream hover:text-luxury-accent transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm glass-panel-strong shadow-2xl z-40 transform transition-transform duration-500 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full pt-28 px-8 pb-12 justify-between">
          <div className="flex flex-col space-y-8">
            <Link to="/catalog?category=watches" className="font-serif text-2xl tracking-luxury text-luxury-cream hover:text-luxury-accent transition-colors">
              Timepieces
            </Link>
            <Link to="/catalog?category=perfumes" className="font-serif text-2xl tracking-luxury text-luxury-cream hover:text-luxury-accent transition-colors">
              Fragrances
            </Link>
            <Link to="/catalog" className="font-serif text-2xl tracking-luxury text-luxury-cream hover:text-luxury-accent transition-colors">
              Editorial Catalog
            </Link>
            <hr className="border-white/5" />
            <Link to="/login" className="font-sans text-xs tracking-luxury text-luxury-neutralGray hover:text-luxury-accent transition-colors">
              CUSTOMER PORTAL
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 font-sans text-xs tracking-luxury text-amber-400 hover:text-luxury-cream transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                ADMIN CONSOLE
              </Link>
            )}
          </div>
          
          <div className="text-center">
            <p className="font-sans text-[9px] tracking-editorial text-luxury-neutralGray">
              VELROVIX EST. 2026
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
