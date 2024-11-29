import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/ProductService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(async (product) => {
    try {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        setCart(currentCart =>
          currentCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart(currentCart => [...currentCart, { ...product, quantity: 1 }]);
      }
      
      await productService.updateStock(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [cart]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const item = cart.find(item => item.id === productId);
      if (!item) return;

      setCart(currentCart => currentCart.filter(item => item.id !== productId));
      await productService.updateStock(productId, -item.quantity);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [cart]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    try {
      if (newQuantity < 0) return;
      
      const item = cart.find(item => item.id === productId);
      if (!item) return;

      const quantityDiff = newQuantity - item.quantity;
      
      if (newQuantity === 0) {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
      } else {
        setCart(currentCart =>
          currentCart.map(item =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
      
      await productService.updateStock(productId, quantityDiff);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    try {
      await Promise.all(
        cart.map(item => productService.updateStock(item.id, -item.quantity))
      );
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isEnabled
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}