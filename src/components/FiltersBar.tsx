import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/products';
import { Search, X, Filter } from 'lucide-react';

interface Props {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  productCounts?: Record<string, number>;
}

const allTags = ['vegan', 'spicy', 'glutenFree', 'new'];
const quickFilters = ['vegetarian', 'vegan', 'glutenFree', 'popular', 'premium'];

const FiltersBar: React.FC<Props> = ({
  selectedCategory, onCategoryChange,
  searchQuery, onSearchChange,
  sortBy, onSortChange,
  selectedTags, onTagToggle,
  productCounts = {},
}) => {
  const { t } = useLanguage();

  const handleQuickFilter = (filter: string) => {
    if (filter === 'vegetarian') {
      // Toggle vegetarian (includes vegan)
      if (selectedTags.includes('vegan')) {
        onTagToggle('vegan');
      } else {
        onTagToggle('vegan');
      }
    } else if (filter === 'premium') {
      // Toggle popular as proxy for premium
      onTagToggle('popular');
    } else {
      onTagToggle(filter);
    }
  };

  const isQuickFilterActive = (filter: string) => {
    if (filter === 'vegetarian') return selectedTags.includes('vegan');
    if (filter === 'premium') return selectedTags.includes('popular');
    return selectedTags.includes(filter);
  };

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
          <option value="alpha">{t('menu.sortAlpha')}</option>
        </select>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Filter className="h-3.5 w-3.5" />
          <span>{t('menu.filters')}:</span>
        </div>
        {quickFilters.map(filter => (
          <button
            key={filter}
            onClick={() => handleQuickFilter(filter)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
              isQuickFilterActive(filter)
                ? 'border-accent bg-accent/15 text-accent-foreground shadow-sm scale-105'
                : 'border-border/60 text-muted-foreground hover:border-accent/50 hover:bg-accent/5'
            }`}
          >
            {t(`menu.filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`) || t(`tag.${filter}`)}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button 
            onClick={() => selectedTags.forEach(onTagToggle)} 
            className="text-xs text-muted-foreground hover:text-foreground underline font-medium ml-1"
          >
            {t('menu.clearFilters')}
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map(cat => {
          const count = productCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary hover:shadow-md'
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

      {/* Additional Tags */}
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
      </div>
    </div>
  );
};

export default FiltersBar;
