import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const getProductKey = (product) => product?._id || product?.slug;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('velrovix_cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('velrovix_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    const productKey = getProductKey(product);
    if (!productKey) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => getProductKey(item.product) === productKey);

      if (existingItem) {
        return currentCart.map((item) =>
          getProductKey(item.product) === productKey
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [...currentCart, { product, qty }];
    });
  };

  const removeFromCart = (productKey) => {
    setCart((currentCart) =>
      currentCart.filter((item) => getProductKey(item.product) !== productKey)
    );
  };

  const updateQty = (productKey, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);

    setCart((currentCart) =>
      currentCart.map((item) =>
        getProductKey(item.product) === productKey ? { ...item, qty: nextQty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.qty, 0);

  const isInCart = (product) => {
    const productKey = getProductKey(product);
    return cart.some((item) => getProductKey(item.product) === productKey);
  };

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
      isInCart,
    }),
    [cart, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
