import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/data/products';

const categoryGradients: Record<string, string> = {
  canapes: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  salads: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
  hot: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  desserts: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  drinks: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const FeaturedCategories: React.FC = () => {
  const { t } = useLanguage();
  const displayCats = categories.filter(c => c.id !== 'all');

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="heading-display text-3xl sm:text-4xl text-center mb-12">{t('cat.all')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayCats.map(cat => (
            <Link
              key={cat.id}
              to={`/menu?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center text-center p-4 transition-transform hover:scale-[1.03]"
              style={{ background: categoryGradients[cat.id] || '' }}
            >
              <span className="text-5xl mb-3">{cat.icon}</span>
              <span className="font-heading text-lg font-semibold text-foreground/80">{t(`cat.${cat.id}`)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
