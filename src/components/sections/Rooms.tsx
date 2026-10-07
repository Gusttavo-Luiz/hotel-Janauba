import { ArrowRight } from 'lucide-react';
import { priceDisclaimer, rooms } from '@/data/rooms';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RoomCard } from './RoomCard';

export function Rooms() {
  return (
    <section id="acomodacoes" aria-labelledby="acomodacoes-title" className="scroll-mt-20 bg-cream/60 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Acomodações"
            id="acomodacoes-title"
            title={
              <>
                Quartos para cada <em className="text-gold-dark">jeito de viajar</em>
              </>
            }
            description="Do casal à família completa: opções para duas, três ou quatro pessoas, com Wi-Fi gratuito e estacionamento incluso."
          />
          <div data-reveal>
            <ButtonLink to="/acomodacoes" variant="ghost">
              Conhecer todas as acomodações
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {rooms.map((room, i) => (
            <li key={room.slug} data-reveal style={{ '--reveal-delay': `${i * 110}ms` } as React.CSSProperties}>
              <RoomCard room={room} />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs leading-relaxed text-stone">* {priceDisclaimer}</p>
      </div>
    </section>
  );
}
