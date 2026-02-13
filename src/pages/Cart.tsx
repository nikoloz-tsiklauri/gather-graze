import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useOrderCTA } from '@/hooks/useOrderCTA';
import { business } from '@/config/business';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const { lang, t } = useLanguage();
  const { items, getProduct, updateQuantity, removeItem, cartSubtotal } = useCart();
  const { handleOrderCTA } = useOrderCTA();

  const deliveryFee = cartSubtotal >= business.delivery.freeThreshold ? 0 : business.delivery.baseFee;

  if (items.length === 0) {
    return (
      <main className="py-20">
        <div className="container max-w-lg text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
          <h1 className="heading-display text-3xl mb-2">{t('cart.empty')}</h1>
          <p className="text-muted-foreground mb-6">{t('cart.emptyDesc')}</p>
          <Link to="/menu" className="inline-flex rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {t('cart.goToMenu')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      <div className="container max-w-4xl">
        <h1 className="heading-display text-3xl sm:text-4xl mb-8">{t('cart.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="h-20 w-20 shrink-0 rounded-lg flex items-center justify-center text-3xl" style={{ background: product.gradient }}>
                    {product.category === 'canapes' ? '🥪' : product.category === 'salads' ? '🥗' : product.category === 'hot' ? '🍖' : product.category === 'desserts' ? '🍰' : '🥂'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-semibold truncate">{product.name[lang] || product.name.en}</h3>
                    <p className="text-sm text-muted-foreground">{product.price}{t('common.gel')} / {t(`unit.${product.unit}`)}</p>
                    {item.notes && <p className="text-xs text-muted-foreground mt-1 italic">{item.notes}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 hover:bg-secondary rounded-l-lg"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-secondary rounded-r-lg"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="font-semibold text-primary">{(product.price * item.quantity).toFixed(2)}{t('common.gel')}</span>
                      <button onClick={() => removeItem(item.productId)} className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-20">
              <h3 className="font-heading text-xl font-semibold mb-4">{t('checkout.orderSummary')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span className="font-medium">{cartSubtotal.toFixed(2)}{t('common.gel')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.delivery')}</span>
                  <span className="font-medium">{deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}${t('common.gel')}`}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t('cart.deliveryNote')}</p>
                <div className="border-t border-border pt-3 flex justify-between text-base">
                  <span className="font-semibold">{t('cart.total')}</span>
                  <span className="font-bold text-primary">{(cartSubtotal + deliveryFee).toFixed(2)}{t('common.gel')}</span>
                </div>
              </div>
              <button onClick={handleOrderCTA} className="w-full mt-6 rounded-lg bg-accent py-3 font-semibold text-accent-foreground hover:bg-accent/90 transition-colors">
                {t('cart.checkout')}
              </button>
              <Link to="/menu" className="block mt-3 text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('cart.continue')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
