import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call for newsletter subscription
    showToast({ message: 'Subscribed to The Curation', type: 'success' });
    setEmail('');
  };
  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Philosophy */}
          <div className="space-y-4 md:col-span-2">
            <span className="font-serif text-xl tracking-editorial text-luxury-cream">
              VELROVIX
            </span>
            <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed max-w-sm">
              Crafting premium cinematic sensory dialogues through heritage watchmaking and rare boutique perfumery. Every piece represents a lifetime of devotion, meticulous calibration, and artistic design.
            </p>
          </div>

          {/* Navigation Directory */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs tracking-luxury text-luxury-accent font-semibold">
              THE DIRECTORY
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog?category=watches" className="font-sans text-xs text-luxury-cream/70 hover:text-luxury-accent transition-colors duration-300">
                  Luxury Timepieces
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=perfumes" className="font-sans text-xs text-luxury-cream/70 hover:text-luxury-accent transition-colors duration-300">
                  Haute Fragrances
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="font-sans text-xs text-luxury-cream/70 hover:text-luxury-accent transition-colors duration-300">
                  New Sensory Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Luxury Curation Subscription */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs tracking-luxury text-luxury-accent font-semibold">
              THE CURATION
            </h4>
            <p className="font-sans text-xs text-luxury-neutralGray">
              Subscribe to unlock early access, editorial collections, and invitations to private exhibitions.
            </p>
            <form onSubmit={handleSubscribe} className="flex border-b border-luxury-accent/30 focus-within:border-luxury-accent transition-colors duration-300 py-1">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL" 
                className="bg-transparent border-none text-xs text-luxury-cream placeholder-luxury-neutralGray/50 focus:outline-none w-full tracking-luxury pr-4 truncate"
              />
              <button type="submit" className="font-sans text-xs text-luxury-accent hover:text-luxury-cream transition-colors duration-300 ml-2 tracking-luxury flex-shrink-0">
                JOIN
              </button>
            </form>
          </div>

        </div>

        {/* Muted Accent Rules & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="font-sans text-[10px] tracking-luxury text-luxury-neutralGray">
            &copy; {new Date().getFullYear()} VELROVIX HAUTE HÉRITAGE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <span className="font-sans text-[10px] tracking-luxury text-luxury-neutralGray hover:text-luxury-accent cursor-pointer transition-colors duration-300">
              PRIVACY DIALOGUE
            </span>
            <span className="font-sans text-[10px] tracking-luxury text-luxury-neutralGray hover:text-luxury-accent cursor-pointer transition-colors duration-300">
              TERMS OF SERVICE
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
