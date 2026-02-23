import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/products';

interface Props {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  productCounts: Record<string, number>;
  isSticky: boolean;
}

const StickyCategoryNav: React.FC<Props> = ({
  selectedCategory,
  onCategoryChange,
  productCounts,
  isSticky,
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  if (!isSticky) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-lg animate-slide-down">
      <div className="container py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(cat => {
            const count = productCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{t(`cat.${cat.id}`)}</span>
                {count > 0 && (
                  <span className="text-xs opacity-70">({count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickyCategoryNav;
