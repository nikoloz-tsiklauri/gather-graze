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
      <main className="py-24">
        <div className="container max-w-lg text-center">
          <div className="rounded-full bg-secondary/50 p-8 inline-flex mb-6">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/40" />
          </div>
          <h1 className="heading-display text-4xl mb-3">{t('cart.empty')}</h1>
          <p className="text-muted-foreground text-lg mb-8">{t('cart.emptyDesc')}</p>
          <Link to="/menu" className="inline-flex rounded-2xl bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-95">
            {t('cart.goToMenu')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="container max-w-5xl">
        <h1 className="heading-display text-4xl sm:text-5xl mb-10 tracking-tight">{t('cart.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            {items.map(item => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="h-24 w-24 shrink-0 rounded-xl flex items-center justify-center text-4xl shadow-sm" style={{ background: product.gradient }}>
                    {product.category === 'canapes' ? '🥪' : product.category === 'salads' ? '🥗' : product.category === 'hot' ? '🍖' : product.category === 'desserts' ? '🍰' : '🥂'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl font-semibold truncate leading-tight">{product.name[lang] || product.name.en}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{product.price}{t('common.gel')} / {t(`unit.${product.unit}`)}</p>
                    {item.notes && <p className="text-xs text-muted-foreground mt-2 italic">{item.notes}</p>}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center rounded-xl border border-border/60 shadow-sm bg-background">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-secondary rounded-l-xl transition-colors"><Minus className="h-4 w-4" /></button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-secondary rounded-r-xl transition-colors"><Plus className="h-4 w-4" /></button>
                      </div>
                      <span className="font-bold text-lg text-primary">{(product.price * item.quantity).toFixed(2)}{t('common.gel')}</span>
                      <button onClick={() => removeItem(item.productId)} className="ml-auto p-2 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-lg sticky top-24">
              <h3 className="font-heading text-2xl font-bold mb-5 tracking-tight">{t('checkout.orderSummary')}</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">{t('cart.subtotal')}</span>
                  <span className="font-semibold">{cartSubtotal.toFixed(2)}{t('common.gel')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">{t('cart.delivery')}</span>
                  <span className="font-semibold">{deliveryFee === 0 ? t('cart.deliveryFree') : `${deliveryFee}${t('common.gel')}`}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">{t('cart.deliveryNote')}</p>
                <div className="border-t border-border/50 pt-4 flex justify-between text-base">
                  <span className="font-bold text-lg">{t('cart.total')}</span>
                  <span className="font-bold text-lg text-primary">{(cartSubtotal + deliveryFee).toFixed(2)}{t('common.gel')}</span>
                </div>
              </div>
              <button onClick={handleOrderCTA} className="w-full mt-6 rounded-xl bg-accent py-4 font-semibold text-accent-foreground hover:bg-accent/90 hover:shadow-lg transition-all duration-200 active:scale-95">
                {t('cart.checkout')}
              </button>
              <Link to="/menu" className="block mt-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
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
