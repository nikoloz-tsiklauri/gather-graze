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
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-card shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-56 w-full flex items-center justify-center text-8xl" style={{ background: product.gradient }}>
          <span className="opacity-80">{
            product.category === 'canapes' ? '🥪' :
            product.category === 'salads' ? '🥗' :
            product.category === 'hot' ? '🍖' :
            product.category === 'desserts' ? '🍰' : '🥂'
          }</span>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur hover:bg-card transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {t(`tag.${tag}`)}
              </span>
            ))}
          </div>
          <h2 className="font-heading text-2xl font-bold">{product.name[lang] || product.name.en}</h2>
          <p className="text-muted-foreground mt-2">{product.description[lang] || product.description.en}</p>
          <div className="mt-4">
            <span className="text-2xl font-bold text-primary">{product.price}{t('common.gel')}</span>
            <span className="text-sm text-muted-foreground ml-1">/ {t(`unit.${product.unit}`)}</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-secondary transition-colors rounded-l-lg"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-secondary transition-colors rounded-r-lg"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <textarea
            placeholder={t('cart.notes')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full mt-3 rounded-lg border border-border bg-background p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => { addItem(product.id, qty, notes); onClose(); }}
            className="w-full mt-4 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t('menu.addToCart')} — {(product.price * qty).toFixed(2)}{t('common.gel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
