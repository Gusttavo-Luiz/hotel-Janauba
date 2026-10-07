import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEscape, useLockBodyScroll } from '@/hooks';
import type { SiteImage } from '@/types';
import { Media } from '@/components/ui/Media';

interface LightboxProps {
  items: SiteImage[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Visualização em tela cheia com teclado (← → Esc), toque (swipe) e foco gerenciado. */
export function Lightbox({ items, index, onChange }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => onChange(null), [onChange]);
  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useLockBodyScroll(open);
  useEscape(open, close);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    return () => lastFocus.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  // Pré-carrega as imagens vizinhas
  useEffect(() => {
    if (index === null) return;
    [index + 1, index - 1].forEach((i) => {
      const src = items[(i + items.length) % items.length]?.src;
      if (src) new Image().src = src;
    });
  }, [index, items]);

  if (!open || typeof document === 'undefined') return null;
  const item = items[index];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de fotos — ${index + 1} de ${items.length}`}
      className="fixed inset-0 z-[60] flex animate-fade-in flex-col bg-[#0d0c0b]/96 backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 text-white/70 sm:px-8">
        <span className="text-xs font-semibold tracking-[0.24em]" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fechar galeria"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24" onClick={(e) => e.target === e.currentTarget && close()}>
        <figure key={index} className="flex max-h-full w-full max-w-5xl animate-scale-in flex-col">
          <Media image={item} tone="dark" priority className="aspect-[3/2] max-h-[75vh] w-full rounded-lg" imgClassName="object-contain" />
          <figcaption className="mt-4 text-center font-serif text-lg text-white/80 italic">{item.alt}</figcaption>
        </figure>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-white transition hover:bg-white hover:text-ink sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-white transition hover:bg-white hover:text-ink sm:right-6"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <div className="h-6 sm:h-10" />
    </div>,
    document.body,
  );
}
