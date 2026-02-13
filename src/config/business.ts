export const business = {
  name: 'Fursheti',
  nameLocalized: { ka: 'ფურშეტი', en: 'Fursheti', ru: 'Фуршет' } as Record<string, string>,
  email: 'info@fursheti.ge',
  phone: '+995 555 123 456',
  whatsapp: '995555123456',
  address: {
    ka: 'თბილისი, რუსთაველის გამზ. 12',
    en: '12 Rustaveli Ave, Tbilisi',
    ru: 'Тбилиси, пр. Руставели 12',
  } as Record<string, string>,
  socialLinks: {
    facebook: 'https://facebook.com/fursheti',
    instagram: 'https://instagram.com/fursheti',
  },
  delivery: {
    baseFee: 20,
    freeThreshold: 300,
  },
  services: {
    setup: 50,
    serving: 80,
  },
  inventory: {
    plates: { price: 0.5 },
    cups: { price: 0.5 },
    cutlery: { price: 0.8 },
    tables: { price: 15 },
    chairs: { price: 3 },
    tablecloths: { price: 5 },
  } as Record<string, { price: number }>,
};

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};
