import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const {
    name = "Chronomètre Impérial",
    slug = "chronometre-imperial",
    price = 14500,
    category = { name: "Watches" },
    images = [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" }],
    mood = "Royal",
    newArrival = false,
    bestseller = false
  } = product || {};

  const imageUrl = images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
  const activeWishlist = isWishlisted(product || { slug });
  const activeCart = isInCart(product || { slug });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className="group relative flex flex-col bg-luxury-darkGray border border-white/5 overflow-hidden rounded transition-all duration-500 hover:border-luxury-accent/20"
    >
      {/* Absolute Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-none">
        {newArrival && (
          <span className="bg-luxury-accent text-luxury-black font-sans text-[8px] font-bold tracking-editorial px-2 py-0.5 rounded-sm uppercase">
            NEW
          </span>
        )}
        {bestseller && (
          <span className="bg-white/10 backdrop-blur-md text-luxury-cream font-sans text-[8px] font-medium tracking-editorial px-2 py-0.5 rounded-sm uppercase">
            BEST SELLER
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product || { name, slug, price, category, images, mood, newArrival, bestseller });
            const alreadyWishlisted = isWishlisted(product || { slug });
            showToast({
              message: alreadyWishlisted
                ? `${name} removed from wishlist`
                : `${name} added to wishlist`,
              type: 'wishlist',
            });
          }}
          aria-label={activeWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`bg-luxury-black/60 hover:bg-luxury-accent hover:text-luxury-black p-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 ${
            activeWishlist ? 'text-luxury-accent' : 'text-luxury-cream'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activeWishlist ? 'fill-current' : ''}`} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const prodToUse = product || { name, slug, price, category, images, mood, newArrival, bestseller };
            if (activeCart) {
              removeFromCart(prodToUse._id || prodToUse.slug);
              showToast({ message: `${name} removed from your cart`, type: 'info' });
            } else {
              addToCart(prodToUse);
              showToast({ message: `${name} added to your cart`, type: 'cart' });
            }
          }}
          aria-label={activeCart ? 'Remove from cart' : 'Add to cart'}
          className={`p-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
            activeCart ? 'bg-luxury-accent text-luxury-black border-luxury-accent' : 'bg-luxury-black/60 hover:bg-luxury-accent hover:text-luxury-black text-luxury-cream border-white/10'
          }`}
        >
          <ShoppingBag className={`w-3.5 h-3.5 ${activeCart ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link to={`/products/${slug}`} className="relative h-[320px] md:h-[400px] w-full overflow-hidden block bg-luxury-black">
        <img 
          src={imageUrl} 
          alt={name} 
          loading="lazy"
          className="w-full h-full object-cover object-center breathing-img"
        />
        {/* Soft elegant shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      </Link>

      {/* Details Container */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-3 z-10 bg-luxury-darkGray relative">
        <div className="space-y-1">
          <span className="font-sans text-[9px] tracking-luxury text-luxury-accent uppercase font-medium">
            {category.name} &bull; {mood}
          </span>
          <Link to={`/products/${slug}`}>
            <h3 className="font-serif text-base tracking-wide text-luxury-cream hover:text-luxury-accent transition-colors duration-300 truncate">
              {name}
            </h3>
          </Link>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="font-sans text-xs tracking-luxury text-luxury-neutralGray">
            VALUED AT
          </span>
          <span className="font-serif text-sm text-luxury-accent font-semibold">
            ${price.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
