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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/45" />
      <div className="container relative z-10 py-24">
        <div className="max-w-3xl">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-background leading-[1.1] animate-fade-in tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-xl text-background/90 leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.15s' }}>
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/menu">
              <Button size="lg" className="rounded-2xl px-10 py-7 text-base font-semibold bg-accent text-neutral-900 hover:bg-accent/90 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                {t('hero.ctaMenu')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-2xl px-10 py-7 text-base font-semibold border-2 border-background/50 text-background hover:bg-background/15 hover:border-background/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95" onClick={handleOrderCTA}>
              {t('hero.ctaOrder')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
