import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  guestCount: number;
}

const PackagesSection: React.FC<Props> = ({ guestCount }) => {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();

  const packages = [
    {
      id: 'basic',
      productId: 'package-basic' as const,
      name: t('menu.package.basic'),
      pricePerGuest: 25,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      items: [
        { ka: '2 სახეობის კანაპე', en: '2 types of canapés', ru: '2 вида канапе' },
        { ka: '1 სალათი', en: '1 salad', ru: '1 салат' },
        { ka: 'ლიმონათი', en: 'Lemonade', ru: 'Лимонад' },
        { ka: 'ხილის ასორტი', en: 'Fruit platter', ru: 'Фруктовая тарелка' },
      ],
      popular: false,
    },
    {
      id: 'standard',
      productId: 'package-standard' as const,
      name: t('menu.package.standard'),
      pricePerGuest: 45,
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      items: [
        { ka: '3 სახეობის კანაპე', en: '3 types of canapés', ru: '3 вида канапе' },
        { ka: '2 სალათი', en: '2 salads', ru: '2 салата' },
        { ka: '1 ცხელი კერძი', en: '1 hot dish', ru: '1 горячее блюдо' },
        { ka: 'სასმელები', en: 'Beverages', ru: 'Напитки' },
        { ka: 'დესერტი', en: 'Dessert', ru: 'Десерт' },
      ],
      popular: true,
    },
    {
      id: 'premium',
      productId: 'package-premium' as const,
      name: t('menu.package.premium'),
      pricePerGuest: 70,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      items: [
        { ka: '5 სახეობის კანაპე', en: '5 types of canapés', ru: '5 видов канапе' },
        { ka: '3 სალათი', en: '3 salads', ru: '3 салата' },
        { ka: '2 ცხელი კერძი', en: '2 hot dishes', ru: '2 горячих блюда' },
        { ka: 'პრემიუმ სასმელები', en: 'Premium beverages', ru: 'Премиум напитки' },
        { ka: '2 დესერტი', en: '2 desserts', ru: '2 десерта' },
        { ka: 'მომსახურე პერსონალი', en: 'Serving staff', ru: 'Обслуживающий персонал' },
      ],
      popular: false,
    },
  ];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    const qty = Math.max(1, guestCount);
    addItem(pkg.productId, qty);
    toast({
      title: t('cart.addedToast'),
      description: `${pkg.name} · ${qty} ${t('menu.guests')}`,
      duration: 3000,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-display text-3xl sm:text-4xl mb-3 tracking-tight">
            {t('menu.packages')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === 'ka' 
              ? 'აირჩიეთ მზა პაკეტი თქვენი ღონისძიებისთვის' 
              : lang === 'ru'
              ? 'Выберите готовый пакет для вашего мероприятия'
              : 'Choose a ready package for your event'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                pkg.popular ? 'border-accent shadow-lg scale-105' : 'border-border/60'
              }`}
            >
              {pkg.popular && (
                <div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {lang === 'ka' ? 'პოპულარული' : lang === 'ru' ? 'Популярный' : 'Popular'}
                </div>
              )}
              
              <div
                className="h-32 flex items-center justify-center text-5xl"
                style={{ background: pkg.gradient }}
              >
                <span className="opacity-90">
                  {pkg.id === 'basic' ? '🍽️' : pkg.id === 'standard' ? '🎉' : '👑'}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="font-heading text-2xl font-bold mb-2">{pkg.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {(pkg.pricePerGuest * guestCount).toFixed(0)}₾
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({pkg.pricePerGuest}₾ {t('menu.package.perGuest')})
                  </span>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-3">
                    {t('menu.package.includes')}:
                  </p>
                  <ul className="space-y-2">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item[lang] || item.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => handleSelectPackage(pkg)}
                  className={`w-full rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                    pkg.popular
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  size="lg"
                >
                  {t('menu.package.select')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
