export type IconName =
  | 'wifi'
  | 'parking'
  | 'air'
  | 'reception'
  | 'roomService'
  | 'pet'
  | 'clock'
  | 'users'
  | 'bed'
  | 'mapPin'
  | 'star';

/**
 * Imagem do site. Quando `src` não é informado, o componente <Media> exibe um
 * placeholder identificado, pronto para receber a foto real do hotel.
 */
export interface SiteImage {
  /** Caminho da imagem (ex.: /images/fachada-1600.webp). */
  src?: string;
  /** srcset opcional para imagens responsivas (ex.: "/images/a-800.webp 800w, /images/a-1600.webp 1600w"). */
  srcSet?: string;
  /** Texto alternativo descritivo (acessibilidade e SEO). */
  alt: string;
  /** Rótulo exibido no placeholder enquanto a foto real não é enviada. */
  placeholder: string;
  width?: number;
  height?: number;
}

export interface Amenity {
  id: string;
  icon: IconName;
  title: string;
  shortTitle?: string;
  description: string;
  /** Observação curta exibida junto ao título (ex.: "incluso", "cobrado à parte"). */
  note?: string;
}

export interface Room {
  slug: string;
  name: string;
  summary: string;
  description: string[];
  capacity: number;
  /** Configuração de camas. Deixe `undefined` quando não informada. */
  beds?: string;
  /** Área em m². Deixe `undefined` quando não informada. */
  areaM2?: number;
  /** Preço de referência por noite, em reais. */
  priceFrom?: number;
  /** IDs de comodidades (ver data/amenities.ts). */
  amenityIds: string[];
  images: SiteImage[];
}

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface GalleryItem {
  id: string;
  category: string;
  image: SiteImage;
}

export interface Review {
  author: string;
  source: 'Google' | 'Tripadvisor';
  text: string;
  url?: string;
  /** Nota do hóspede (1 a 5), apenas quando informada. */
  rating?: number;
  /** Data da avaliação, apenas quando informada. */
  date?: string;
}

export interface RatingSummary {
  source: 'Google' | 'Tripadvisor';
  score: number;
  scale: number;
  label?: string;
  count: number;
  url: string;
}

export interface NearbyPlace {
  name: string;
  description: string;
  /** Tempo estimado de deslocamento, em minutos. */
  minutes: number;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  /** id da seção na página inicial */
  section: string;
}
