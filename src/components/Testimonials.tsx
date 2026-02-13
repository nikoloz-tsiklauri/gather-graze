import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const items = ['1', '2', '3'];

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="heading-display text-3xl sm:text-4xl text-center mb-12">{t('testimonials.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-accent text-accent" />)}
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">"{t(`testimonial.${i}.text`)}"</p>
              <div>
                <p className="font-semibold text-sm">{t(`testimonial.${i}.name`)}</p>
                <p className="text-xs text-muted-foreground">{t(`testimonial.${i}.role`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
