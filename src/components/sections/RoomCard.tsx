import { ArrowUpRight, BedDouble, Maximize2, Users } from 'lucide-react';
import { Link } from 'react-router';
import { getAmenity } from '@/data/amenities';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import type { Room } from '@/types';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';

export function RoomCard({ room, headingLevel = 'h3' }: { room: Room; headingLevel?: 'h2' | 'h3' }) {
  const { openBooking } = useBooking();
  const Heading = headingLevel;
  const href = `/acomodacoes/${room.slug}`;
  const roomAmenities = room.amenityIds.map(getAmenity).filter((a) => a !== undefined);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition-all duration-500 ease-[var(--ease-elegant)] hover:-translate-y-1.5 hover:shadow-lift">
      <Link to={href} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden">
        <Media
          image={room.images[0]}
          className="aspect-[4/3] transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {room.priceFrom && (
          <span className="absolute top-4 left-4 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs text-white backdrop-blur">
            a partir de <strong className="font-semibold text-gold-light">{formatPrice(room.priceFrom)}</strong>
            <span className="text-white/60"> /noite*</span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold tracking-[0.08em] text-stone uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold-dark" aria-hidden="true" strokeWidth={1.5} />
            Até {room.capacity} hóspedes
          </span>
          {room.beds && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-gold-dark" aria-hidden="true" strokeWidth={1.5} />
              {room.beds}
            </span>
          )}
          {room.areaM2 && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-gold-dark" aria-hidden="true" strokeWidth={1.5} />
              {room.areaM2} m²
            </span>
          )}
        </div>

        <Heading className="mt-4 text-[2rem] leading-tight text-ink">
          <Link to={href} className="transition-colors hover:text-gold-dark">
            {room.name}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{room.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Comodidades">
          {roomAmenities.map((a) => (
            <li key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-graphite">
              <Icon name={a.icon} className="h-3.5 w-3.5 text-gold-dark" />
              {a.shortTitle ?? a.title}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <ButtonLink to={href} variant="outline" className="flex-1" aria-label={`Ver detalhes do ${room.name}`}>
            Ver detalhes
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" />
          </ButtonLink>
          <Button className="flex-1" onClick={() => openBooking(room.slug)} aria-label={`Reservar ${room.name}`}>
            Reservar
          </Button>
        </div>
      </div>
    </article>
  );
}
