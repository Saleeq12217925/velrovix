import React from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ text, className = "", delay = 0, variant = "word" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 24,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.2, 
        ease: [0.215, 0.61, 0.355, 1.0] // Premium cubic bezier for high-end ease
      }
    },
  };

  if (variant === "word") {
    const words = text.split(" ");
    return (
      <motion.span 
        className={`inline-block ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {words.map((word, idx) => (
          <span key={idx} className="inline-block overflow-hidden mr-3 py-1">
            <motion.span 
              className="inline-block" 
              variants={itemVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    );
  }

  // Fallback direct reveal
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    >
      {text}
    </motion.span>
  );
};

export default AnimatedText;
