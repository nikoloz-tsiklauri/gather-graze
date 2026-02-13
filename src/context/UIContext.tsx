import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
  cartDrawerOpen: boolean;
  lastAddedProductId: string | null;
  openCartDrawer: (productId?: string) => void;
  closeCartDrawer: () => void;
}

const UIContext = createContext<UIContextType>({} as UIContextType);

export const useUI = () => useContext(UIContext);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null);

  const openCartDrawer = useCallback((productId?: string) => {
    if (productId) {
      setLastAddedProductId(productId);
    }
    setCartDrawerOpen(true);
  }, []);

  const closeCartDrawer = useCallback(() => {
    setCartDrawerOpen(false);
    // Clear last added product after a delay to allow animation
    setTimeout(() => setLastAddedProductId(null), 300);
  }, []);

  return (
    <UIContext.Provider value={{ cartDrawerOpen, lastAddedProductId, openCartDrawer, closeCartDrawer }}>
      {children}
    </UIContext.Provider>
  );
};
