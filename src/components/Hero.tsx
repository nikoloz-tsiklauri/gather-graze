import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useOrderCTA } from '@/hooks/useOrderCTA';
import heroImage from '@/assets/hero-catering.jpg';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { handleOrderCTA } = useOrderCTA();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-lg text-background/80 leading-relaxed animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/menu">
              <Button size="lg" className="rounded-xl px-8 py-6 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                {t('hero.ctaMenu')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-base font-semibold border-background/40 text-background hover:bg-background/10" onClick={handleOrderCTA}>
              {t('hero.ctaOrder')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
