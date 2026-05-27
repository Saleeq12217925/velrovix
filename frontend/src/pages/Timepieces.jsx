import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/common/AnimatedText';
import SectionTitle from '../components/common/SectionTitle';

const Timepieces = () => {
  const collections = [
    {
      name: "The Dress Collection",
      slug: "dress",
      description: "Restrained elegance in gold and platinum. Designed to slide effortlessly under a bespoke cuff.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "The Chronograph Series",
      slug: "chronograph",
      description: "High-frequency calibers built for the track. Splitting seconds with ruthless precision.",
      image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "The Diver Instruments",
      slug: "diver",
      description: "Luminescent depth. Engineered for the abyss with marine bronze and helium escape valves.",
      image: "https://images.unsplash.com/photo-1542496658-e33a6d0d655f?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  return (
    <div className="bg-luxury-black min-h-screen">
      
      {/* 1. Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1920&q=80" 
            alt="Watch Movement Hero" 
            className="w-full h-full object-cover filter brightness-[0.25] animate-slow-pan"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-transparent to-luxury-black" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
            <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] text-luxury-accent font-semibold uppercase block mb-4">
              HAUTE HORLOGERIE
            </span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-8xl tracking-luxury text-luxury-cream font-light leading-[1.1]">
            <AnimatedText text="The Anatomy of Time" delay={0.3} variant="word" />
          </h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.2, duration: 1.5 }}
            className="font-sans text-xs md:text-sm text-luxury-cream max-w-xl mx-auto leading-relaxed font-light"
          >
            Discover master-crafted calibers engineered by Swiss artisans. A relentless pursuit of mechanical perfection.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-55 animate-bounce">
          <span className="font-sans text-[8px] tracking-[0.35em] text-luxury-cream font-light">EXPLORE</span>
          <div className="w-[1px] h-8 bg-luxury-accent/50" />
        </div>
      </section>

      {/* 2. Heritage Section */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center space-y-12">
        <SectionTitle subtitle="OUR HERITAGE" title="Centuries of Calibration" />
        <p className="font-sans text-sm md:text-base text-luxury-neutralGray leading-loose max-w-3xl mx-auto font-light">
          At Velrovix, we do not simply assemble watches; we forge legacies. Each timepiece is the culmination of hundreds of hours of micro-engineering. From the initial smelting of raw grade-5 titanium to the final microscopic polish of the tourbillon bridge, every act is performed with obsessive reverence for the craft.
        </p>
      </section>

      {/* 3. The Collections */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-16">
        <SectionTitle subtitle="DIRECTORIES" title="The Collections" />
        
        <div className="space-y-32">
          {collections.map((coll, idx) => (
            <motion.div 
              key={coll.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[500px] overflow-hidden rounded group border border-white/5 relative">
                <img 
                  src={coll.image} 
                  alt={coll.name} 
                  className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-luxury-accent/0 group-hover:bg-luxury-accent/10 transition-colors duration-500" />
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6 md:px-12">
                <span className="font-sans text-[10px] tracking-[0.3em] text-luxury-accent font-bold uppercase">
                  CHAPTER 0{idx + 1}
                </span>
                <h3 className="font-serif text-4xl text-luxury-cream">{coll.name}</h3>
                <p className="font-sans text-sm text-luxury-neutralGray leading-relaxed max-w-md">
                  {coll.description}
                </p>
                <div className="pt-6">
                  <Link 
                    to={`/catalog?category=watches&search=${coll.slug}`} 
                    className="inline-flex items-center gap-4 text-xs font-sans tracking-widest uppercase text-luxury-cream hover:text-luxury-accent transition-colors group"
                  >
                    View Collection
                    <span className="w-8 h-[1px] bg-luxury-cream group-hover:bg-luxury-accent transition-colors" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-32 bg-luxury-darkGray text-center border-t border-white/5">
        <h2 className="font-serif text-3xl md:text-5xl text-luxury-cream mb-8">View the Full Arsenal</h2>
        <Link 
          to="/catalog?category=watches" 
          className="inline-block border border-luxury-accent px-10 py-4 text-xs font-sans tracking-[0.2em] uppercase text-luxury-accent hover:bg-luxury-accent hover:text-black transition-colors duration-500"
        >
          Enter Watch Catalog
        </Link>
      </section>

    </div>
  );
};

export default Timepieces;
