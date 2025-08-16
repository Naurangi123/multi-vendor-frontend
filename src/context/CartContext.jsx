/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;
  
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
  
     
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
  };;

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem("cart");
  };

  
  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};


// // CartContext.jsx
// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// const CART_STORAGE_KEY = 'guest_cart';

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   // Load guest cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem(CART_STORAGE_KEY);
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage when cart changes (for guests)
//   useEffect(() => {
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
//   }, [cart]);

//   // Add item (for guest users)
//   const addItem = (product, quantity = 1) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.product.id === product.id);
//       if (existing) {
//         return prev.map(i => 
//           i.product.id === product.id 
//             ? { ...i, quantity: i.quantity + quantity }
//             : i
//         );
//       }
//       return [...prev, { product, quantity }];
//     });
//   };

//   // Remove item
//   const removeItem = (productId) => {
//     setCart(prev => prev.filter(i => i.product.id !== productId));
//   };

//   // Clear cart
//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
