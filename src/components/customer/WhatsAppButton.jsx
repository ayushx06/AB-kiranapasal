import { MessageCircle, Phone } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../../utils/constants';

export const WhatsAppButton = ({ settings = DEFAULT_SETTINGS }) => {
  const whatsapp = String(settings.whatsappNumber || import.meta.env.VITE_SHOP_WHATSAPP || '').replace(/[^\d]/g, '');
  const viber = String(settings.viberNumber || import.meta.env.VITE_SHOP_PHONE || '').replace(/[^\d+]/g, '');
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:bottom-6">
      <a
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-soft"
        href={`https://wa.me/${whatsapp}?text=Hi,%20I%20need%20help%20with%20my%20order`}
        target="_blank"
        rel="noreferrer"
        aria-label="Open WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-soft" href={`viber://chat?number=${viber}`} aria-label="Open Viber">
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
};
