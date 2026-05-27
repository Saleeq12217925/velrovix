import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ subtitle, title, alignment = 'center', className = '' }) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <motion.div 
      className={`flex flex-col ${alignStyles[alignment]} space-y-3 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {subtitle && (
        <span className="font-sans text-[10px] md:text-xs tracking-editorial text-luxury-accent font-semibold uppercase">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-5xl tracking-luxury text-luxury-cream font-light max-w-3xl leading-tight">
        {title}
      </h2>
      <div className="w-12 h-[1px] bg-luxury-accent/30 mt-2" />
    </motion.div>
  );
};

export default SectionTitle;
