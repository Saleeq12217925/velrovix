import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <main className="min-h-screen bg-luxury-black flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

      {/* Background ambient gold backlight */}
      <div className="absolute w-[400px] h-[400px] bg-luxury-accent/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="space-y-6 max-w-lg z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="space-y-2"
        >
          <span className="font-sans text-xs tracking-editorial text-luxury-accent font-semibold block">
            ERROR 404
          </span>
          <h1 className="font-serif text-5xl md:text-7xl tracking-luxury text-luxury-cream font-light">
            Lost Curation
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="font-sans text-xs md:text-sm text-luxury-neutralGray leading-relaxed max-w-md mx-auto"
        >
          The heritage pathway you are seeking does not exist or has been archived into our private vaults.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="pt-6"
        >
          <Link to="/">
            <Button variant="gold">RETURN TO ANCESTRY</Button>
          </Link>
        </motion.div>
      </div>

    </main>
  );
};

export default NotFound;
