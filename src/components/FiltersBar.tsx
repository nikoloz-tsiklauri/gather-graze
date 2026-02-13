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
    <div className="space-y-4">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('menu.search')}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('menu.sortDefault')}</option>
          <option value="price-asc">{t('menu.sortPriceAsc')}</option>
          <option value="price-desc">{t('menu.sortPriceDesc')}</option>
          <option value="popular">{t('menu.sortPopular')}</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span>{cat.icon}</span>
            {t(`cat.${cat.id}`)}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              selectedTags.includes(tag)
                ? 'border-accent bg-accent/10 text-accent-foreground'
                : 'border-border text-muted-foreground hover:border-accent'
            }`}
          >
            {t(`tag.${tag}`)}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button onClick={() => selectedTags.forEach(onTagToggle)} className="text-xs text-muted-foreground hover:text-foreground underline">
            {t('menu.clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
