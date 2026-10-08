import type { ReactNode } from 'react';
import { ArrowUpRight, BedDouble, ConciergeBell, MapPin, Waves } from 'lucide-react';
import { images, nearby } from '@/data/content';
import { hotel } from '@/data/hotel';
import { rooms } from '@/data/rooms';
import { cn } from '@/lib/utils';
import type { SiteImage } from '@/types';
import { ArtPanel } from '@/components/ui/ArtPanel';
import { Media } from '@/components/ui/Media';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Chapter {
  kicker: string;
  title: string;
  text: string;
  image: SiteImage;
  /** Destaque exibido enquanto a foto não é enviada. */
  art: { icon: ReactNode; figure: string; caption: string; note?: string };
  quote?: { text: string; author: string };
  list?: { label: string; value: string; url?: string }[];
}

const byName = (name: string) => nearby.find((n) => n.name === name);
const diocese = byName('Diocese de Janaúba');
const praia = byName('Praia do Copo Sujo');
const capacities = rooms.map((r) => r.capacity);
const artIcon = { className: 'h-6 w-6', strokeWidth: 1.5, 'aria-hidden': true } as const;

const chapters: Chapter[] = [
  {
    kicker: 'Descanso',
    title: 'Conforto para recarregar as energias',
    text: 'Quartos para duas, três ou quatro pessoas, ar-condicionado e Wi-Fi gratuito: o necessário para descansar bem depois de um dia de compromissos ou passeios pela região.',
    image: images.comfort,
    art: {
      icon: <BedDouble {...artIcon} />,
      figure: `${Math.min(...capacities)} a ${Math.max(...capacities)}`,
      caption: 'hóspedes por quarto',
      note: rooms.map((r) => r.name.replace('Quarto ', '')).join(' · '),
    },
    quote: { text: 'Os quartos são novos, espaçosos e confortáveis.', author: 'Hóspede no Tripadvisor' },
  },
  {
    kicker: 'Atendimento',
    title: 'Hospitalidade a qualquer hora',
    text: 'Nossa recepção funciona 24 horas e o serviço de quarto deixa a estadia ainda mais prática. Chegou tarde? Precisa de uma orientação? Estamos por aqui.',
    image: images.service,
    art: { icon: <ConciergeBell {...artIcon} />, figure: '24h', caption: 'recepção', note: 'e serviço de quarto' },
    quote: { text: 'O atendimento é impecável.', author: 'Hóspede no Tripadvisor' },
  },
  {
    kicker: 'Localização',
    title: 'No Centro, perto do que importa',
    text: `Na ${hotel.address.street.replace(', 175', '')}, no Centro de Janaúba, você fica a ${diocese?.minutes ?? 3} minutos da Diocese de Janaúba e tem opções de alimentação logo na esquina do prédio, como lembram nossos hóspedes.`,
    image: images.location,
    art: {
      icon: <MapPin {...artIcon} />,
      figure: `${diocese?.minutes ?? 3} min`,
      caption: 'da Diocese de Janaúba',
      note: `${hotel.address.street.split(', ')[0]} · ${hotel.address.neighborhood}`,
    },
    quote: { text: 'Opções de alimentação próximas (na esquina do prédio).', author: 'Hóspede no Google' },
  },
  {
    kicker: 'Região',
    title: 'Rio, praia e barragem a poucos minutos',
    text: 'A região é bem avaliada para turismo, lazer, culinária e locomoção. Aproveite a estadia para conhecer as águas do Rio Gorutuba, a Barragem e o Balneário Bico da Pedra.',
    image: images.region,
    art: { icon: <Waves {...artIcon} />, figure: `${praia?.minutes ?? 7} min`, caption: 'da Praia do Copo Sujo', note: 'Rio Gorutuba' },
    list: nearby
      .filter((n) => n.name !== 'Diocese de Janaúba')
      .map((n) => ({ label: n.name, value: `${n.minutes} min`, url: n.url })),
  },
];

export function Experience() {
  return (
    <section aria-labelledby="experiencia-title" className="py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="A experiência Premier"
          id="experiencia-title"
          align="center"
          title={
            <>
              Mais do que um quarto, <em className="text-gold-dark">uma estadia</em>
            </>
          }
          description="Seja a trabalho ou a passeio, cada detalhe da hospedagem foi pensado para que você aproveite Janaúba com tranquilidade."
        />

        <div className="mt-20 space-y-24 sm:space-y-32">
          {chapters.map((c, i) => {
            const reversed = i % 2 === 1;
            return (
              <article key={c.kicker} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={cn('relative lg:col-span-7', reversed && 'lg:order-2')} data-reveal>
                  <Media
                    image={c.image}
                    art={<ArtPanel {...c.art} tone={i % 2 === 0 ? 'light' : 'dark'} size="lg" />}
                    className="aspect-[4/3] rounded-2xl sm:aspect-[16/10]"
                    tone={i % 2 === 0 ? 'light' : 'dark'}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-8 font-serif text-[7rem] leading-none text-gold/25 select-none sm:text-[9rem]',
                      reversed ? '-left-2 lg:-left-6' : '-right-2 lg:-right-6',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className={cn('lg:col-span-5', reversed && 'lg:order-1')} data-reveal>
                  <p className="eyebrow">{c.kicker}</p>
                  <h3 className="mt-4 text-4xl leading-[1.08] text-ink sm:text-[2.8rem]">{c.title}</h3>
                  <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">{c.text}</p>

                  {c.quote && (
                    <figure className="mt-8 border-l-2 border-gold pl-5">
                      <blockquote className="font-serif text-2xl leading-snug text-ink italic">“{c.quote.text}”</blockquote>
                      <figcaption className="mt-2 text-xs font-semibold tracking-[0.14em] text-stone uppercase">
                        {c.quote.author}
                      </figcaption>
                    </figure>
                  )}

                  {c.list && (
                    <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                      {c.list.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-gold-dark"
                          >
                            <span className="font-medium text-ink group-hover:text-gold-dark">{item.label}</span>
                            <span className="flex items-center gap-2 text-sm text-stone">
                              aprox. {item.value}
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
