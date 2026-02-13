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
    <div className="group rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button onClick={() => onDetails(product)} className="w-full">
        <div
          className="h-48 w-full flex items-center justify-center text-6xl"
          style={{ background: product.gradient }}
        >
          <span className="opacity-80">{
            product.category === 'canapes' ? '🥪' :
            product.category === 'salads' ? '🥗' :
            product.category === 'hot' ? '🍖' :
            product.category === 'desserts' ? '🍰' : '🥂'
          }</span>
        </div>
      </button>
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {t(`tag.${tag}`)}
            </span>
          ))}
        </div>
        <h3 className="font-heading text-lg font-semibold text-card-foreground">{product.name[lang] || product.name.en}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description[lang] || product.description.en}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-primary">{product.price}{t('common.gel')}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {t(`unit.${product.unit}`)}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addItem(product.id); }}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
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
