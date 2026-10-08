import { siteConfig } from '@/config/site';
import type { FaqItem, GalleryCategory, GalleryItem, NavItem, NearbyPlace, Review, SiteImage } from '@/types';
import { hotel } from './hotel';
import { rooms } from './rooms';

const allNavigation: NavItem[] = [
  { label: 'Início', section: 'inicio' },
  { label: 'O Hotel', section: 'o-hotel' },
  { label: 'Acomodações', section: 'acomodacoes' },
  { label: 'Serviços', section: 'servicos' },
  { label: 'Galeria', section: 'galeria' },
  { label: 'Localização', section: 'localizacao' },
  { label: 'Contato', section: 'contato' },
];

/* -------------------------------------------------------------------------- */
/* Imagens institucionais (substitua `src` pelas fotos reais do hotel)         */
/* -------------------------------------------------------------------------- */

type ImageKey = 'hero' | 'about' | 'aboutDetail' | 'comfort' | 'service' | 'location' | 'region';

export const images: Record<ImageKey, SiteImage> = {
  hero: { alt: 'Fachada do Hotel Premier Janaúba', placeholder: 'Fachada do hotel' },
  about: { alt: 'Recepção do Hotel Premier Janaúba', placeholder: 'Foto da recepção' },
  aboutDetail: { alt: 'Fachada do Hotel Premier na Rua Inhumas', placeholder: 'Foto da fachada' },
  comfort: { alt: 'Quarto do Hotel Premier Janaúba', placeholder: 'Foto de um quarto' },
  service: { alt: 'Recepção 24 horas do Hotel Premier', placeholder: 'Foto da recepção / equipe' },
  location: { alt: 'Rua Inhumas, no Centro de Janaúba', placeholder: 'Foto da rua / entorno' },
  region: { alt: 'Rio Gorutuba, em Janaúba', placeholder: 'Foto da região (Rio Gorutuba / Bico da Pedra)' },
};

/* -------------------------------------------------------------------------- */
/* Galeria                                                                    */
/* -------------------------------------------------------------------------- */

export const galleryCategories: GalleryCategory[] = [
  { id: 'hotel', label: 'Hotel' },
  { id: 'quartos', label: 'Quartos' },
];

const allGallery: GalleryItem[] = [
  { id: 'fachada', category: 'hotel', image: images.hero },
  ...rooms.map((room) => ({ id: room.slug, category: 'quartos', image: room.images[0] })),
  { id: 'recepcao', category: 'hotel', image: images.about },
  { id: 'estacionamento', category: 'hotel', image: { alt: 'Estacionamento do Hotel Premier', placeholder: 'Foto do estacionamento' } },
  { id: 'banheiro', category: 'quartos', image: rooms[0].images[2] },
];

/** No site publicado, a galeria mostra só fotos reais; os espaços reservados ficam ocultos. */
export const gallery = allGallery.filter((g) => g.image.src || siteConfig.showPlaceholderLabels);

/** O item "Galeria" só aparece no menu quando há fotos para mostrar. */
export const navigation = allNavigation.filter((n) => n.section !== 'galeria' || gallery.length > 0);

/* -------------------------------------------------------------------------- */
/* Avaliações reais (trechos públicos)                                         */
/* -------------------------------------------------------------------------- */

export const reviews: Review[] = [
  {
    author: 'evertonc2014',
    source: 'Tripadvisor',
    text: 'O atendimento é impecável, os quartos são novos, espaçosos e confortáveis […]',
    url: 'https://www.tripadvisor.com.br/ShowUserReviews-g2344203-d6746066-r959619720',
  },
  {
    author: 'Rosianita Balena',
    source: 'Google',
    text: 'Opções de alimentação próximas (na esquina do prédio).',
    url: hotel.links.googleMaps,
  },
];

/* -------------------------------------------------------------------------- */
/* Arredores — tempos estimados de deslocamento segundo o Google               */
/* -------------------------------------------------------------------------- */

const gSearch = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const nearby: NearbyPlace[] = [
  {
    name: 'Diocese de Janaúba',
    description: 'Ponto de interesse',
    minutes: 3,
    url: gSearch('Diocese de Janaúba'),
  },
  {
    name: 'Praia do Copo Sujo',
    description: 'Às margens do Rio Gorutuba',
    minutes: 7,
    url: gSearch('Praia do Copo Sujo Rio Gorutuba Janaúba'),
  },
  {
    name: 'Barragem Bico da Pedra',
    description: 'Ponto de interesse',
    minutes: 22,
    url: gSearch('Barragem Bico da Pedra'),
  },
  {
    name: 'Balneário Bico da Pedra',
    description: 'Ponto de interesse',
    minutes: 38,
    url: gSearch('Balneário Bico da Pedra'),
  },
];

/* -------------------------------------------------------------------------- */
/* Perguntas frequentes                                                       */
/* -------------------------------------------------------------------------- */

export const faq: FaqItem[] = [
  {
    question: 'Qual é o horário de check-in?',
    answer: `O check-in é a partir das ${hotel.policies.checkIn.replace(':00', 'h')}. Nossa recepção funciona 24 horas.`,
  },
  {
    question: 'E o horário de check-out?',
    answer: hotel.policies.checkOut
      ? `O check-out é até as ${hotel.policies.checkOut.replace(':00', 'h')}.`
      : 'Confirme o horário de check-out com a nossa recepção no momento da reserva — teremos prazer em orientar você.',
  },
  {
    question: 'O hotel tem estacionamento?',
    answer: 'Sim. O estacionamento está incluído na hospedagem.',
  },
  {
    question: 'O Wi-Fi é gratuito?',
    answer: 'Sim, o Wi-Fi é gratuito para todos os hóspedes.',
  },
  {
    question: 'Posso levar meu animal de estimação?',
    answer: 'Sim, aceitamos animais de estimação, com cobrança à parte. Fale com a recepção para conhecer as condições.',
  },
  {
    question: 'O café da manhã está incluído?',
    answer:
      'As tarifas de referência divulgadas não incluem café da manhã. Para saber das opções disponíveis no período da sua estadia, fale com a nossa recepção. Há opções de alimentação bem perto, na esquina do prédio.',
  },
  {
    question: 'Posso cancelar a reserva sem custo?',
    answer: hotel.policies.cancellation,
  },
  {
    question: 'Como faço para reservar?',
    answer:
      'Escolha as datas em "Ver disponibilidade" para consultar tarifas no Booking.com, ou fale diretamente com a recepção pelo WhatsApp ou telefone.',
  },
];
