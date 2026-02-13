import React from 'react';
import { business } from '@/config/business';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const url = `https://wa.me/${business.whatsapp}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: '#25D366' }}
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" style={{ color: 'white' }} />
    </a>
  );
};

export default WhatsAppButton;
