import type { Room } from '@/types';

/**
 * Acomodações informadas. Preços são valores de referência por noite
 * divulgados em plataformas parceiras (Booking.com/Agoda) e podem variar.
 * Camas e área só aparecem quando informadas.
 */
export const rooms: Room[] = [
  {
    slug: 'quarto-duplo',
    name: 'Quarto Duplo',
    summary: 'Uma cama de casal e o aconchego ideal para quem viaja a dois.',
    description: [
      'O Quarto Duplo foi pensado para casais e para quem viaja a dois, a passeio ou a trabalho. Uma cama de casal garante o descanso depois de um dia cheio em Janaúba.',
      'Durante a estadia, você conta com Wi-Fi gratuito, estacionamento incluso, serviço de quarto e uma recepção que funciona 24 horas.',
    ],
    capacity: 2,
    beds: '1 cama de casal',
    priceFrom: 220,
    amenityIds: ['wifi', 'air', 'parking', 'room-service'],
    images: [
      { alt: 'Quarto Duplo do Hotel Premier Janaúba', placeholder: 'Quarto Duplo — foto principal' },
      { alt: 'Detalhe do Quarto Duplo', placeholder: 'Quarto Duplo — detalhe' },
      { alt: 'Banheiro do Quarto Duplo', placeholder: 'Quarto Duplo — banheiro' },
    ],
  },
  {
    slug: 'quarto-triplo',
    name: 'Quarto Triplo',
    summary: 'Espaço para três hóspedes, perfeito para amigos, colegas ou família.',
    description: [
      'O Quarto Triplo acomoda até três pessoas — uma ótima escolha para viagens em família, entre amigos ou para equipes de trabalho que querem ficar juntas.',
      'Wi-Fi gratuito, estacionamento incluso e serviço de quarto completam a estadia, com a recepção 24 horas sempre à disposição.',
    ],
    capacity: 3,
    priceFrom: 270,
    amenityIds: ['wifi', 'air', 'parking', 'room-service'],
    images: [
      { alt: 'Quarto Triplo do Hotel Premier Janaúba', placeholder: 'Quarto Triplo — foto principal' },
      { alt: 'Detalhe do Quarto Triplo', placeholder: 'Quarto Triplo — detalhe' },
      { alt: 'Banheiro do Quarto Triplo', placeholder: 'Quarto Triplo — banheiro' },
    ],
  },
  {
    slug: 'quarto-familia',
    name: 'Quarto Família',
    summary: 'Até quatro hóspedes no mesmo quarto, para a família toda ficar junta.',
    description: [
      'O Quarto Família recebe até quatro hóspedes e é a opção ideal para quem viaja com a família toda e prefere ficar no mesmo ambiente.',
      'Aproveite o Wi-Fi gratuito, o estacionamento incluso e o serviço de quarto. E, se o pet faz parte da família, ele também é bem-vindo (cobrança à parte).',
    ],
    capacity: 4,
    priceFrom: 320,
    amenityIds: ['wifi', 'air', 'parking', 'room-service'],
    images: [
      { alt: 'Quarto Família do Hotel Premier Janaúba', placeholder: 'Quarto Família — foto principal' },
      { alt: 'Detalhe do Quarto Família', placeholder: 'Quarto Família — detalhe' },
      { alt: 'Banheiro do Quarto Família', placeholder: 'Quarto Família — banheiro' },
    ],
  },
];

export const priceDisclaimer =
  'Valores de referência por noite, divulgados em plataformas parceiras de reserva. Podem variar conforme a data, a ocupação e a disponibilidade.';

export const maxRoomCapacity = Math.max(...rooms.map((r) => r.capacity));

export const getRoom = (slug: string | undefined) => rooms.find((r) => r.slug === slug);
