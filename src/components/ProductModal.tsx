import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';
import { X, Plus, Minus, Info, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Props {
  product: Product;
  onClose: () => void;
  guestCount?: number;
}

const ProductModal: React.FC<Props> = ({ product, onClose, guestCount = 1 }) => {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const [qty, setQty] = React.useState(1);
  const [notes, setNotes] = React.useState('');

  // Mock ingredients and allergens (in production, these would come from product data)
  const ingredients = product.category === 'canapes' 
    ? ['Bread', 'Salmon', 'Cream Cheese', 'Dill', 'Lemon']
    : product.category === 'salads'
    ? ['Lettuce', 'Tomatoes', 'Cucumber', 'Olive Oil', 'Feta Cheese']
    : product.category === 'hot'
    ? ['Chicken', 'Herbs', 'Garlic', 'Olive Oil', 'Spices']
    : product.category === 'desserts'
    ? ['Flour', 'Sugar', 'Eggs', 'Butter', 'Vanilla']
    : ['Water', 'Lemon', 'Sugar', 'Mint'];

  const allergens = product.tags.includes('glutenFree') 
    ? [] 
    : product.category === 'desserts'
    ? ['Gluten', 'Dairy', 'Eggs']
    : ['Dairy'];

  const displayPrice = product.unit === 'person' ? product.price * guestCount : product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-card shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-64 w-full flex items-center justify-center text-8xl relative overflow-hidden" style={{ background: product.gradient }}>
          <span className="opacity-90">{
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
          
          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
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
          </div>
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
          
          <h2 className="font-heading text-3xl font-bold tracking-tight leading-tight">
            {product.name[lang] || product.name.en}
          </h2>
          
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {product.description[lang] || product.description.en}
          </p>
          
          <Separator className="my-6" />
          
          {/* Ingredients Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm uppercase tracking-wide">{t('menu.ingredients')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, idx) => (
                <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-secondary/50 text-secondary-foreground">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          
          {/* Allergens Section */}
          {allergens.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-destructive">{t('menu.allergens')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-6" />
          
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold text-primary">
              {displayPrice.toFixed(2)}{t('common.gel')}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              / {t(`unit.${product.unit}`)}
            </span>
            {product.unit === 'person' && guestCount > 1 && (
              <span className="text-xs text-muted-foreground ml-2">
                ({guestCount} {t('menu.guests')})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center rounded-xl border border-border/60 shadow-sm bg-background">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary transition-colors rounded-l-xl">
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary transition-colors rounded-r-xl">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              {t('cart.quantity')}
            </span>
          </div>
          
          <textarea
            placeholder={t('cart.notes')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring shadow-sm transition-all"
          />
          
          <button
            onClick={() => { addItem(product.id, qty, notes); onClose(); }}
            className="w-full mt-6 rounded-2xl bg-primary py-4 font-semibold text-lg text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            {t('menu.addToCart')} — {(displayPrice * qty).toFixed(2)}{t('common.gel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
