import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface BookingContextValue {
  /** Acomodação pré-selecionada (ex.: ao clicar em "Reservar" num card). */
  roomSlug: string;
  setRoomSlug: (slug: string) => void;
  /** Incrementa a cada pedido de foco no formulário de reserva. */
  focusSignal: number;
  /** Leva o usuário ao formulário de reserva da página inicial. */
  openBooking: (slug?: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export const BOOKING_SECTION_ID = 'reservar';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [roomSlug, setRoomSlug] = useState('');
  const [focusSignal, setFocusSignal] = useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
    [navigate, pathname],
  );

  const value = useMemo(
    () => ({ roomSlug, setRoomSlug, focusSignal, openBooking }),
    [roomSlug, focusSignal, openBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking deve ser usado dentro de <BookingProvider>.');
  return ctx;
}
