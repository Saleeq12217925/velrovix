import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import SectionTitle from '../components/common/SectionTitle';
import AnimatedText from '../components/common/AnimatedText';
import ProductCard from '../components/product/ProductCard';
import MoodCard from '../components/product/MoodCard';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeProducts = async () => {
      try {
        const [featuredResponse, bestsellerResponse] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?bestseller=true&limit=4'),
        ]);

        if (!isMounted) return;

        setFeaturedProducts(featuredResponse.data.products || []);
        setBestsellerProducts(bestsellerResponse.data.products || []);
      } catch (error) {
        if (!isMounted) return;
        setFeaturedProducts(fallbackProducts);
        setBestsellerProducts(fallbackProducts.filter((product) => product.bestseller));
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    fetchHomeProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackProducts = [
    {
      name: "Astral Tourbillon Gold",
      slug: "astral-tourbillon-gold",
      price: 24500,
      category: { name: "Watches" },
      images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" }],
      mood: "Royal",
      newArrival: true
    },
    {
      name: "Oud Mystère Extrait",
      slug: "oud-mystere-extrait",
      price: 380,
      category: { name: "Perfumes" },
      images: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" }],
      mood: "Dark Luxury",
      bestseller: true
    },
    {
      name: "Obsidian Skeleton",
      slug: "obsidian-skeleton",
      price: 18900,
      category: { name: "Watches" },
      images: [{ url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80" }],
      mood: "Bold"
    },
    {
      name: "Néroli Infini",
      slug: "neroli-infini",
      price: 320,
      category: { name: "Perfumes" },
      images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" }],
      mood: "Minimal",
      newArrival: true
    }
  ];

  const moods = [
    { name: "Royal", subtitle: "Sovereign Scent & Precision", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { name: "Bold", subtitle: "Uncompromising Integrity", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80" },
    { name: "Minimal", subtitle: "Purity of Design", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
    { name: "Dark Luxury", subtitle: "Nocturnal Mystique", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="bg-luxury-black overflow-hidden select-none">
      
      {/* 1. Cinematic Fullscreen Hero — Split Background */}
      <section className="relative h-screen flex items-center justify-center bg-luxury-black overflow-hidden">

        {/* LEFT HALF — Watch background */}
        <div className="absolute inset-y-0 left-0 w-1/2 z-0">
          <img
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury watch"
            className="w-full h-full object-cover brightness-[0.28]"
          />
          {/* Inner gradient toward center */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/60 via-transparent to-luxury-black/80" />
        </div>

        {/* RIGHT HALF — Perfume background */}
        <div className="absolute inset-y-0 right-0 w-1/2 z-0">
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury perfume"
            className="w-full h-full object-cover brightness-[0.28]"
          />
          {/* Inner gradient toward center */}
          <div className="absolute inset-0 bg-gradient-to-l from-luxury-black/60 via-transparent to-luxury-black/80" />
        </div>

        {/* Center vertical gold divider */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-luxury-accent/50 to-transparent" />
        </div>

        {/* Top + bottom dark fade */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-luxury-black/70 via-transparent to-luxury-black pointer-events-none" />

        {/* Hero Text — centered over both halves */}
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="font-sans text-[10px] md:text-xs tracking-[0.35em] text-luxury-accent font-semibold uppercase block mb-4">
              HAUTE LUXE INTERACTIVE COMMERCE
            </span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-8xl tracking-luxury text-luxury-cream font-light leading-[1.1]">
            <AnimatedText text="Aesthetics of Precision" delay={0.3} variant="word" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="font-sans text-xs md:text-sm text-luxury-cream max-w-xl mx-auto leading-relaxed font-light"
          >
            Explore mechanical perfection and high olfactory narratives curated for collectors.
          </motion.p>

          {/* Split CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1.2 }}
            className="pt-8 flex flex-col sm:flex-row justify-center items-stretch gap-0 max-w-xl mx-auto"
          >
            {/* Watch CTA — left */}
            <Link to="/timepieces" className="flex-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-luxury-accent/0 group-hover:bg-luxury-accent/5 transition-all duration-500" />
              <div className="border border-luxury-accent bg-luxury-accent text-luxury-black group-hover:bg-amber-400 transition-all duration-300 px-8 py-4 text-center">
                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase">Explore Timepieces</span>
              </div>
            </Link>

            {/* Center divider line */}
            <div className="hidden sm:block w-[1px] bg-luxury-accent/30 flex-shrink-0" />

            {/* Perfume CTA — right */}
            <Link to="/fragrances" className="flex-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-luxury-cream/0 group-hover:bg-luxury-cream/5 transition-all duration-500" />
              <div className="border border-white/30 group-hover:border-luxury-accent/60 transition-all duration-300 px-8 py-4 text-center">
                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-luxury-cream group-hover:text-luxury-accent transition-colors duration-300">Discover Fragrances</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none opacity-55 animate-bounce">
          <span className="font-sans text-[8px] tracking-[0.35em] text-luxury-cream font-light">SCROLL</span>
          <div className="w-[1px] h-8 bg-luxury-accent/50" />
        </div>
      </section>


      {/* 2. Philosophy & Storytelling Block */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-8 border-y border-white/5 bg-luxury-black relative z-10">
        <span className="font-sans text-[10px] tracking-editorial text-luxury-accent font-bold">
          OUR CREDO
        </span>
        <blockquote className="font-serif text-2xl md:text-4xl text-luxury-cream leading-relaxed max-w-4xl mx-auto font-light italic">
          "True luxury is not defined by visibility, but by the quiet confidence of calibration. It resides in the silent sweep of a tourbillon and the lingering memory of an olfactory shadow."
        </blockquote>
        <p className="font-sans text-xs text-luxury-neutralGray tracking-wide max-w-2xl mx-auto leading-relaxed">
          At Velrovix, we curate products as statements of personal identity. Our watches reflect master structural engineering; our fragrances represent complex chemistry. We invite you to transcend typical retail and experience absolute curation.
        </p>
      </section>

      {/* 3. Featured Watch Showcase (Storytelling) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <SectionTitle subtitle="TIMEPIECE SPOTLIGHT" title="Astral Tourbillon Gold" alignment="left" />
          <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
            Crafted from solid marine bronze and matte grade-5 titanium, the Astral Tourbillon Gold houses our bespoke self-winding movement, boasting a 72-hour power reserve. Featuring an open-heart dial trace revealing internal balance wheels calibrated to 1/1000th of a second.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="border-l border-luxury-accent/30 pl-4 py-2 space-y-1">
              <h4 className="font-serif text-sm text-luxury-accent">Movement</h4>
              <p className="font-sans text-[10px] text-luxury-neutralGray uppercase">Caliber V-26 Tourbillon</p>
            </div>
            <div className="border-l border-luxury-accent/30 pl-4 py-2 space-y-1">
              <h4 className="font-serif text-sm text-luxury-accent">Case Weight</h4>
              <p className="font-sans text-[10px] text-luxury-neutralGray uppercase">115 Grams Grade-5 Ti</p>
            </div>
          </div>
          <div className="pt-6">
            <Link to="/products/astral-tourbillon-gold">
              <Button variant="outline">VIEW DETAILS</Button>
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded border border-white/5 group h-[450px] md:h-[550px]">
          <img 
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80" 
            alt="Tourbillon Zoom"
            className="w-full h-full object-cover breathing-img" 
          />
          <div className="absolute inset-0 bg-luxury-black/10 group-hover:bg-transparent transition-colors duration-1000" />
        </div>
      </section>

      {/* 4. Featured Perfume Showcase (Storytelling) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/5">
        <div className="relative overflow-hidden rounded border border-white/5 group h-[450px] md:h-[550px] lg:order-first order-last">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80" 
            alt="Perfume Zoom"
            className="w-full h-full object-cover breathing-img" 
          />
          <div className="absolute inset-0 bg-luxury-black/10 group-hover:bg-transparent transition-colors duration-1000" />
        </div>
        <div className="space-y-6">
          <SectionTitle subtitle="OLFACTORY SPOTLIGHT" title="Neroli Infini" alignment="left" />
          <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
            Opening with handpicked Italian neroli and rich Calabrian bergamot, Neroli Infini melts into a warm central heart of damask rose and absolute black vanilla, before settling on base elements of cedarwood and white musk. An sensory experience of dynamic floral nobility.
          </p>
          
          {/* Scent notes visualizer grid */}
          <div className="space-y-4 pt-4">
            <h4 className="font-sans text-[10px] tracking-luxury text-luxury-accent font-bold">FRAGRANCE NOTE SPECTRUM</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-luxury-cream">TOP &bull; Neroli & Bergamot</span>
                  <span className="text-luxury-accent font-semibold">40%</span>
                </div>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-accent w-[40%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-luxury-cream">HEART &bull; Damask Rose & Black Vanilla</span>
                  <span className="text-luxury-accent font-semibold">35%</span>
                </div>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-accent w-[35%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-sans">
                  <span className="text-luxury-cream">BASE &bull; Ambergris, Cedar & White Musk</span>
                  <span className="text-luxury-accent font-semibold">25%</span>
                </div>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-accent w-[25%]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <Link to="/products/neroli-infini">
              <Button variant="outline">DISCOVER THE FRAGRANCE</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Shop By Mood Grid */}
      <section className="py-24 bg-luxury-darkGray border-y border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionTitle subtitle="SENSORY NAVIGATION" title="Shop by Ambience & Mood" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moods.map((m, idx) => (
              <MoodCard key={idx} moodName={m.name} subtitle={m.subtitle} imageUrl={m.img} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals showcase (Sensory products list) */}
      <section className="py-24 bg-luxury-black px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionTitle subtitle="THE GALLERY" title="Featured Masterpieces" />
          {productsLoading ? (
            <div className="border border-white/5 h-64 flex items-center justify-center rounded bg-luxury-charcoal/20 glass-panel">
              <span className="font-sans text-xs tracking-luxury text-luxury-neutralGray">
                CURATING MASTERPIECES...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(featuredProducts.length ? featuredProducts : fallbackProducts).map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-luxury-darkGray px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionTitle subtitle="COLLECTOR FAVORITES" title="Bestselling Icons" />
          {productsLoading ? (
            <div className="border border-white/5 h-64 flex items-center justify-center rounded bg-luxury-charcoal/20 glass-panel">
              <span className="font-sans text-xs tracking-luxury text-luxury-neutralGray">
                READING COLLECTOR SIGNALS...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(bestsellerProducts.length ? bestsellerProducts : fallbackProducts.filter((p) => p.bestseller)).map((p) => (
                <ProductCard key={p._id || p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
