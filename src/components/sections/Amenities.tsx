import { amenities } from '@/data/amenities';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Amenities() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="grain relative scroll-mt-20 overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Serviços & Comodidades"
          id="servicos-title"
          tone="dark"
          align="center"
          title={
            <>
              Tudo pensado para uma <em className="text-gold-light">estadia tranquila</em>
            </>
          }
          description="Do momento em que você chega até a hora de partir, conte com serviços que simplificam a sua viagem."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a, i) => (
            <li
              key={a.id}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 90}ms` } as React.CSSProperties}
              className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-10"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-light/30 text-gold-light transition-all duration-500 group-hover:border-gold-light group-hover:bg-gold-light group-hover:text-ink">
                <Icon name={a.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-7 flex flex-wrap items-baseline gap-x-3 text-[1.75rem] leading-tight text-white">
                {a.title}
                {a.note && (
                  <span className="font-sans text-[0.65rem] font-semibold tracking-[0.18em] text-gold-light uppercase">
                    {a.note}
                  </span>
                )}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">{a.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
