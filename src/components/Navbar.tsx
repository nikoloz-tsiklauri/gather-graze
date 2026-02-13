import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { business } from '@/config/business';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';
import type { Lang } from '@/i18n/translations';

const langs: Lang[] = ['ka', 'en', 'ru'];
const langLabels: Record<Lang, string> = { ka: 'KA', en: 'EN', ru: 'RU' };

const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { totalItems } = useCart();
  const { openCartDrawer } = useUI();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/cart', label: t('nav.cart') },
    { to: 'contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home, scroll will happen via useEffect in App or after navigation
      window.location.href = '/';
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home page, scroll to contact section
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <a href="/" onClick={handleHomeClick} className="font-heading text-2xl font-bold text-primary tracking-tight hover:text-primary/80 transition-colors">
          {business.nameLocalized[lang] || business.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => {
            if (link.to === '/cart') {
              return (
                <button
                  key={link.to}
                  onClick={() => openCartDrawer()}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {link.label}
                  {totalItems > 0 && (
                    <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </button>
              );
            }
            if (link.to === '/') {
              return (
                <a
                  key={link.to}
                  href="/"
                  onClick={handleHomeClick}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {link.label}
                </a>
              );
            }
            if (link.to === 'contact') {
              return (
                <button
                  key={link.to}
                  onClick={handleContactClick}
                  className="text-sm font-medium transition-all duration-200 hover:text-primary text-muted-foreground"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-all duration-200 hover:text-primary ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200">
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline font-medium">{business.phone}</span>
          </a>
          <div className="flex rounded-xl border border-border/60 overflow-hidden shadow-sm bg-card">
            {langs.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${lang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => openCartDrawer()} className="relative p-2 hover:bg-secondary/50 rounded-xl transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 hover:bg-secondary/50 rounded-xl transition-colors">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl p-6 animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-3">
            {navLinks.map(link => {
              if (link.to === '/cart') {
                return (
                  <button
                    key={link.to}
                    onClick={() => { openCartDrawer(); setOpen(false); }}
                    className={`text-sm font-medium py-2.5 text-left transition-colors ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {link.label}
                  </button>
                );
              }
              if (link.to === '/') {
                return (
                  <a
                    key={link.to}
                    href="/"
                    onClick={(e) => { handleHomeClick(e); setOpen(false); }}
                    className={`text-sm font-medium py-2.5 transition-colors ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {link.label}
                  </a>
                );
              }
              if (link.to === 'contact') {
                return (
                  <button
                    key={link.to}
                    onClick={(e) => { handleContactClick(e); setOpen(false); }}
                    className="text-sm font-medium py-2.5 text-left transition-colors text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-2.5 transition-colors ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex gap-2 mt-6 pt-6 border-t border-border/50">
            {langs.map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${lang === l ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'}`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
