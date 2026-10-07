import type { Amenity } from '@/types';

/** Somente serviços e comodidades informados pelo hotel/listagens oficiais. */
export const amenities: Amenity[] = [
  {
    id: 'wifi',
    icon: 'wifi',
    title: 'Wi-Fi gratuito',
    shortTitle: 'Wi-Fi grátis',
    note: 'incluso',
    description:
      'Conexão sem custo adicional para trabalhar, planejar o roteiro ou falar com quem ficou em casa.',
  },
  {
    id: 'parking',
    icon: 'parking',
    title: 'Estacionamento',
    shortTitle: 'Estacionamento',
    note: 'incluso',
    description:
      'Chegue de carro com tranquilidade: o estacionamento já está incluído na sua hospedagem.',
  },
  {
    id: 'air',
    icon: 'air',
    title: 'Ar-condicionado',
    shortTitle: 'Ar-condicionado',
    description:
      'Ambientes climatizados para um descanso de verdade, mesmo nos dias mais quentes do Norte de Minas.',
  },
  {
    id: 'reception',
    icon: 'reception',
    title: 'Recepção 24 horas',
    shortTitle: 'Recepção 24h',
    description:
      'Chegue no horário que for: nossa recepção funciona dia e noite para receber você e ajudar no que precisar.',
  },
  {
    id: 'room-service',
    icon: 'roomService',
    title: 'Serviço de quarto',
    shortTitle: 'Serviço de quarto',
    description: 'Mais comodidade durante a estadia, com atendimento no conforto do seu quarto.',
  },
  {
    id: 'pets',
    icon: 'pet',
    title: 'Aceitamos pets',
    shortTitle: 'Pet friendly',
    note: 'cobrado à parte',
    description:
      'Seu animal de estimação também é bem-vindo. A hospedagem do pet tem cobrança à parte — consulte as condições.',
  },
];

export const getAmenity = (id: string) => amenities.find((a) => a.id === id);
