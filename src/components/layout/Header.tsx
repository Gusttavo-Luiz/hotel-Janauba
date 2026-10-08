import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, Phone, X } from 'lucide-react';
import { navigation } from '@/data/content';
import { hotel } from '@/data/hotel';
import { useBooking } from '@/context/BookingContext';
import { useEscape, useLockBodyScroll, useScrolled } from '@/hooks';
import { cn, sectionHref } from '@/lib/utils';
import { whatsappUrl } from '@/services/whatsapp';
import { Button, ButtonAnchor } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { Logo } from './Logo';

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState('inicio');
  useEffect(() => {
    if (!enabled) return;
    const ids = navigation.map((n) => n.section);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : '';
}

export function Header() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openBooking } = useBooking();
  const active = useActiveSection(pathname === '/');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wa = whatsappUrl();

  const close = useCallback(() => setOpen(false), []);
  useLockBodyScroll(open);
  useEscape(open, () => {
    close();
    menuButtonRef.current?.focus();
  });
  useEffect(close, [pathname, close]);

  const solid = scrolled && !open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ease-[var(--ease-elegant)]',
        solid
          ? 'bg-ivory/92 py-3 shadow-[0_1px_0_rgb(23_22_20/0.06),0_10px_30px_-20px_rgb(23_22_20/0.35)] backdrop-blur-md'
          : 'bg-transparent py-5',
      )}
    >
      <a
        href="#conteudo"
        className="sr-only z-50 rounded bg-ink px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <div className="container-x flex items-center justify-between gap-6">
        <Link to="/" className="relative z-50 shrink-0">
          <Logo tone={solid ? 'dark' : 'light'} />
          <span className="sr-only"> — página inicial</span>
        </Link>

        <nav aria-label="Menu principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => {
              const isActive = active === item.section;
              return (
                <li key={item.section}>
                  <Link
                    to={sectionHref(item.section)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative px-2.5 py-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 xl:px-3',
                      'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100',
                      isActive && 'after:scale-x-100',
                      solid ? 'text-graphite hover:text-ink' : 'text-white/85 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button size="sm" onClick={() => openBooking()} className="max-[359px]:hidden lg:px-5 lg:py-2.5">
            Reservar
          </Button>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'relative z-50 grid h-11 w-11 place-items-center rounded-full border transition-colors lg:hidden',
              solid ? 'border-ink/15 text-ink hover:bg-ink/5' : 'border-white/30 text-white hover:bg-white/10',
            )}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={cn(
          'grain fixed inset-0 z-40 flex flex-col bg-ink text-white transition-[opacity,visibility] duration-500 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Menu mobile" className="container-x flex flex-1 flex-col justify-center pt-24 pb-6">
          <ul className="space-y-1">
            {navigation.map((item, i) => (
              <li
                key={item.section}
                className={cn('transition-all duration-700 ease-[var(--ease-elegant)]', open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
              >
                <Link
                  to={sectionHref(item.section)}
                  onClick={close}
                  className="group flex items-baseline gap-4 py-2 font-serif text-[2.1rem] leading-tight text-white/90 transition-colors hover:text-gold-light"
                >
                  <span className="font-sans text-[0.65rem] tracking-[0.2em] text-gold-light/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x space-y-3 border-t border-white/10 py-6">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              close();
              openBooking();
            }}
          >
            Reservar agora
          </Button>
          <div className="grid grid-cols-2 gap-3">
            {wa && (
              <ButtonAnchor href={wa} variant="outline-light" size="md">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </ButtonAnchor>
            )}
            <ButtonAnchor href={`tel:${hotel.contact.phoneE164}`} external={false} variant="outline-light" size="md" className={cn(!wa && 'col-span-2')}>
              <Phone className="h-4 w-4" aria-hidden="true" /> Ligar
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </header>
  );
}
