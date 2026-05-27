import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MoodCard = ({ moodName, subtitle, imageUrl }) => {
  return (
    <Link to={`/catalog?mood=${moodName}`} className="block overflow-hidden relative group rounded border border-white/5 shadow-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative h-[250px] sm:h-[350px] w-full bg-luxury-black overflow-hidden"
      >
        {/* Background Image */}
        <img 
          src={imageUrl} 
          alt={moodName} 
          loading="lazy"
          className="w-full h-full object-cover object-center breathing-img filter brightness-75 group-hover:brightness-50 transition-all duration-1000"
        />

        {/* Sensory Glow Ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent opacity-90 transition-opacity duration-700" />
        
        {/* Border Tracing on hover */}
        <div className="absolute inset-4 border border-luxury-accent/0 group-hover:border-luxury-accent/20 transition-all duration-1000 pointer-events-none" />

        {/* Content Box */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end items-start space-y-1 z-10">
          <span className="font-sans text-[8px] tracking-editorial text-luxury-accent uppercase font-bold">
            {subtitle}
          </span>
          <h3 className="font-serif text-2xl tracking-luxury text-luxury-cream group-hover:text-luxury-accent transition-colors duration-500">
            {moodName}
          </h3>
          <span className="font-sans text-[9px] tracking-luxury text-luxury-cream/40 group-hover:text-luxury-cream/80 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            EXPLORE THE DIALOGUE &rarr;
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default MoodCard;
