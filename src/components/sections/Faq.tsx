import { Plus } from 'lucide-react';
import { faq } from '@/data/content';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Faq({ className, id = 'perguntas-frequentes' }: { className?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-20 py-24 sm:py-28', className)}>
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Dúvidas"
            id={`${id}-title`}
            title={
              <>
                Perguntas <em className="text-gold-dark">frequentes</em>
              </>
            }
            description="Informações práticas para planejar a sua estadia."
          />
        </div>
        <div className="lg:col-span-8" data-reveal>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {faq.map((item) => (
              <li key={item.question}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-[1.45rem] leading-snug text-ink transition-colors group-hover:text-gold-dark">
                      {item.question}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 group-open:rotate-45 group-open:border-gold group-open:bg-gold">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="-mt-1 max-w-2xl pr-12 pb-6 leading-relaxed text-muted">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
