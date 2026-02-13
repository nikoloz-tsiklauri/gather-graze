import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const items = ['1', '2', '3', '4', '5'];

  return (
    <section className="py-20 bg-secondary">
      <div className="container max-w-3xl">
        <h2 className="heading-display text-3xl sm:text-4xl text-center mb-12">{t('faq.title')}</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map(i => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-6 shadow-sm">
              <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                {t(`faq.${i}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {t(`faq.${i}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
