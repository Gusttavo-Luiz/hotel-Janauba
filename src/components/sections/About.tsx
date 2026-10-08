import { ArrowRight } from 'lucide-react';
import { amenities } from '@/data/amenities';
import { images, nearby } from '@/data/content';
import { hotel, ratings } from '@/data/hotel';
import { rooms } from '@/data/rooms';
import { cn, formatScore } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { AddressArt, RatingArt } from '@/components/ui/arts';
import { SectionHeading } from '@/components/ui/SectionHeading';

const highlights = ['reception', 'wifi', 'parking', 'pets']
  .map((id) => amenities.find((a) => a.id === id))
  .filter((a) => a !== undefined);

export function About() {
  const google = ratings.find((r) => r.source === 'Google');
  const closest = [...nearby].sort((a, b) => a.minutes - b.minutes)[0];

  const stats = [
    google && { value: formatScore(google.score), label: `no Google · ${google.count} avaliações` },
    { value: String(rooms.length), label: 'tipos de acomodação' },
    { value: '24h', label: 'recepção' },
    closest && { value: `${closest.minutes} min`, label: `da ${closest.name}` },
  ].filter((s): s is { value: string; label: string } => Boolean(s));

  return (
    <section id="o-hotel" aria-labelledby="sobre-title" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6" data-reveal>
          <Media image={images.about} art={<AddressArt size="lg" />} className="aspect-[4/5] rounded-2xl sm:aspect-[5/5] lg:aspect-[4/5]" sizes="(min-width: 1024px) 45vw, 100vw" />
          <div className="absolute -right-3 -bottom-8 hidden w-[46%] overflow-hidden rounded-xl border-[6px] border-ivory shadow-lift sm:block lg:-right-10">
            <Media image={images.aboutDetail} art={<RatingArt />} className="aspect-[4/5]" tone="dark" sizes="20vw" />
          </div>
          <div className="absolute top-6 -left-3 hidden rounded-xl bg-ink px-5 py-4 text-white shadow-lift sm:block lg:-left-8">
            <p className="font-serif text-4xl leading-none text-gold-light">24h</p>
            <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.2em] text-white/70 uppercase">Recepção</p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pl-4">
          <SectionHeading
            eyebrow="O Hotel"
            id="sobre-title"
            title={
              <>
                Hospitalidade no coração de <em className="text-gold-dark">Janaúba</em>
              </>
            }
          />
          <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted" data-reveal>
            {hotel.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5" data-reveal>
            {highlights.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-dark">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm leading-snug font-semibold text-ink">
                  {a.title}
                  {a.note && <span className="block text-xs font-normal text-stone">{a.note}</span>}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10" data-reveal>
            <ButtonLink to="/o-hotel" variant="dark">
              {hotel.history ? 'Conheça nossa história' : 'Conheça o hotel'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-x mt-24">
        <ul className="grid grid-cols-2 gap-y-10 border-y border-ink/10 py-10 lg:grid-cols-4" data-reveal>
          {stats.map((s, i) => (
            <li
              key={s.label}
              className={cn(i % 2 === 1 && 'border-l border-ink/10 pl-6', i > 0 && 'lg:border-l lg:border-ink/10 lg:pl-10')}
            >
              <span className="block font-serif text-5xl leading-none text-ink sm:text-6xl">{s.value}</span>
              <span className="mt-2 block text-xs font-semibold tracking-[0.14em] text-stone uppercase">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
