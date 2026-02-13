import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { products, type Product } from '@/data/products';

export interface CartItem {
  productId: string;
  quantity: number;
  notes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, qty?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  getProduct: (id: string) => Product | undefined;
  cartSubtotal: number;
  onAddItemCallback?: (productId: string) => void;
  setOnAddItemCallback: (callback: (productId: string) => void) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'fursheti-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Use useRef to store callback to avoid stale closure issues
  const onAddItemCallbackRef = useRef<((productId: string) => void) | undefined>();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const setOnAddItemCallback = useCallback((callback: (productId: string) => void) => {
    onAddItemCallbackRef.current = callback;
  }, []);

  const addItem = useCallback((productId: string, qty = 1, notes = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId
          ? { ...i, quantity: i.quantity + qty }
          : i
        );
      }
      return [...prev, { productId, quantity: qty, notes }];
    });
    
    // Trigger callback after adding item
    if (onAddItemCallbackRef.current) {
      onAddItemCallbackRef.current(productId);
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  }, []);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, notes } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getProduct = useCallback((id: string) => products.find(p => p.id === id), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const cartSubtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateNotes, clearCart, totalItems, getProduct, cartSubtotal, onAddItemCallback: onAddItemCallbackRef.current, setOnAddItemCallback }}>
      {children}
    </CartContext.Provider>
  );
};
