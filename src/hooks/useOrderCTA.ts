import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';

export const useOrderCTA = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { t } = useLanguage();

  const handleOrderCTA = () => {
    if (items.length === 0) {
      // Cart is empty - navigate to menu and show toast
      toast({
        description: t('cart.emptyToast'),
        duration: 4000,
      });
      navigate('/menu');
      
      // Scroll to product list after navigation
      setTimeout(() => {
        const menuList = document.getElementById('menu-list');
        if (menuList) {
          menuList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Cart has items - navigate to checkout
      navigate('/checkout');
    }
  };

  return { handleOrderCTA };
};
