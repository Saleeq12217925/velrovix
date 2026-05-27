import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/common/AnimatedText';
import SectionTitle from '../components/common/SectionTitle';

const Fragrances = () => {
  const collections = [
    {
      name: "The Floral Archives",
      slug: "floral",
      description: "Harvested at dawn in Grasse. Centifolia rose, neroli, and white jasmine captured at peak bloom.",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "The Oriental Reserve",
      slug: "oriental",
      description: "Spices from the Silk Road. Warm amber, crushed cardamom, and aged vanilla absolute.",
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "The Resinous Dark",
      slug: "dark",
      description: "Sacred smoke and ancient woods. Cambodian oud, frankincense, and dark cedarwood.",
      image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  return (
    <div className="bg-luxury-black min-h-screen">
      
      {/* 1. Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615397323145-21d15db99e63?auto=format&fit=crop&w=1920&q=80" 
            alt="Fragrance Hero" 
            className="w-full h-full object-cover filter brightness-[0.25] animate-slow-pan"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-transparent to-luxury-black" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
            <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] text-luxury-accent font-semibold uppercase block mb-4">
              HAUTE PARFUMERIE
            </span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-8xl tracking-luxury text-luxury-cream font-light leading-[1.1]">
            <AnimatedText text="Olfactory Alchemy" delay={0.3} variant="word" />
          </h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.2, duration: 1.5 }}
            className="font-sans text-xs md:text-sm text-luxury-cream max-w-xl mx-auto leading-relaxed font-light"
          >
            Distilling the rare, the sacred, and the ephemeral into liquid emotion. Master perfumery for the bold.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-55 animate-bounce">
          <span className="font-sans text-[8px] tracking-[0.35em] text-luxury-cream font-light">INHALE</span>
          <div className="w-[1px] h-8 bg-luxury-accent/50" />
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center space-y-12">
        <SectionTitle subtitle="OUR PHILOSOPHY" title="The Architecture of Scent" />
        <p className="font-sans text-sm md:text-base text-luxury-neutralGray leading-loose max-w-3xl mx-auto font-light">
          A Velrovix fragrance is not merely mixed; it is composed like a symphony. We source ingredients from the world's most remote corners—from the oud-rich forests of Cambodia to the high-altitude jasmine fields of India. Each bottle contains 30% pure perfume extract, ensuring a silage that lingers long after you have departed.
        </p>
      </section>

      {/* 3. The Collections */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 space-y-16">
        <SectionTitle subtitle="DIRECTORIES" title="Scent Profiles" />
        
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
                <div className="absolute inset-0 bg-luxury-cream/0 group-hover:bg-luxury-cream/5 transition-colors duration-500" />
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6 md:px-12">
                <span className="font-sans text-[10px] tracking-[0.3em] text-luxury-accent font-bold uppercase">
                  PROFILE 0{idx + 1}
                </span>
                <h3 className="font-serif text-4xl text-luxury-cream">{coll.name}</h3>
                <p className="font-sans text-sm text-luxury-neutralGray leading-relaxed max-w-md">
                  {coll.description}
                </p>
                <div className="pt-6">
                  <Link 
                    to={`/catalog?category=perfumes&search=${coll.slug}`} 
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
        <h2 className="font-serif text-3xl md:text-5xl text-luxury-cream mb-8">View the Full Library</h2>
        <Link 
          to="/catalog?category=perfumes" 
          className="inline-block border border-luxury-accent px-10 py-4 text-xs font-sans tracking-[0.2em] uppercase text-luxury-accent hover:bg-luxury-accent hover:text-black transition-colors duration-500"
        >
          Enter Fragrance Catalog
        </Link>
      </section>

    </div>
  );
};

export default Fragrances;
