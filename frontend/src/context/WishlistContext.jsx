import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

const getProductKey = (product) => product?._id || product?.slug;

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('velrovix_wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('velrovix_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = (product) => {
    const productKey = typeof product === 'string' ? product : getProductKey(product);
    return wishlist.some((item) => getProductKey(item) === productKey);
  };

  const toggleWishlist = (product) => {
    const productKey = getProductKey(product);
    if (!productKey) return;

    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some((item) => getProductKey(item) === productKey);
      return exists
        ? currentWishlist.filter((item) => getProductKey(item) !== productKey)
        : [...currentWishlist, product];
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('velrovix_wishlist');
  };

  // Restore a user's saved wishlist (called after login)
  const loadWishlist = (items) => {
    const safeItems = Array.isArray(items) ? items : [];
    setWishlist(safeItems);
    localStorage.setItem('velrovix_wishlist', JSON.stringify(safeItems));
  };

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      loadWishlist,
    }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
};
