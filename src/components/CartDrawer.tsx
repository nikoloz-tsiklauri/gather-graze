import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useOrderCTA } from '@/hooks/useOrderCTA';
import { business } from '@/config/business';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CartDrawer: React.FC = () => {
  const { lang, t } = useLanguage();
  const { items, getProduct, updateQuantity, removeItem, cartSubtotal } = useCart();
  const { cartDrawerOpen, closeCartDrawer, lastAddedProductId } = useUI();
  const { handleOrderCTA } = useOrderCTA();
  const navigate = useNavigate();

  const deliveryFee = cartSubtotal >= business.delivery.freeThreshold ? 0 : business.delivery.baseFee;
  const total = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    closeCartDrawer();
    handleOrderCTA();
  };

  const handleContinueShopping = () => {
    closeCartDrawer();
    navigate('/menu');
  };

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0 h-[85vh] sm:h-full"
      >
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-border/50">
          <SheetTitle className="text-2xl font-heading font-bold flex items-center gap-2.5 tracking-tight">
            <ShoppingBag className="h-6 w-6" />
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="rounded-full bg-secondary/50 p-6 mb-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-base">{t('cart.emptyDesc')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const product = getProduct(item.productId);
                if (!product) return null;
                
                const isLastAdded = item.productId === lastAddedProductId;
                
                return (
                  <div 
                    key={item.productId} 
                    className={`rounded-xl border bg-card p-4 transition-all duration-300 ${
                      isLastAdded ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border/60 hover:border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div 
                        className="h-20 w-20 shrink-0 rounded-xl flex items-center justify-center text-3xl shadow-sm" 
                        style={{ background: product.gradient }}
                      >
                        {product.category === 'canapes' ? '🥪' : 
                         product.category === 'salads' ? '🥗' : 
                         product.category === 'hot' ? '🍖' : 
                         product.category === 'desserts' ? '🍰' : '🥂'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-base truncate leading-tight">
                          {product.name[lang] || product.name.en}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {product.price}{t('common.gel')} / {t(`unit.${product.unit}`)}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center rounded-lg border border-border/60 shadow-sm bg-background">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                              className="p-1.5 hover:bg-secondary rounded-l-lg transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                              className="p-1.5 hover:bg-secondary rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-primary">
                              {(product.price * item.quantity).toFixed(2)}{t('common.gel')}
                            </span>
                            <button 
                              onClick={() => removeItem(item.productId)} 
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Always Visible */}
        {items.length > 0 && (
          <SheetFooter className="px-6 py-5 border-t border-border/50 flex-col gap-5 mt-auto bg-background/50 backdrop-blur-sm">
            {/* Total Summary */}
            <div className="space-y-2.5 text-sm w-full">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">{t('cart.subtotal')}</span>
                <span className="font-semibold">{cartSubtotal.toFixed(2)}{t('common.gel')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">{t('cart.delivery')}</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}${t('common.gel')}`}
                </span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between text-base">
                <span className="font-bold text-lg">{t('cart.total')}</span>
                <span className="font-bold text-lg text-primary">{total.toFixed(2)}{t('common.gel')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                size="lg"
              >
                {t('cart.checkout')}
              </Button>
              <Button 
                onClick={handleContinueShopping}
                variant="outline"
                className="w-full rounded-xl border-border/60 hover:bg-secondary/50 transition-all duration-200"
                size="lg"
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
