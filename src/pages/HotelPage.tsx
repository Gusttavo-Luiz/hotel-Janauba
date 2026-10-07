import { CalendarClock, Clock, PawPrint, ShieldCheck, ConciergeBell } from 'lucide-react';
import { amenities } from '@/data/amenities';
import { images } from '@/data/content';
import { hotel } from '@/data/hotel';
import { Icon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBand } from '@/components/sections/CtaBand';
import { Faq } from '@/components/sections/Faq';
import { PageHero } from '@/components/sections/PageHero';
import { Reviews } from '@/components/sections/Reviews';

const hour = (t: string) => t.replace(':00', 'h');

export default function HotelPage() {
  const policies = [
    { icon: <CalendarClock className="h-5 w-5" aria-hidden="true" />, title: 'Check-in', text: `A partir das ${hour(hotel.policies.checkIn)}` },
    hotel.policies.checkOut
      ? { icon: <Clock className="h-5 w-5" aria-hidden="true" />, title: 'Check-out', text: `Até as ${hour(hotel.policies.checkOut)}` }
      : null,
    { icon: <ConciergeBell className="h-5 w-5" aria-hidden="true" />, title: 'Recepção', text: 'Funcionamento 24 horas' },
    { icon: <PawPrint className="h-5 w-5" aria-hidden="true" />, title: 'Animais de estimação', text: hotel.policies.pets },
    { icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />, title: 'Cancelamento', text: hotel.policies.cancellation },
  ].filter((p) => p !== null);

  return (
    <>
      <PageHero
        eyebrow="O Hotel"
        title={
          <>
            Hotel Premier, <em className="text-gold-light">no Centro de Janaúba</em>
          </>
        }
        description={hotel.heroDescription}
        breadcrumbs={[{ label: 'Início', to: '/' }, { label: 'O Hotel' }]}
      />

      <section aria-labelledby="apresentacao-title" className="py-24 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Apresentação"
              id="apresentacao-title"
              title={
                <>
                  Conforto e praticidade <em className="text-gold-dark">em cada estadia</em>
                </>
              }
            />
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted" data-reveal>
              {hotel.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4" data-reveal>
            <Media image={images.aboutDetail} className="aspect-[3/4] rounded-2xl" tone="dark" sizes="25vw" />
            <Media image={images.about} className="mt-12 aspect-[3/4] rounded-2xl" sizes="25vw" />
          </div>
        </div>
      </section>

      {hotel.history && (
        <section aria-labelledby="historia-title" className="bg-cream/60 py-24">
          <div className="container-x max-w-3xl">
            <SectionHeading eyebrow="Nossa história" id="historia-title" title="Nossa história" />
            <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-muted">
              {hotel.history.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="estrutura-title" className="grain relative bg-ink py-24 text-white sm:py-28">
        <div className="container-x relative">
          <SectionHeading eyebrow="Estrutura" id="estrutura-title" tone="dark" title="Serviços e comodidades" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <li key={a.id} className="flex gap-4 rounded-xl border border-white/10 p-6" data-reveal>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-light/10 text-gold-light">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <span>
                  <h3 className="font-sans text-base font-semibold text-white">
                    {a.title}
                    {a.note && <span className="ml-2 text-xs font-normal text-gold-light">({a.note})</span>}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{a.description}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="politicas-title" className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Bom saber" id="politicas-title" title="Informações para a sua estadia" />
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {policies.map((p) => (
              <div key={p.title} className="bg-white p-7">
                <span className="text-gold-dark">{p.icon}</span>
                <dt className="mt-4 text-[0.68rem] font-semibold tracking-[0.2em] text-stone uppercase">{p.title}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink">{p.text}</dd>
              </div>
            ))}
          </dl>
          {!hotel.policies.checkOut && (
            <p className="mt-5 text-sm text-stone">Horário de check-out: confirme com a recepção no momento da reserva.</p>
          )}
        </div>
      </section>

      <div className="bg-cream/60">
        <Reviews />
      </div>
      <Faq />
      <CtaBand />
    </>
  );
}
