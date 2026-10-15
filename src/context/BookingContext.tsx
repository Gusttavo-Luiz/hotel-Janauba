import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getRoom } from '@/data/rooms';
import { bookingConfig } from '@/services/booking';
import { toISODate } from '@/lib/utils';

/** Datas e ocupação escolhidas pelo visitante (compartilhadas entre as páginas). */
export interface Stay {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

interface BookingContextValue {
  /** Acomodação pré-selecionada (ex.: ao clicar em "Reservar" num card). */
  roomSlug: string;
  /** Troca a acomodação e ajusta os hóspedes à capacidade dela. */
  setRoomSlug: (slug: string) => void;
  stay: Stay;
  updateStay: (patch: Partial<Stay>) => void;
  /** Incrementa a cada pedido de foco no formulário de reserva. */
  focusSignal: number;
  /** Leva o usuário ao formulário de reserva da página inicial. */
  openBooking: (slug?: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export const BOOKING_SECTION_ID = 'reservar';

const STORAGE_KEY = 'hotel-premier:estadia';
const defaultStay: Stay = { checkIn: '', checkOut: '', guests: 2, rooms: 1 };

const isISODate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const intInRange = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : fallback;

/** Lê a estadia salva na sessão, descartando datas passadas ou valores inválidos. */
function readStoredStay(): { stay: Stay; roomSlug: string } | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    const today = toISODate(new Date());
    // Datas só voltam em par válido e a partir de hoje.
    const validDates =
      isISODate(data.checkIn) && isISODate(data.checkOut) && data.checkIn >= today && data.checkOut > data.checkIn;
    const checkIn = validDates ? (data.checkIn as string) : '';
    const checkOut = validDates ? (data.checkOut as string) : '';
    const guests = intInRange(data.guests, 1, bookingConfig.maxGuests, defaultStay.guests);
    const rooms = intInRange(data.rooms, 1, Math.min(bookingConfig.maxRooms, guests), defaultStay.rooms);
    const roomSlug = typeof data.roomSlug === 'string' && getRoom(data.roomSlug) ? data.roomSlug : '';
    return { stay: { checkIn, checkOut, guests, rooms }, roomSlug };
  } catch {
    return null;
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [roomSlug, setRoomSlugState] = useState('');
  const [stay, setStay] = useState<Stay>(defaultStay);
  const [focusSignal, setFocusSignal] = useState(0);
  const restored = useRef(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Restaura só no navegador, depois da hidratação (o HTML pré-renderizado usa os padrões).
  useEffect(() => {
    const saved = readStoredStay();
    if (saved) {
      setStay(saved.stay);
      setRoomSlugState(saved.roomSlug);
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stay, roomSlug }));
    } catch {
      /* armazenamento indisponível (modo privado, bloqueado etc.) */
    }
  }, [stay, roomSlug]);

  const updateStay = useCallback((patch: Partial<Stay>) => setStay((s) => ({ ...s, ...patch })), []);

  const setRoomSlug = useCallback((slug: string) => {
    setRoomSlugState(slug);
    const room = getRoom(slug);
    if (room) setStay((s) => ({ ...s, guests: room.capacity, rooms: 1 }));
  }, []);

  const openBooking = useCallback(
    (slug?: string) => {
      if (slug !== undefined) setRoomSlug(slug);
      setFocusSignal((n) => n + 1);
      if (pathname !== '/') {
        navigate(`/#${BOOKING_SECTION_ID}`);
      } else {
        document.getElementById(BOOKING_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [navigate, pathname, setRoomSlug],
  );

  const value = useMemo(
    () => ({ roomSlug, setRoomSlug, stay, updateStay, focusSignal, openBooking }),
    [roomSlug, setRoomSlug, stay, updateStay, focusSignal, openBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking deve ser usado dentro de <BookingProvider>.');
  return ctx;
}
