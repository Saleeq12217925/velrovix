import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  variant = 'gold', // 'gold', 'outline', 'dark'
  className = '',
  type = 'button',
  disabled = false
}) => {

  const baseStyles = "relative font-sans text-xs tracking-editorial font-bold py-4 px-8 rounded transition-all duration-500 overflow-hidden select-none focus:outline-none";

  const variants = {
    gold: "bg-luxury-accent text-luxury-black hover:bg-luxury-goldHover hover:shadow-goldGlow border border-transparent",
    outline: "bg-transparent text-luxury-cream border border-luxury-accent/40 hover:border-luxury-accent hover:text-luxury-accent",
    dark: "bg-luxury-charcoal text-luxury-cream hover:bg-luxury-black border border-white/5 hover:border-luxury-accent/30"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Editorial hover line tracing for outline buttons */}
      {variant === 'outline' && (
        <span className="absolute inset-0 w-full h-full bg-luxury-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
