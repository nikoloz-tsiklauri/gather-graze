import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { business } from '@/config/business';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">{t('footer.about')}</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">{t('footer.aboutText')}</p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">{t('footer.contact')}</h3>
            <div className="space-y-2 text-sm">
              <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" /> {business.phone}
              </a>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" /> {business.email}
              </a>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 shrink-0" /> {business.address[lang]}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">{t('footer.followUs')}</h3>
            <div className="flex gap-3">
              <a href={business.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={business.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-xs text-primary-foreground/60">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
