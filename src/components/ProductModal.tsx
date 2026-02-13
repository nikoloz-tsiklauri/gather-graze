import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { X, Plus, Minus } from 'lucide-react';

interface Props {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<Props> = ({ product, onClose }) => {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [qty, setQty] = React.useState(1);
  const [notes, setNotes] = React.useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-md" />
      <div
        className="relative w-full max-w-xl rounded-3xl bg-card shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-64 w-full flex items-center justify-center text-8xl relative overflow-hidden" style={{ background: product.gradient }}>
          <span className="opacity-90">{
            product.category === 'canapes' ? '🥪' :
            product.category === 'salads' ? '🥗' :
            product.category === 'hot' ? '🍖' :
            product.category === 'desserts' ? '🍰' : '🥂'
          }</span>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2.5 rounded-full bg-card/90 backdrop-blur hover:bg-card transition-all shadow-lg hover:shadow-xl">
          <X className="h-5 w-5" />
        </button>
        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-secondary/70 text-secondary-foreground">
                {t(`tag.${tag}`)}
              </span>
            ))}
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight leading-tight">{product.name[lang] || product.name.en}</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">{product.description[lang] || product.description.en}</p>
          <div className="mt-5">
            <span className="text-3xl font-bold text-primary">{product.price}{t('common.gel')}</span>
            <span className="text-sm text-muted-foreground ml-2 font-medium">/ {t(`unit.${product.unit}`)}</span>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center rounded-xl border border-border/60 shadow-sm bg-background">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary transition-colors rounded-l-xl"><Minus className="h-5 w-5" /></button>
              <span className="w-12 text-center font-semibold text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary transition-colors rounded-r-xl"><Plus className="h-5 w-5" /></button>
            </div>
          </div>
          <textarea
            placeholder={t('cart.notes')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full mt-5 rounded-xl border border-border/60 bg-background p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring shadow-sm transition-all"
          />
          <button
            onClick={() => { addItem(product.id, qty, notes); onClose(); }}
            className="w-full mt-6 rounded-2xl bg-primary py-4 font-semibold text-lg text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            {t('menu.addToCart')} — {(product.price * qty).toFixed(2)}{t('common.gel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
