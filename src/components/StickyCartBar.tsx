import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  guestCount: number;
}

const StickyCartBar: React.FC<Props> = ({ guestCount }) => {
  const { t } = useLanguage();
  const { items, totalItems, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl backdrop-blur-md animate-slide-up">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {totalItems} {t('menu.itemsInCart')}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{guestCount} {t('menu.guests')}</span>
              <span className="text-border">•</span>
              <span className="font-bold text-foreground text-lg">
                {cartSubtotal.toFixed(2)}{t('common.gel')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="md:hidden flex flex-col items-end">
              <span className="text-xs text-muted-foreground">{guestCount} {t('menu.guests')}</span>
              <span className="font-bold text-primary text-lg">
                {cartSubtotal.toFixed(2)}{t('common.gel')}
              </span>
            </div>
            
            <Button
              onClick={() => navigate('/checkout')}
              className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg transition-all duration-200 active:scale-95 font-semibold"
              size="lg"
            >
              {t('menu.viewCart')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
