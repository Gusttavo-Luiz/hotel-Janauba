import { useMemo, useState } from 'react';
import { Expand, Images } from 'lucide-react';
import { gallery, galleryCategories } from '@/data/content';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Media } from '@/components/ui/Media';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from './Lightbox';

// Composição em mosaico: alguns itens ocupam mais espaço
const spans = ['col-span-2 row-span-2', '', '', '', '', 'col-span-2', 'col-span-2'];

export function Gallery() {
  const [filter, setFilter] = useState('todas');
  const [index, setIndex] = useState<number | null>(null);

  const usedCategories = galleryCategories.filter((c) => gallery.some((g) => g.category === c.id));
  const items = useMemo(
    () => (filter === 'todas' ? gallery : gallery.filter((g) => g.category === filter)),
    [filter],
  );
  const showFilters = usedCategories.length > 1 && gallery.length >= 6;

  if (!gallery.length) return null;

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="scroll-mt-20 bg-cream/60 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Galeria"
            id="galeria-title"
            title={
              <>
                Conheça cada <em className="text-gold-dark">detalhe</em>
              </>
            }
            description="Fachada, quartos e espaços do Hotel Premier. Toque em uma foto para ampliar."
          />
          <div data-reveal>
            <Button variant="outline" onClick={() => setIndex(0)}>
              <Images className="h-4 w-4" aria-hidden="true" />
              Ver todas as fotos
            </Button>
          </div>
        </div>

        {showFilters && (
          <div role="group" aria-label="Filtrar fotos por categoria" className="no-scrollbar mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" data-reveal>
            {[{ id: 'todas', label: 'Todas' }, ...usedCategories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'shrink-0 rounded-full border px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300',
                  filter === c.id
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-graphite hover:border-ink/40 hover:text-ink',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <ul className="mt-8 grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[230px] lg:grid-cols-4">
          {items.map((g, i) => (
            <li key={g.id} className={cn(filter === 'todas' ? spans[i % spans.length] : i === 0 ? 'col-span-2 row-span-2' : '')}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ampliar foto: ${g.image.alt}`}
                className="group relative block h-full w-full overflow-hidden rounded-xl"
              >
                <Media
                  image={g.image}
                  tone={i % 3 === 1 ? 'dark' : 'light'}
                  className="h-full w-full transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.05]"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" aria-hidden="true" />
                <span
                  className="absolute right-3 bottom-3 grid h-9 w-9 scale-90 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  <Expand className="h-4 w-4" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox items={items.map((g) => g.image)} index={index} onChange={setIndex} />
    </section>
  );
}
