import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { products, categories } from '@/data/products';
import FiltersBar from '@/components/FiltersBar';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import StickyCartBar from '@/components/StickyCartBar';
import StickyCategoryNav from '@/components/StickyCategoryNav';
import PackagesSection from '@/components/PackagesSection';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import type { Product } from '@/data/products';
import { Plus, Minus, Users } from 'lucide-react';

const Menu: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [guestCount, setGuestCount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sticky category nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    else if (sortBy === 'alpha') result.sort((a, b) => (a.name[lang] || a.name.en).localeCompare(b.name[lang] || b.name.en));
    return result;
  }, [category, search, sortBy, tags, lang]);

  // Calculate product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter(p => p.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  return (
    <>
      <main className="py-12 pb-32">
        <div className="container">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <h1 className="heading-display text-4xl sm:text-5xl mb-3 tracking-tight">
                  {t('menu.title')}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {t('menu.subtitle')}
                </p>
              </div>
              
              {/* Guest Count Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('menu.guestCount')}
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card shadow-sm p-2">
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 min-w-[100px] justify-center">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold text-xl">{guestCount}</span>
                  </div>
                  <button
                    onClick={() => setGuestCount(guestCount + 1)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <FiltersBar
              selectedCategory={category}
              onCategoryChange={setCategory}
              searchQuery={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedTags={tags}
              onTagToggle={toggleTag}
              productCounts={productCounts}
            />
          </div>

          {/* Products Grid */}
          <div className="mt-10" id="menu-list">
            {isLoading ? (
              <ProductSkeletonGrid count={8} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="rounded-full bg-secondary/50 p-8 inline-flex mb-4">
                  <span className="text-5xl opacity-40">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('menu.noResults')}</h3>
                <p className="text-muted-foreground mb-6">
                  {lang === 'ka' 
                    ? 'სცადეთ სხვა ფილტრები ან საძიებო სიტყვები' 
                    : lang === 'ru'
                    ? 'Попробуйте другие фильтры или поисковые запросы'
                    : 'Try different filters or search terms'}
                </p>
                {(tags.length > 0 || search) && (
                  <button
                    onClick={() => {
                      setTags([]);
                      setSearch('');
                    }}
                    className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-all"
                  >
                    {t('menu.clearFilters')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                {filtered.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onDetails={setSelectedProduct}
                    guestCount={guestCount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Packages Section */}
        {!isLoading && <PackagesSection guestCount={guestCount} />}
      </main>

      {/* Sticky Category Navigation */}
      <StickyCategoryNav
        selectedCategory={category}
        onCategoryChange={setCategory}
        productCounts={productCounts}
        isSticky={isSticky}
      />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          guestCount={guestCount}
        />
      )}

      {/* Sticky Cart Bar */}
      <StickyCartBar guestCount={guestCount} />
    </>
  );
};

export default Menu;
