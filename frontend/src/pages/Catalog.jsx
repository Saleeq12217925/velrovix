import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Timepieces', value: 'watches' },
  { label: 'Fragrances', value: 'perfumes' },
];
const MOODS = ['Royal', 'Bold', 'Minimal', 'Dark Luxury'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Bestsellers', value: 'bestseller' },
];

const SkeletonCard = () => (
  <div className="flex flex-col bg-luxury-darkGray border border-white/5 rounded overflow-hidden animate-pulse">
    <div className="h-[320px] bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-2 bg-white/5 rounded w-1/3" />
      <div className="h-3 bg-white/5 rounded w-3/4" />
      <div className="h-2 bg-white/5 rounded w-1/2" />
    </div>
  </div>
);

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [mood, setMood] = useState(searchParams.get('mood') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef(null);

  // ── Sync URL → state (when Navbar links change the URL externally) ──
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setMood(searchParams.get('mood') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Sync state → URL
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (mood) params.mood = mood;
    if (sort && sort !== 'newest') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, category, mood, sort]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (mood) params.set('mood', mood);
      if (sort) params.set('sort', sort);
      params.set('limit', '48');
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, mood, sort]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [fetchProducts]);

  const clearAllFilters = () => { setSearch(''); setCategory(''); setMood(''); setSort('newest'); };
  const activeFilterCount = [search, category, mood, sort !== 'newest' ? sort : ''].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-sans text-[10px] tracking-editorial text-luxury-accent font-semibold block">
            THE ARCHIVE
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl tracking-luxury text-luxury-cream">
            Editorial Catalog
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1.0, delay: 0.3 }}
            className="font-sans text-xs text-luxury-cream leading-relaxed">
            Curated precision instruments and rare olfactory narratives.
          </motion.p>
        </header>

        {/* Search + Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="space-y-6">

          {/* Elegant underline search */}
          <div className="relative group max-w-2xl mx-auto">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-accent/60 group-focus-within:text-luxury-accent transition-colors duration-300" />
            <input
              id="catalog-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timepieces, fragrances, moods..."
              className="w-full bg-transparent border-0 border-b border-white/10 focus:border-luxury-accent/60 pl-8 pr-8 py-3.5 font-sans text-sm text-luxury-cream placeholder-luxury-neutralGray/30 focus:outline-none transition-all duration-500 focus:placeholder-luxury-neutralGray/20"
            />
            {/* animated gold underline */}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-accent group-focus-within:w-full transition-all duration-500 ease-out" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-neutralGray/40 hover:text-luxury-accent transition-colors duration-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls row — filter toggle + sort */}
          <div className="flex items-center justify-between">
            <button
              id="catalog-filter-toggle"
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2.5 font-sans text-[9px] tracking-[0.3em] font-semibold uppercase transition-colors duration-300 relative group"
            >
              <span className={activeFilterCount > 0 ? 'text-luxury-accent' : 'text-luxury-neutralGray group-hover:text-luxury-cream'}>
                {showFilters ? '— CLOSE' : '+ REFINE'}
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-luxury-accent text-luxury-black font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray/50 hidden sm:block">SORT BY</span>
              <div className="relative">
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent border-b border-white/10 hover:border-luxury-accent/40 focus:border-luxury-accent/60 pl-0 pr-6 pb-1 pt-0.5 font-sans text-[10px] tracking-luxury text-luxury-cream focus:outline-none transition-all duration-300 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-luxury-darkGray text-luxury-cream">{o.label}</option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-2.5 h-2.5 text-luxury-accent" fill="none" viewBox="0 0 10 6">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable refined filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/5 pt-8 pb-2 space-y-8">
                  {/* Category */}
                  <div className="space-y-4">
                    <p className="font-sans text-[8px] tracking-[0.4em] text-luxury-neutralGray/60 font-semibold uppercase">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => (
                        <button key={c.value} onClick={() => setCategory(c.value)}
                          className={`font-sans text-[10px] tracking-luxury px-6 py-2 rounded-full border transition-all duration-300 ${
                            category === c.value
                              ? 'bg-luxury-accent text-luxury-black border-luxury-accent font-bold'
                              : 'bg-transparent text-luxury-neutralGray border-white/8 hover:border-luxury-accent/30 hover:text-luxury-cream'
                          }`}>{c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="space-y-4">
                    <p className="font-sans text-[8px] tracking-[0.4em] text-luxury-neutralGray/60 font-semibold uppercase">Mood / Ambience</p>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((m) => (
                        <button key={m} onClick={() => setMood(mood === m ? '' : m)}
                          className={`font-sans text-[10px] tracking-luxury px-6 py-2 rounded-full border transition-all duration-300 ${
                            mood === m
                              ? 'bg-luxury-accent text-luxury-black border-luxury-accent font-bold'
                              : 'bg-transparent text-luxury-neutralGray border-white/8 hover:border-luxury-accent/30 hover:text-luxury-cream'
                          }`}>{m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters}
                      className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray/50 hover:text-luxury-accent transition-colors duration-300 flex items-center gap-2 uppercase">
                      <X className="w-2.5 h-2.5" /> Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {search && (
                <span className="flex items-center gap-1.5 text-luxury-accent font-sans text-[9px] tracking-wide border-b border-luxury-accent/30 pb-0.5">
                  "{search}" <button onClick={() => setSearch('')}><X className="w-2.5 h-2.5 ml-1" /></button>
                </span>
              )}
              {category && (
                <span className="flex items-center gap-1.5 text-luxury-accent font-sans text-[9px] tracking-wide border-b border-luxury-accent/30 pb-0.5 capitalize">
                  {category} <button onClick={() => setCategory('')}><X className="w-2.5 h-2.5 ml-1" /></button>
                </span>
              )}
              {mood && (
                <span className="flex items-center gap-1.5 text-luxury-accent font-sans text-[9px] tracking-wide border-b border-luxury-accent/30 pb-0.5">
                  {mood} <button onClick={() => setMood('')}><X className="w-2.5 h-2.5 ml-1" /></button>
                </span>
              )}
            </div>
          )}
        </motion.div>


        {/* Results count */}
        {!loading && (
          <div className="flex items-center border-b border-white/5 pb-4">
            <p className="font-sans text-xs text-luxury-neutralGray">
              <span className="text-luxury-cream font-semibold">{products.length}</span> {products.length === 1 ? 'piece' : 'pieces'} curated
            </p>
          </div>
        )}

        {/* Grid / Skeleton / Empty state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-luxury-neutralGray/40" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-luxury-cream">No Pieces Found</h3>
              <p className="font-sans text-xs text-luxury-neutralGray max-w-xs leading-relaxed">
                Your query returned no results. Adjust your filters or explore the full collection.
              </p>
            </div>
            <button onClick={clearAllFilters}
              className="font-sans text-xs tracking-luxury text-luxury-accent hover:text-luxury-cream border border-luxury-accent/30 hover:border-luxury-cream/30 px-6 py-2.5 rounded-full transition-all duration-300">
              CLEAR ALL FILTERS
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div key={product._id || product.slug} layout
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default Catalog;
