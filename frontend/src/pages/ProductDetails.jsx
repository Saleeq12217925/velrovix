import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

// ── Skeleton loader ───────────────────────────────────────────
const ProductDetailsSkeleton = () => (
  <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="h-[560px] bg-luxury-darkGray rounded border border-white/5" />
        <div className="space-y-6 pt-4">
          <div className="h-3 bg-white/5 rounded w-1/4" />
          <div className="h-8 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-24 bg-white/5 rounded w-full" />
          <div className="h-12 bg-white/5 rounded w-full" />
        </div>
      </div>
    </div>
  </main>
);

// ── Note bar ─────────────────────────────────────────────────
const NoteBar = ({ label, notes, percent }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[9px] font-sans">
      <span className="text-luxury-cream tracking-wide">{label} • {notes?.join(', ')}</span>
      <span className="text-luxury-accent font-semibold">{percent}%</span>
    </div>
    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-luxury-accent rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────
const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [pairedProduct, setPairedProduct] = useState(null);
  const [activeInfoTab, setActiveInfoTab] = useState('narrative');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    api.get(`/products/${slug}`)
      .then(({ data }) => {
        if (!isMounted) return;
        const fetchedProduct = data.product;
        setProduct(fetchedProduct);
        setActiveImage(0);

        // Fetch Pairing (Opposite category, same mood)
        const oppositeCategory = fetchedProduct.category?.slug === 'watches' ? 'perfumes' : 'watches';
        api.get(`/products?category=${oppositeCategory}&mood=${fetchedProduct.mood}&limit=1`)
          .then(pairRes => {
            if (isMounted && pairRes.data.products?.length > 0) {
              setPairedProduct(pairRes.data.products[0]);
            } else {
              setPairedProduct(null);
            }
          })
          .catch(() => {
            if (isMounted) setPairedProduct(null);
          });
      })
      .catch(() => {
        if (isMounted) setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <ProductDetailsSkeleton />;

  if (notFound) return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="text-center space-y-6">
        <Package className="w-12 h-12 text-luxury-neutralGray/30 mx-auto" />
        <h1 className="font-serif text-3xl text-luxury-cream">Piece Not Found</h1>
        <p className="font-sans text-xs text-luxury-neutralGray">This curation may have been retired from the archive.</p>
        <Link to="/catalog" className="inline-block font-sans text-xs tracking-luxury text-luxury-accent border border-luxury-accent/30 px-6 py-2.5 rounded-full hover:bg-luxury-accent hover:text-luxury-black transition-all duration-300">
          RETURN TO CATALOG
        </Link>
      </div>
    </main>
  );

  const { name, category, mood, price, description, richDescription, images = [], specifications = {}, notes = {} } = product;
  const imageUrl = images[activeImage]?.url || images[0]?.url;
  const wishlisted = isWishlisted(product);
  const activeCart = isInCart(product);
  const isPerfume = category?.slug === 'perfumes';

  const handleAddToCart = () => {
    if (activeCart) {
      removeFromCart(product._id || product.slug);
      showToast({ message: `${name} removed from your cart`, type: 'info' });
    } else {
      addToCart(product, qty);
      showToast({ message: `${name} added to your cart`, type: 'cart' });
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast({
      message: wishlisted ? `${name} removed from wishlist` : `${name} added to wishlist`,
      type: 'wishlist',
    });
  };

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Breadcrumb */}
        <Link to="/catalog" className="inline-flex items-center gap-2 font-sans text-[10px] tracking-luxury text-luxury-neutralGray hover:text-luxury-accent transition-colors duration-300">
          <ArrowLeft className="w-3 h-3" /> BACK TO CATALOG
        </Link>

        {/* Main section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-white/5 bg-luxury-darkGray"
            >
              <img src={imageUrl} alt={name} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/30 via-transparent to-transparent" />
            </motion.div>

            {/* Thumbnail strip (if multiple images) */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === activeImage ? 'border-luxury-accent' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={img.url} alt={img.alt || name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="space-y-8 lg:pt-4"
          >
            {/* Category & mood */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-luxury-accent" />
              <span className="font-sans text-[9px] tracking-[0.3em] text-luxury-accent font-semibold uppercase">
                {category?.name} — {mood}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-5xl text-luxury-cream tracking-wide leading-tight">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl text-luxury-accent">${price?.toLocaleString()}</span>
              <span className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray">USD</span>
            </div>

            {/* ── INTERACTIVE TECH SPECS / NARRATIVE TOGGLE ── */}
            <div className="pt-4 space-y-6">
              <div className="flex gap-8 border-b border-white/10 pb-2">
                <button 
                  onClick={() => setActiveInfoTab('narrative')}
                  className={`font-sans text-[10px] tracking-widest uppercase transition-colors relative ${activeInfoTab === 'narrative' ? 'text-luxury-accent' : 'text-luxury-neutralGray hover:text-luxury-cream'}`}
                >
                  The Narrative
                  {activeInfoTab === 'narrative' && <motion.div layoutId="tab-indicator" className="absolute -bottom-2 left-0 w-full h-[1px] bg-luxury-accent" />}
                </button>
                {Object.keys(specifications || {}).length > 0 && (
                  <button 
                    onClick={() => setActiveInfoTab('specs')}
                    className={`font-sans text-[10px] tracking-widest uppercase transition-colors relative ${activeInfoTab === 'specs' ? 'text-luxury-accent' : 'text-luxury-neutralGray hover:text-luxury-cream'}`}
                  >
                    Technical Data
                    {activeInfoTab === 'specs' && <motion.div layoutId="tab-indicator" className="absolute -bottom-2 left-0 w-full h-[1px] bg-luxury-accent" />}
                  </button>
                )}
              </div>

              <div className="min-h-[120px]">
                {activeInfoTab === 'narrative' ? (
                  <motion.p 
                    key="narrative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-sans text-xs text-luxury-neutralGray leading-relaxed border-l-2 border-luxury-accent/30 pl-4"
                  >
                    {richDescription || description}
                  </motion.p>
                ) : (
                  <motion.div 
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 gap-x-8 gap-y-6"
                  >
                    {Object.entries(specifications || {}).map(([key, val], idx) => (
                      <motion.div 
                        key={key} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className="space-y-1 relative pl-4 border-l border-white/5 hover:border-luxury-accent transition-colors duration-500"
                      >
                        <dt className="font-sans text-[9px] tracking-luxury text-luxury-accent uppercase">{key}</dt>
                        <dd className="font-sans text-xs text-luxury-cream">{val}</dd>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="font-sans text-[9px] tracking-luxury text-luxury-neutralGray uppercase">Qty</span>
              <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-luxury-cream/60 hover:text-luxury-cream transition-colors text-lg leading-none">−</button>
                <span className="font-sans text-sm text-luxury-cream w-6 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="text-luxury-cream/60 hover:text-luxury-cream transition-colors text-lg leading-none">+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                id="product-add-to-cart"
                onClick={handleAddToCart}
                className={`group flex-1 flex items-center justify-between font-sans text-xs font-bold tracking-[0.2em] uppercase px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeCart 
                    ? 'bg-transparent border border-luxury-accent text-luxury-accent hover:bg-luxury-accent/10' 
                    : 'bg-luxury-accent text-luxury-black border border-luxury-accent hover:bg-amber-400'
                }`}
              >
                <span>{activeCart ? 'REMOVE FROM CART' : 'ADD TO CART'}</span>
                <ShoppingBag className={`w-4 h-4 group-hover:scale-110 transition-transform duration-300 ${activeCart ? 'fill-current' : ''}`} />
              </button>
              <button
                id="product-wishlist-toggle"
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                  wishlisted
                    ? 'bg-luxury-accent/10 border-luxury-accent text-luxury-accent'
                    : 'border-white/10 text-luxury-cream/60 hover:border-luxury-accent/40 hover:text-luxury-accent'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Fragrance notes (perfumes only) */}
            {isPerfume && (notes.top?.length > 0 || notes.heart?.length > 0 || notes.base?.length > 0) && (
              <div className="space-y-5 border-t border-white/5 pt-6">
                <h3 className="font-sans text-[9px] tracking-[0.3em] text-luxury-neutralGray font-semibold uppercase">
                  Fragrance Note Spectrum
                </h3>
                <div className="space-y-4">
                  {notes.top?.length > 0 && <NoteBar label="TOP" notes={notes.top} percent={40} />}
                  {notes.heart?.length > 0 && <NoteBar label="HEART" notes={notes.heart} percent={35} />}
                  {notes.base?.length > 0 && <NoteBar label="BASE" notes={notes.base} percent={25} />}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Phase B: Haute Luxe Mood Curations (The Combo) ── */}
        {pairedProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="pt-24 border-t border-white/5"
          >
            <div className="text-center space-y-4 mb-16">
              <span className="font-sans text-[10px] tracking-[0.3em] text-luxury-accent font-bold uppercase">
                AESTHETIC SYNERGY
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-luxury-cream">Complete The {mood} Aesthetic</h2>
              <p className="font-sans text-xs text-luxury-neutralGray max-w-xl mx-auto">
                The perfect olfactory and structural pairing. Elevate your presence with this curated combination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-luxury-darkGray p-8 md:p-12 border border-white/5 rounded-xl">
              <div className="flex flex-col justify-center space-y-6">
                <h3 className="font-serif text-2xl text-luxury-cream tracking-wide">{pairedProduct.name}</h3>
                <p className="font-sans text-xs text-luxury-neutralGray leading-relaxed">
                  {pairedProduct.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl text-luxury-accent">${pairedProduct.price?.toLocaleString()}</span>
                </div>
                <div>
                  <Link to={`/products/${pairedProduct.slug}`} className="inline-flex border border-luxury-accent px-8 py-3 text-[10px] font-sans tracking-[0.2em] uppercase text-luxury-accent hover:bg-luxury-accent hover:text-black transition-colors duration-500">
                    VIEW COMPANION PIECE
                  </Link>
                </div>
              </div>
              <div className="h-[300px] md:h-[400px] rounded overflow-hidden border border-white/5 group">
                <img 
                  src={pairedProduct.images?.[0]?.url} 
                  alt={pairedProduct.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
};

export default ProductDetails;
