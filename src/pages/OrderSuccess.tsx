import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const state = location.state as { orderId?: string; grandTotal?: number } | null;

  return (
    <main className="py-20">
      <div className="container max-w-lg text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-primary mb-6" />
        <h1 className="heading-display text-3xl sm:text-4xl mb-4">{t('success.title')}</h1>
        <p className="text-muted-foreground mb-6">{t('success.message')}</p>
        {state?.orderId && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t('success.orderId')}</span>
              <span className="font-mono font-bold">{state.orderId}</span>
            </div>
            {state.grandTotal !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.total')}</span>
                <span className="font-bold text-primary">{state.grandTotal.toFixed(2)}₾</span>
              </div>
            )}
          </div>
        )}
        <Link to="/" className="inline-flex rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          {t('success.backHome')}
        </Link>
      </div>
    </main>
  );
};

export default OrderSuccess;
