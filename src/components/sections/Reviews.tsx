import { ArrowUpRight, Quote, Star } from 'lucide-react';
import { reviews } from '@/data/content';
import { ratings } from '@/data/hotel';
import { cn, formatScore } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';

function Stars({ value, scale = 5 }: { value: number; scale?: number }) {
  return (
    <span className="relative inline-flex" role="img" aria-label={`${formatScore(value)} de ${scale} estrelas`}>
      <span className="flex gap-0.5 text-sand" aria-hidden="true">
        {Array.from({ length: scale }, (_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
        ))}
      </span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold" style={{ width: `${(value / scale) * 100}%` }} aria-hidden="true">
        {Array.from({ length: scale }, (_, i) => (
          <Star key={i} className="h-4 w-4 shrink-0 fill-current" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

export function Reviews() {
  if (!ratings.length && !reviews.length) return null;

  return (
    <section aria-labelledby="avaliacoes-title" className="py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Avaliações"
            id="avaliacoes-title"
            title={
              <>
                O que dizem nossos <em className="text-gold-dark">hóspedes</em>
              </>
            }
            description="Avaliações públicas de quem já se hospedou no Hotel Premier."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {ratings.map((r) => (
              <li key={r.source} data-reveal>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="font-serif text-5xl leading-none text-ink">{formatScore(r.score)}</span>
                  <span className="min-w-0 flex-1">
                    <Stars value={r.score} scale={r.scale} />
                    <span className="mt-1 block text-sm font-semibold text-ink">
                      {r.source}
                      {r.label && <span className="font-normal text-muted"> · {r.label}</span>}
                    </span>
                    <span className="block text-xs text-stone">
                      {r.count} {r.count === 1 ? 'avaliação' : 'avaliações'}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-stone transition group-hover:text-gold-dark" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 lg:col-span-7 lg:pt-6">
          {reviews.map((review, i) => (
            <figure
              key={review.author}
              data-reveal
              style={{ '--reveal-delay': `${i * 120}ms` } as React.CSSProperties}
              className={cn(
                'relative rounded-2xl p-8 sm:p-10',
                i % 2 === 0 ? 'bg-ink text-white' : 'border border-ink/[0.08] bg-cream text-ink lg:ml-16',
              )}
            >
              <Quote className={cn('h-8 w-8', i % 2 === 0 ? 'text-gold-light' : 'text-gold-dark')} aria-hidden="true" strokeWidth={1.2} />
              <blockquote className="mt-5 font-serif text-[1.65rem] leading-snug italic sm:text-[1.9rem]">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold">{review.author}</span>
                  <span className={cn('text-xs', i % 2 === 0 ? 'text-white/60' : 'text-stone')}>
                    via {review.source}
                    {review.date && ` · ${review.date}`}
                  </span>
                </span>
                {review.rating && <Stars value={review.rating} />}
                {review.url && (
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline',
                      i % 2 === 0 ? 'text-gold-light' : 'text-gold-dark',
                    )}
                  >
                    Ler no {review.source} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
