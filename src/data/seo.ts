import { absoluteUrl, siteConfig } from '@/config/site';
import { amenities } from './amenities';
import { hotel } from './hotel';
import { getRoom, rooms } from './rooms';

export interface RouteMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

const brand = hotel.name;

export const staticRoutes: RouteMeta[] = [
  {
    path: '/',
    title: `${brand} | Hotel no Centro de Janaúba – MG`,
    description:
      'Hospede-se no Hotel Premier, no Centro de Janaúba (MG): quartos duplo, triplo e família, recepção 24h, Wi-Fi gratuito e estacionamento incluso.',
  },
  {
    path: '/o-hotel',
    title: `O Hotel | ${brand}`,
    description:
      'Conheça o Hotel Premier Janaúba: recepção 24 horas, serviço de quarto, Wi-Fi gratuito, estacionamento incluso e aceitamos pets. Rua Inhumas, 175 – Centro.',
  },
  {
    path: '/acomodacoes',
    title: `Acomodações | ${brand}`,
    description:
      'Quarto Duplo, Triplo e Família no Hotel Premier Janaúba. Opções para 2 a 4 hóspedes no Centro de Janaúba – MG. Consulte disponibilidade e reserve.',
  },
  {
    path: '/politica-de-privacidade',
    title: `Política de Privacidade | ${brand}`,
    description: 'Saiba como o Hotel Premier Janaúba trata os dados pessoais enviados pelo site.',
  },
  {
    path: '/termos-de-uso',
    title: `Termos de Uso | ${brand}`,
    description: 'Termos de uso do site do Hotel Premier Janaúba.',
  },
];

export const roomRoutes: RouteMeta[] = rooms.map((room) => ({
  path: `/acomodacoes/${room.slug}`,
  title: `${room.name} | ${brand}`,
  description: `${room.name} no Hotel Premier Janaúba: até ${room.capacity} hóspedes${
    room.beds ? `, ${room.beds}` : ''
  }. Wi-Fi gratuito, estacionamento incluso e recepção 24h no Centro de Janaúba – MG.`,
}));

export const notFoundMeta: RouteMeta = {
  path: '/404',
  title: `Página não encontrada | ${brand}`,
  description: 'A página que você procura não existe ou foi movida.',
  noindex: true,
};

export const allRoutes = [...staticRoutes, ...roomRoutes];

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalize(pathname);
  return allRoutes.find((r) => r.path === path) ?? notFoundMeta;
}

/** Dados estruturados (schema.org) do hotel. */
export function hotelJsonLd() {
  const url = absoluteUrl('/');
  const prices = rooms.map((r) => r.priceFrom).filter((p): p is number => typeof p === 'number');
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.about[0],
    ...(url ? { url, '@id': `${url}#hotel` } : {}),
    telephone: hotel.contact.phoneE164,
    ...(hotel.contact.email ? { email: hotel.contact.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address.street,
      addressLocality: hotel.address.city,
      addressRegion: hotel.address.state,
      postalCode: hotel.address.postalCode,
      addressCountry: hotel.address.country,
    },
    hasMap: hotel.links.googleMaps,
    checkinTime: hotel.policies.checkIn,
    ...(hotel.policies.checkOut ? { checkoutTime: hotel.policies.checkOut } : {}),
    petsAllowed: true,
    ...(prices.length
      ? { priceRange: `R$ ${Math.min(...prices)} – R$ ${Math.max(...prices)}`, currenciesAccepted: 'BRL' }
      : {}),
    amenityFeature: amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a.title,
      value: true,
    })),
    containsPlace: rooms.map((room) => ({
      '@type': 'HotelRoom',
      name: room.name,
      occupancy: { '@type': 'QuantitativeValue', maxValue: room.capacity },
      ...(room.beds ? { bed: room.beds } : {}),
      ...(siteConfig.url ? { url: absoluteUrl(`/acomodacoes/${room.slug}`) } : {}),
    })),
    sameAs: [hotel.social.instagram.url, hotel.links.booking, hotel.links.tripadvisor],
  };
}

export function breadcrumbJsonLd(pathname: string) {
  if (!siteConfig.url) return null;
  const path = normalize(pathname);
  const items: { name: string; path: string }[] = [{ name: 'Início', path: '/' }];
  if (path.startsWith('/acomodacoes')) items.push({ name: 'Acomodações', path: '/acomodacoes' });
  const room = getRoom(path.split('/')[2]);
  if (room) items.push({ name: room.name, path });
  if (items.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
