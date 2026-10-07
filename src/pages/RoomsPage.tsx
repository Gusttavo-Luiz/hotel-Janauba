import { useMemo, useState } from 'react';
import { priceDisclaimer, rooms } from '@/data/rooms';
import { cn } from '@/lib/utils';
import { CtaBand } from '@/components/sections/CtaBand';
import { PageHero } from '@/components/sections/PageHero';
import { RoomCard } from '@/components/sections/RoomCard';

// A menor capacidade equivale a "Todas", por isso fica fora dos filtros.
const capacities = [...new Set(rooms.map((r) => r.capacity))].sort((a, b) => a - b).slice(1);

export default function RoomsPage() {
  const [minGuests, setMinGuests] = useState(0);
  const filtered = useMemo(() => rooms.filter((r) => r.capacity >= minGuests), [minGuests]);

  const options = [{ value: 0, label: 'Todas' }, ...capacities.map((c) => ({ value: c, label: `Para ${c} pessoas` }))];

  return (
    <>
      <PageHero
        eyebrow="Acomodações"
        title={
          <>
            Escolha o quarto ideal <em className="text-gold-light">para a sua viagem</em>
          </>
        }
        description="Quarto Duplo, Triplo e Família: opções para duas a quatro pessoas no Centro de Janaúba, com Wi-Fi gratuito e estacionamento incluso."
        breadcrumbs={[{ label: 'Início', to: '/' }, { label: 'Acomodações' }]}
      />

      <section aria-label="Lista de acomodações" className="py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Filtrar por número de hóspedes" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={minGuests === o.value}
                  onClick={() => setMinGuests(o.value)}
                  className={cn(
                    'shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300',
                    minGuests === o.value ? 'border-ink bg-ink text-ivory' : 'border-ink/15 text-graphite hover:border-ink/40',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-stone" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'acomodação encontrada' : 'acomodações encontradas'}
            </p>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filtered.map((room) => (
              <li key={room.slug} className="animate-scale-in">
                <RoomCard room={room} headingLevel="h2" />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs leading-relaxed text-stone">* {priceDisclaimer}</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
