import { Check, Minus } from 'lucide-react';
import { amenities } from '@/data/amenities';
import { rooms } from '@/data/rooms';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/** Comodidades citadas em ao menos uma acomodação, na ordem de data/amenities. */
const compared = amenities.filter((a) => rooms.some((r) => r.amenityIds.includes(a.id)));

const notInformed = <span className="text-stone">Sob consulta</span>;

/** Tabela comparando as acomodações lado a lado (rola na horizontal no celular). */
export function RoomComparison() {
  const { openBooking } = useBooking();

  const rows: { label: string; render: (r: (typeof rooms)[number]) => React.ReactNode }[] = [
    { label: 'Capacidade', render: (r) => `Até ${r.capacity} hóspedes` },
    { label: 'Camas', render: (r) => r.beds ?? notInformed },
    ...(rooms.some((r) => r.areaM2) ? [{ label: 'Área', render: (r: (typeof rooms)[number]) => (r.areaM2 ? `${r.areaM2} m²` : notInformed) }] : []),
    {
      label: 'A partir de*',
      render: (r) =>
        r.priceFrom ? (
          <span>
            <span className="font-serif text-2xl text-ink">{formatPrice(r.priceFrom)}</span>
            <span className="text-xs text-stone"> /noite</span>
          </span>
        ) : (
          notInformed
        ),
    },
  ];

  return (
    <section aria-labelledby="comparar-title" className="mt-20">
      <p className="eyebrow">Comparar</p>
      <h2 id="comparar-title" className="mt-4 text-4xl text-ink sm:text-5xl">
        Qual quarto combina com a sua viagem?
      </h2>
      <p className="mt-3 text-sm text-stone sm:hidden">Arraste a tabela para o lado para comparar todos.</p>

      <div className="relative -mx-5 mt-10 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] sm:min-w-[40rem] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-ink/10 bg-white text-left text-sm">
          <caption className="sr-only">Comparação entre as acomodações do Hotel Premier Janaúba</caption>
          <thead>
            <tr>
              <td className="sticky left-0 z-10 w-32 bg-white p-4 sm:w-44 sm:p-5" />
              {rooms.map((r) => (
                <th key={r.slug} scope="col" className="border-l border-ink/10 bg-cream/60 p-4 align-bottom sm:p-5">
                  <span className="block font-serif text-xl font-medium text-ink sm:text-2xl">{r.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="sticky left-0 z-10 border-t border-ink/10 bg-white p-4 text-[0.68rem] font-semibold tracking-[0.12em] text-muted uppercase sm:p-5 sm:text-xs sm:tracking-[0.14em]">
                  {row.label}
                </th>
                {rooms.map((r) => (
                  <td key={r.slug} className="border-t border-l border-ink/10 p-5 text-ink">
                    {row.render(r)}
                  </td>
                ))}
              </tr>
            ))}
            {compared.map((a) => (
              <tr key={a.id}>
                <th scope="row" className="sticky left-0 z-10 border-t border-ink/10 bg-white p-4 text-[0.82rem] font-normal text-graphite sm:p-5 sm:text-sm">
                  <span className="flex items-center gap-2">
                    <Icon name={a.icon} className="hidden h-4 w-4 shrink-0 text-gold-dark sm:block" />
                    {a.title}
                  </span>
                </th>
                {rooms.map((r) =>
                  r.amenityIds.includes(a.id) ? (
                    <td key={r.slug} className="border-t border-l border-ink/10 p-5">
                      <Check className="h-5 w-5 text-success" aria-hidden="true" />
                      <span className="sr-only">Sim</span>
                    </td>
                  ) : (
                    <td key={r.slug} className="border-t border-l border-ink/10 p-5">
                      <Minus className="h-5 w-5 text-stone-light" aria-hidden="true" />
                      <span className="sr-only">Não</span>
                    </td>
                  ),
                )}
              </tr>
            ))}
            <tr>
              <td className="sticky left-0 z-10 border-t border-ink/10 bg-white p-4 sm:p-5" />
              {rooms.map((r) => (
                <td key={r.slug} className="border-t border-l border-ink/10 p-5">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => openBooking(r.slug)}
                      aria-label={`Reservar ${r.name}`}
                      className="rounded-full bg-gold px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.06em] text-ink uppercase transition hover:bg-gold-light"
                    >
                      Reservar
                    </button>
                    <ButtonLink to={`/acomodacoes/${r.slug}`} variant="outline" size="sm" aria-label={`Ver detalhes do ${r.name}`}>
                      Ver detalhes
                    </ButtonLink>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
