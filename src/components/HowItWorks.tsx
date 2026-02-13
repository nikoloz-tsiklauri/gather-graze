import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ClipboardList, Truck, PartyPopper } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: ClipboardList, title: t('how.step1.title'), desc: t('how.step1.desc') },
    { icon: Truck, title: t('how.step2.title'), desc: t('how.step2.desc') },
    { icon: PartyPopper, title: t('how.step3.title'), desc: t('how.step3.desc') },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <h2 className="heading-display text-3xl sm:text-4xl text-center mb-12">{t('how.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="text-xs font-bold text-accent mb-2">0{i + 1}</div>
              <h3 className="font-heading text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
