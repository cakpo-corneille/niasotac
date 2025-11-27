import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();
  
  const whatsappNumber = settings?.whatsapp_number || '229XXXXXXXXX';
  const whatsappMessage = encodeURIComponent('Bonjour ! Je suis intéressé par vos produits tech.');

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 animate-fade-in"
    >
      <Button
        size="lg"
        className="rounded-full shadow-lg hover:scale-110 transition-transform group bg-[#25D366] hover:bg-[#20BD5A] text-white"
      >
        <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
        <span className="ml-2">WhatsApp</span>
      </Button>
    </a>
  );
};
