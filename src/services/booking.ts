import { hotel } from '@/data/hotel';
import { getRoom, maxRoomCapacity } from '@/data/rooms';
import { formatDateBR, nightsBetween } from '@/lib/utils';
import { whatsappUrl } from './whatsapp';

/**
 * Integração de reservas.
 * O hotel não possui motor de reservas próprio informado; por isso a busca
 * direciona para a página oficial do hotel no Booking.com (com datas e
 * hóspedes já preenchidos) e oferece a reserva direta pelo WhatsApp.
 * Para integrar um motor próprio no futuro, basta implementar um novo
 * provedor em `buildBookingOptions`.
 */
export const bookingConfig = {
  provider: 'booking.com' as const,
  providerLabel: 'Booking.com',
  baseUrl: hotel.links.booking,
  /** Ative quando o hotel tiver códigos promocionais para reserva direta. */
  promoCodeEnabled: false,
  maxGuests: 12,
  maxRooms: 6,
};

export interface BookingRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  roomSlug?: string;
  promoCode?: string;
}

export type BookingErrors = Partial<Record<keyof BookingRequest, string>>;

export function validateBooking(req: BookingRequest, today: string): BookingErrors {
  const errors: BookingErrors = {};
  if (!req.checkIn) errors.checkIn = 'Informe a data de check-in.';
  else if (req.checkIn < today) errors.checkIn = 'O check-in não pode ser em uma data passada.';

  if (!req.checkOut) errors.checkOut = 'Informe a data de check-out.';
  else if (req.checkIn && req.checkOut <= req.checkIn) errors.checkOut = 'O check-out deve ser após o check-in.';
  else if (req.checkIn && nightsBetween(req.checkIn, req.checkOut) > 30)
    errors.checkOut = 'Para estadias acima de 30 noites, fale com a recepção.';

  if (!Number.isInteger(req.guests) || req.guests < 1) errors.guests = 'Informe ao menos 1 hóspede.';
  if (!Number.isInteger(req.rooms) || req.rooms < 1) errors.rooms = 'Informe ao menos 1 quarto.';
  else if (req.rooms > req.guests) errors.rooms = 'O número de quartos não pode ser maior que o de hóspedes.';

  const room = getRoom(req.roomSlug);
  const perRoom = room?.capacity ?? maxRoomCapacity;
  if (!errors.guests && !errors.rooms && req.guests > req.rooms * perRoom) {
    const needed = Math.ceil(req.guests / perRoom);
    errors.rooms = room
      ? `O ${room.name} recebe até ${perRoom} hóspedes. Selecione ao menos ${needed} quartos.`
      : `Nossa maior acomodação recebe até ${perRoom} hóspedes. Selecione ao menos ${needed} quartos.`;
  }
  return errors;
}

export function bookingSummary(req: BookingRequest) {
  const nights = nightsBetween(req.checkIn, req.checkOut);
  const room = getRoom(req.roomSlug);
  return {
    nights,
    period: `${formatDateBR(req.checkIn)} → ${formatDateBR(req.checkOut)}`,
    details: [
      `${nights} ${nights === 1 ? 'noite' : 'noites'}`,
      `${req.guests} ${req.guests === 1 ? 'hóspede' : 'hóspedes'}`,
      `${req.rooms} ${req.rooms === 1 ? 'quarto' : 'quartos'}`,
      ...(room ? [room.name] : []),
    ].join(' · '),
  };
}

export function buildBookingOptions(req: BookingRequest) {
  const params = new URLSearchParams({
    checkin: req.checkIn,
    checkout: req.checkOut,
    group_adults: String(req.guests),
    group_children: '0',
    no_rooms: String(req.rooms),
    selected_currency: 'BRL',
    lang: 'pt-br',
  });
  const providerUrl = `${bookingConfig.baseUrl}?${params.toString()}`;

  const room = getRoom(req.roomSlug);
  const summary = bookingSummary(req);
  const lines = [
    `Olá! Gostaria de reservar no ${hotel.name}.`,
    `• Check-in: ${formatDateBR(req.checkIn)}`,
    `• Check-out: ${formatDateBR(req.checkOut)} (${summary.details.split(' · ')[0]})`,
    `• Hóspedes: ${req.guests}`,
    `• Quartos: ${req.rooms}`,
    ...(room ? [`• Acomodação: ${room.name}`] : []),
    ...(req.promoCode ? [`• Código promocional: ${req.promoCode}`] : []),
    'Há disponibilidade?',
  ];

  return { providerUrl, whatsappUrl: whatsappUrl(lines.join('\n')) };
}
