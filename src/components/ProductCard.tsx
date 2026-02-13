import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { Plus } from 'lucide-react';

interface Props {
  product: Product;
  onDetails: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onDetails }) => {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();

  return (
    <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 hover:-translate-y-1">
      <button onClick={() => onDetails(product)} className="w-full">
        <div
          className="h-52 w-full flex items-center justify-center text-6xl relative overflow-hidden"
          style={{ background: product.gradient }}
        >
          <span className="opacity-90 group-hover:scale-110 transition-transform duration-300">{
            product.category === 'canapes' ? '🥪' :
            product.category === 'salads' ? '🥗' :
            product.category === 'hot' ? '🍖' :
            product.category === 'desserts' ? '🍰' : '🥂'
          }</span>
        </div>
      </button>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-secondary/70 text-secondary-foreground">
              {t(`tag.${tag}`)}
            </span>
          ))}
        </div>
        <h3 className="font-heading text-xl font-semibold text-card-foreground leading-tight">{product.name[lang] || product.name.en}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{product.description[lang] || product.description.en}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <div>
            <span className="text-xl font-bold text-primary">{product.price}{t('common.gel')}</span>
            <span className="text-xs text-muted-foreground ml-1.5 font-medium">/ {t(`unit.${product.unit}`)}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addItem(product.id); }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t('menu.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
