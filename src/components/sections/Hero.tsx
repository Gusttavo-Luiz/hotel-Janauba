import { useEffect, useRef } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { images } from '@/data/content';
import { hotel, ratings } from '@/data/hotel';
import { useBooking } from '@/context/BookingContext';
import { formatScore } from '@/lib/utils';
import { ArchMotif } from '@/components/ui/ArchMotif';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Media } from '@/components/ui/Media';

/** Fundo decorativo usado enquanto a foto real da fachada não é enviada. */
export function HeroBackdrop() {
  return (
    <div className="grain absolute inset-0 bg-[#141311]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_78%_18%,rgb(196_162_113/0.28),transparent_60%),radial-gradient(ellipse_60%_50%_at_8%_100%,rgb(133_102_58/0.25),transparent_60%),linear-gradient(160deg,#211e1a_0%,#141311_55%,#0d0c0b_100%)]" />
      <ArchMotif className="absolute top-1/2 right-[-18%] h-[130%] -translate-y-1/2 text-gold-light/[0.13] sm:right-[-8%] lg:right-[-2%]" />
    </div>
  );
}

function useParallax<T extends HTMLElement>(factor = 0.22) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      el.style.transform = `translate3d(0, ${y * factor}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [factor]);
  return ref;
}

export function Hero() {
  const { openBooking } = useBooking();
  const parallaxRef = useParallax<HTMLDivElement>();
  const google = ratings.find((r) => r.source === 'Google');

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink pt-28 pb-36 text-white sm:min-h-[94svh] lg:pb-40">
      <div ref={parallaxRef} className="absolute inset-0 -z-10 will-change-transform">
        {images.hero.src ? (
          <Media image={images.hero} priority className="h-full w-full" />
        ) : (
          <HeroBackdrop />
        )}
      </div>
      {!images.hero.src && siteConfig.showPlaceholderLabels && (
        <span className="absolute top-24 right-4 hidden rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-white/55 uppercase backdrop-blur sm:block lg:right-8">
          Espaço para foto · {images.hero.placeholder}
        </span>
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(13_12_11/0.55)_0%,rgb(13_12_11/0.25)_40%,rgb(13_12_11/0.75)_100%)]" aria-hidden="true" />

      <div className="container-x">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light animate-fade-in [animation-delay:100ms]">
            Centro · Janaúba · Minas Gerais
          </p>
          <h1
            id="hero-title"
            className="mt-6 animate-slide-up text-[3.4rem] leading-[0.95] font-medium text-white [animation-delay:150ms] sm:text-7xl lg:text-[6.2rem]"
          >
            Hotel Premier{' '}
            <span className="mt-2 block font-normal text-gold-light italic">Janaúba</span>
          </h1>
          <p className="mt-7 max-w-xl animate-slide-up font-serif text-[1.45rem] leading-snug text-white/90 italic [animation-delay:300ms] sm:text-[1.7rem]">
            “{hotel.slogan}”
          </p>
          <p className="mt-5 max-w-lg animate-slide-up text-[0.98rem] leading-relaxed text-white/70 [animation-delay:400ms]">
            {hotel.heroDescription}
          </p>
          <div className="mt-9 flex animate-slide-up flex-col gap-3 [animation-delay:500ms] sm:flex-row sm:items-center sm:gap-4">
            <Button size="lg" onClick={() => openBooking()}>
              Reservar agora
            </Button>
            <ButtonLink to="/#o-hotel" variant="outline-light" size="lg">
              Conheça o hotel
            </ButtonLink>
          </div>

          {google && (
            <a
              href={google.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex animate-fade-in items-center gap-3 rounded-full border border-white/15 bg-white/5 py-2 pr-4 pl-2 text-sm text-white/80 backdrop-blur transition hover:border-white/30 hover:bg-white/10 [animation-delay:700ms]"
            >
              <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-ink">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                {formatScore(google.score)}
              </span>
              <span>
                {google.label} · {google.count} avaliações no Google
              </span>
            </a>
          )}
        </div>
      </div>

      <a
        href="#reservar"
        aria-label="Rolar para reservas"
        className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-white/50 uppercase transition hover:text-white lg:flex"
      >
        <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
