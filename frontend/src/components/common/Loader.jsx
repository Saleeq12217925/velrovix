import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 bg-luxury-black z-[9999] flex flex-col items-center justify-center"
    >
      <div className="space-y-4 text-center select-none">
        {/* Breathing Gold Logo */}
        <motion.h1 
          initial={{ letterSpacing: '0.05em', opacity: 0.3 }}
          animate={{ 
            letterSpacing: '0.28em', 
            opacity: 1,
            transition: { 
              duration: 2.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          className="font-serif text-4xl md:text-5xl text-luxury-cream font-light tracking-editorial uppercase"
        >
          VELROVIX
        </motion.h1>

        {/* Muted Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6, duration: 1.5 }}
          className="font-sans text-[8px] tracking-[0.4em] text-luxury-accent font-light uppercase"
        >
          HAUTE HÉRITAGE &bull; IMMERSING
        </motion.p>
      </div>

      {/* Elegant Ambient Glowing Backlight */}
      <div className="absolute w-[500px] h-[500px] bg-luxury-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

export default Loader;
