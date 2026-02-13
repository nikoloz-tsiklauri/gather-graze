import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to integrate cart drawer with add-to-cart actions
 * Automatically opens drawer and shows toast when items are added
 */
export const useCartDrawer = () => {
  const { setOnAddItemCallback } = useCart();
  const { openCartDrawer } = useUI();
  const { t } = useLanguage();

  useEffect(() => {
    // Set up callback to handle add-to-cart events
    setOnAddItemCallback((productId: string) => {
      // Show toast notification
      toast({
        description: t('cart.addedToast'),
        duration: 2000,
      });
      
      // Open cart drawer with last added product
      openCartDrawer(productId);
    });

    // Cleanup on unmount
    return () => {
      setOnAddItemCallback(() => {});
    };
  }, [setOnAddItemCallback, openCartDrawer, t]);
};
