import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { Plus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  product: Product;
  onDetails: (product: Product) => void;
  guestCount?: number;
}

const ProductCard: React.FC<Props> = ({ product, onDetails, guestCount = 1 }) => {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem(product.id);
    setTimeout(() => setIsAdding(false), 600);
  };

  const displayPrice = product.unit === 'person' ? product.price * guestCount : product.price;
  const portionText = product.unit === 'person' ? t('menu.pricePerPerson') : t('menu.pricePerPiece');

  return (
    <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.popular && (
          <Badge className="bg-accent text-accent-foreground shadow-md">
            {t('tag.popular')}
          </Badge>
        )}
        {product.tags.includes('new') && (
          <Badge className="bg-green-500 text-white shadow-md">
            {t('tag.new')}
          </Badge>
        )}
        {product.tags.includes('vegan') && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 shadow-sm">
            🌱 {t('tag.vegan')}
          </Badge>
        )}
      </div>

      <button onClick={() => onDetails(product)} className="w-full">
        <div
          className="h-52 w-full flex items-center justify-center text-6xl relative overflow-hidden"
          style={{ background: product.gradient }}
        >
          <span className="opacity-90 group-hover:scale-110 transition-transform duration-300">{
            product.category === 'canapes' ? '🥪' :
            product.category === 'burgers' ? '🍔' :
            product.category === 'pizza' ? '🍕' :
            product.category === 'sandwiches' ? '🥖' :
            product.category === 'salads' ? '🥗' :
            product.category === 'hot' ? '🍖' :
            product.category === 'desserts' ? '🍰' :
            product.category === 'drinks' ? '🥤' :
            product.category === 'sauces' ? '🥫' :
            product.category === 'inventory' ? '🍴' : '📦'
          }</span>
        </div>
      </button>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.filter(tag => !['new', 'popular'].includes(tag)).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-secondary/70 text-secondary-foreground">
              {t(`tag.${tag}`)}
            </span>
          ))}
        </div>
        
        <h3 className="font-heading text-xl font-semibold text-card-foreground leading-tight">
          {product.name[lang] || product.name.en}
        </h3>
        
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {product.description[lang] || product.description.en}
        </p>
        
        {product.unit === 'person' && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            {portionText}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <div>
            <span className="text-xl font-bold text-primary">
              {displayPrice.toFixed(2)}{t('common.gel')}
            </span>
            <span className="text-xs text-muted-foreground ml-1.5 font-medium">
              / {t(`unit.${product.unit}`)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isAdding
                ? 'bg-green-500 text-white scale-95'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" />
                {t('cart.addedToast')}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {t('menu.addToCart')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
