import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/products';
import { Search, X } from 'lucide-react';

interface Props {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const allTags = ['vegan', 'spicy', 'glutenFree', 'new'];

const FiltersBar: React.FC<Props> = ({
  selectedCategory, onCategoryChange,
  searchQuery, onSearchChange,
  sortBy, onSortChange,
  selectedTags, onTagToggle,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('menu.search')}
            className="w-full rounded-xl border border-border/60 bg-card pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-sm transition-all"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-secondary/50 rounded-lg p-1 transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="rounded-xl border border-border/60 bg-card px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-sm font-medium transition-all"
        >
          <option value="">{t('menu.sortDefault')}</option>
          <option value="price-asc">{t('menu.sortPriceAsc')}</option>
          <option value="price-desc">{t('menu.sortPriceDesc')}</option>
          <option value="popular">{t('menu.sortPopular')}</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary hover:shadow-md'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {t(`cat.${cat.id}`)}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all duration-200 ${
              selectedTags.includes(tag)
                ? 'border-accent bg-accent/15 text-accent-foreground shadow-sm'
                : 'border-border/60 text-muted-foreground hover:border-accent/50 hover:bg-accent/5'
            }`}
          >
            {t(`tag.${tag}`)}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button onClick={() => selectedTags.forEach(onTagToggle)} className="text-xs text-muted-foreground hover:text-foreground underline font-medium ml-1">
            {t('menu.clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
