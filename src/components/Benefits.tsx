import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, ShieldCheck, Building2, Heart } from 'lucide-react';

const Benefits: React.FC = () => {
  const { t } = useLanguage();
  const items = [
    { icon: Clock, key: '1' },
    { icon: ShieldCheck, key: '2' },
    { icon: Building2, key: '3' },
    { icon: Heart, key: '4' },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <h2 className="heading-display text-3xl sm:text-4xl text-center mb-12">{t('benefits.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.key} className="rounded-xl bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{t(`benefits.${item.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`benefits.${item.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
