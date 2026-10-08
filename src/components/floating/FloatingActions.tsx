import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ArrowUp } from 'lucide-react';
import { BOOKING_SECTION_ID, useBooking } from '@/context/BookingContext';
import { rooms } from '@/data/rooms';
import { useScrolled } from '@/hooks';
import { cn, formatPrice } from '@/lib/utils';
import { whatsappUrl } from '@/services/whatsapp';
import { WhatsAppIcon } from '@/components/ui/Icon';

/** id do formulário de reserva lateral da página de cada quarto. */
export const ROOM_BOOKING_ID = 'reservar-quarto';

const prices = rooms.map((r) => r.priceFrom).filter((p): p is number => typeof p === 'number');
const minPrice = prices.length ? Math.min(...prices) : null;

/** `true` enquanto algum formulário de reserva está visível na tela. */
function useBookingFormInView() {
  const [inView, setInView] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setInView(false);
    const targets = [BOOKING_SECTION_ID, ROOM_BOOKING_ID]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setInView(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);
  return inView;
}

/**
 * Ações flutuantes: no celular, barra fixa com "Reservar" e WhatsApp depois do
 * banner; no desktop, botão do WhatsApp. Em ambos, botão de voltar ao topo.
 */
export function FloatingActions() {
  const scrolled = useScrolled(600);
  const formInView = useBookingFormInView();
  const { openBooking } = useBooking();
  const wa = whatsappUrl();
  const showBar = scrolled && !formInView;

  const reserve = () => {
    const roomForm = document.getElementById(ROOM_BOOKING_ID);
    if (roomForm) roomForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else openBooking();
  };

  return (
    <>
      <div
        className={cn(
          'pointer-events-none fixed right-4 z-40 flex flex-col items-end gap-3 transition-[bottom] duration-500 sm:right-6 md:bottom-6',
          showBar ? 'bottom-24' : 'bottom-4',
        )}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          tabIndex={scrolled ? 0 : -1}
          className={cn(
            'grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-ivory/95 text-ink shadow-soft backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:bg-white',
            scrolled ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
          )}
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className={cn(
              'group pointer-events-auto relative flex h-14 items-center gap-0 rounded-full bg-whatsapp pr-4 pl-4 text-white shadow-[0_12px_30px_-10px_rgb(18_128_67/0.6)] transition-all duration-500 hover:-translate-y-0.5 hover:gap-2.5 hover:pr-5',
              // no celular, a barra fixa já tem o WhatsApp
              showBar && 'max-md:pointer-events-none max-md:translate-y-3 max-md:opacity-0',
            )}
          >
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp opacity-20 [animation-duration:2.6s]" aria-hidden="true" />
            <WhatsAppIcon className="h-6 w-6" />
            <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 group-hover:max-w-40 group-focus-visible:max-w-40">
              Fale conosco
            </span>
          </a>
        )}
      </div>

      {/* Barra fixa de reserva (celular) */}
      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] text-white backdrop-blur-md transition-transform duration-500 ease-[var(--ease-elegant)] md:hidden',
          showBar ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {minPrice !== null && (
            <p className="min-w-0 flex-1 text-xs leading-tight text-white/60">
              a partir de
              <span className="block font-serif text-xl text-white">
                {formatPrice(minPrice)}
                <span className="font-sans text-xs text-white/50"> /noite*</span>
              </span>
            </p>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-whatsapp text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          )}
          <button
            type="button"
            onClick={reserve}
            className={cn(
              'h-12 rounded-full bg-gold px-6 text-[0.78rem] font-semibold tracking-[0.06em] text-ink uppercase transition active:scale-[0.98]',
              minPrice === null && 'flex-1',
            )}
          >
            Reservar
          </button>
        </div>
      </div>
    </>
  );
}
