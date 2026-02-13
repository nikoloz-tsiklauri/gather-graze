import React from 'react';
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

  const deliveryFee = cartSubtotal >= business.delivery.freeThreshold ? 0 : business.delivery.baseFee;
  const total = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    closeCartDrawer();
    handleOrderCTA();
  };

  return (
    <Sheet open={cartDrawerOpen} onOpenChange={(open) => !open && closeCartDrawer()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0 h-[85vh] sm:h-full"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-heading font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">{t('cart.emptyDesc')}</p>
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
                    className={`rounded-lg border bg-card p-3 transition-all duration-300 ${
                      isLastAdded ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div 
                        className="h-16 w-16 shrink-0 rounded-lg flex items-center justify-center text-2xl" 
                        style={{ background: product.gradient }}
                      >
                        {product.category === 'canapes' ? '🥪' : 
                         product.category === 'salads' ? '🥗' : 
                         product.category === 'hot' ? '🍖' : 
                         product.category === 'desserts' ? '🍰' : '🥂'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {product.name[lang] || product.name.en}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {product.price}{t('common.gel')} / {t(`unit.${product.unit}`)}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-md border border-border">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                              className="p-1 hover:bg-secondary rounded-l-md"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                              className="p-1 hover:bg-secondary rounded-r-md"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-primary">
                              {(product.price * item.quantity).toFixed(2)}{t('common.gel')}
                            </span>
                            <button 
                              onClick={() => removeItem(item.productId)} 
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
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
          <SheetFooter className="px-6 py-4 border-t border-border flex-col gap-4 mt-auto">
            {/* Total Summary */}
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="font-medium">{cartSubtotal.toFixed(2)}{t('common.gel')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.delivery')}</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}${t('common.gel')}`}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base">
                <span className="font-bold">{t('cart.total')}</span>
                <span className="font-bold text-primary">{total.toFixed(2)}{t('common.gel')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                {t('cart.checkout')}
              </Button>
              <Button 
                onClick={closeCartDrawer}
                variant="outline"
                className="w-full"
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
