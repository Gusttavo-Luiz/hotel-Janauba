import type { RatingSummary } from '@/types';

/**
 * Fonte oficial de dados do hotel.
 * Campos `null` ainda não foram informados: as seções correspondentes ficam
 * ocultas automaticamente e passam a aparecer assim que o dado for preenchido.
 */
export const hotel = {
  name: 'Hotel Premier Janaúba',
  shortName: 'Hotel Premier',
  /** Frase do perfil oficial do hotel no Instagram. */
  slogan: 'Não perca a oportunidade de ter a melhor experiência de hospedagem da sua vida.',
  heroDescription:
    'No Centro de Janaúba, com recepção 24 horas, Wi-Fi gratuito e estacionamento incluso. Quartos para casais, trios e famílias.',

  address: {
    street: 'Rua Inhumas, 175',
    neighborhood: 'Centro',
    city: 'Janaúba',
    state: 'MG',
    stateName: 'Minas Gerais',
    postalCode: '39442-030',
    country: 'BR',
  },

  contact: {
    phoneDisplay: '(38) 99876-0055',
    phoneE164: '+5538998760055',
    /**
     * Número usado no botão do WhatsApp. Por ser um celular, foi configurado
     * o mesmo número do telefone — confirme com o hotel. Use `null` para ocultar.
     */
    whatsapp: '5538998760055' as string | null,
    email: null as string | null,
    /** Horário de atendimento. */
    serviceHours: 'Recepção 24 horas',
  },

  social: {
    instagram: {
      handle: '@hotelpremierjanauba',
      url: 'https://www.instagram.com/hotelpremierjanauba/',
    },
  },

  links: {
    booking: 'https://www.booking.com/hotel/br/premier-janauba-janauba.pt-br.html',
    tripadvisor:
      'https://www.tripadvisor.com.br/Hotel_Review-g2344203-d6746066-Reviews-Hotel_Premier_Janauba-Janauba_State_of_Minas_Gerais.html',
    googleMaps:
      'https://www.google.com/maps/search/?api=1&query=Hotel+Premier+Janauba%2C+R.+Inhumas%2C+175%2C+Janauba+-+MG',
  },

  policies: {
    checkIn: '14:00',
    /** Não informado. Preencha (ex.: '12:00') para exibir no site. */
    checkOut: null as string | null,
    pets: 'Aceitamos animais de estimação, com cobrança à parte.',
    cancellation:
      'Há tarifas com cancelamento gratuito, de acordo com as condições da tarifa escolhida no momento da reserva.',
  },

  /** Texto institucional (seção "O Hotel"). */
  about: [
    'No Centro de Janaúba, na Rua Inhumas, o Hotel Premier recebe quem chega à cidade a trabalho, em família ou para conhecer o Norte de Minas — com a tranquilidade de ter tudo o que importa à mão.',
    'Nossa recepção funciona 24 horas por dia e a hospedagem inclui Wi-Fi gratuito e estacionamento. Os quartos acomodam de duas a quatro pessoas, há serviço de quarto e o seu animal de estimação também é bem-vindo.',
  ],

  /** História do hotel. Ainda não informada — a seção aparece quando preenchida. */
  history: null as string[] | null,

  /** Quantidade de quartos. Não informada. */
  roomCount: null as number | null,
} as const;

export const ratings: RatingSummary[] = [
  {
    source: 'Google',
    score: 4.3,
    scale: 5,
    label: 'Muito bom',
    count: 114,
    url: hotel.links.googleMaps,
  },
  {
    source: 'Tripadvisor',
    score: 4.3,
    scale: 5,
    count: 4,
    url: hotel.links.tripadvisor,
  },
];

export const fullAddress = `${hotel.address.street} – ${hotel.address.neighborhood}, ${hotel.address.city} – ${hotel.address.state}, ${hotel.address.postalCode}`;
