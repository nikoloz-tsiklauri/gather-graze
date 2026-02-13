import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { products } from '@/data/products';
import FiltersBar from '@/components/FiltersBar';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import type { Product } from '@/data/products';

const Menu: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.name[lang] || p.name.en).toLowerCase().includes(q) ||
        (p.description[lang] || p.description.en).toLowerCase().includes(q)
      );
    }
    if (tags.length > 0) result = result.filter(p => tags.some(tag => p.tags.includes(tag)));
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular') result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return result;
  }, [category, search, sortBy, tags, lang]);

  return (
    <main className="py-10">
      <div className="container">
        <h1 className="heading-display text-3xl sm:text-4xl mb-8">{t('menu.title')}</h1>
        <FiltersBar
          selectedCategory={category}
          onCategoryChange={setCategory}
          searchQuery={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTags={tags}
          onTagToggle={toggleTag}
        />
        <div className="mt-8" id="menu-list">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t('menu.noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onDetails={setSelectedProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
};

export default Menu;
