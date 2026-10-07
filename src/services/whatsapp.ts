import { hotel } from '@/data/hotel';

export const hasWhatsApp = Boolean(hotel.contact.whatsapp);

/** Link wa.me com mensagem pré-preenchida. Retorna `null` se não houver número. */
export function whatsappUrl(message = `Olá! Gostaria de mais informações sobre o ${hotel.name}.`) {
  if (!hotel.contact.whatsapp) return null;
  return `https://wa.me/${hotel.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
