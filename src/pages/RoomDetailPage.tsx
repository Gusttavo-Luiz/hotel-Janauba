import { useState } from 'react';
import { useParams } from 'react-router';
import { BedDouble, CalendarClock, Check, Expand, Link2, Maximize2, PawPrint, Phone, Share2, ShieldCheck, Users } from 'lucide-react';
import { getAmenity } from '@/data/amenities';
import { hotel } from '@/data/hotel';
import { getRoom, priceDisclaimer, rooms } from '@/data/rooms';
import { siteConfig } from '@/config/site';
import { formatPrice } from '@/lib/utils';
import { whatsappUrl } from '@/services/whatsapp';
import { BookingForm } from '@/components/booking/BookingForm';
import { ButtonAnchor } from '@/components/ui/Button';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';
import { Media } from '@/components/ui/Media';
import { Lightbox } from '@/components/sections/Lightbox';
import { PageHero } from '@/components/sections/PageHero';
import { RoomCard } from '@/components/sections/RoomCard';
import NotFoundPage from './NotFoundPage';

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* compartilhamento cancelado pelo usuário */
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted uppercase transition-colors hover:text-gold-dark"
    >
      {copied ? <Link2 className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copiado!' : 'Compartilhar'}</span>
    </button>
  );
}

export default function RoomDetailPage() {
  const { slug } = useParams();
  const room = getRoom(slug);
  const [index, setIndex] = useState<number | null>(null);
  if (!room) return <NotFoundPage />;

  const photos = room.images.filter((img) => img.src || siteConfig.showPlaceholderLabels);
  const roomAmenities = room.amenityIds.map(getAmenity).filter((a) => a !== undefined);
  const others = rooms.filter((r) => r.slug !== room.slug);
  const wa = whatsappUrl(`Olá! Gostaria de saber a disponibilidade do ${room.name} no ${hotel.name}.`);

  const facts = [
    { icon: <Users className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />, label: 'Capacidade', value: `Até ${room.capacity} hóspedes` },
    room.beds && { icon: <BedDouble className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />, label: 'Camas', value: room.beds },
    room.areaM2 && { icon: <Maximize2 className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />, label: 'Área', value: `${room.areaM2} m²` },
    { icon: <CalendarClock className="h-5 w-5" aria-hidden="true" strokeWidth={1.5} />, label: 'Check-in', value: `A partir das ${hotel.policies.checkIn.replace(':00', 'h')}` },
  ].filter((f) => !!f);

  return (
    <>
      <PageHero
        eyebrow="Acomodação"
        title={room.name}
        description={room.summary}
        breadcrumbs={[
          { label: 'Início', to: '/' },
          { label: 'Acomodações', to: '/acomodacoes' },
          { label: room.name },
        ]}
      />

      {photos.length > 0 && (
        <section className="py-14 sm:py-20" aria-label={`Fotos do ${room.name}`}>
          <div className="container-x">
            <div className="grid gap-3 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4">
              {photos.map((img, i) => (
                <button
                  key={img.placeholder}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ampliar foto: ${img.alt}`}
                  className={
                    i === 0
                      ? 'group relative overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2'
                      : 'group relative hidden overflow-hidden rounded-2xl sm:block'
                  }
                >
                  <Media
                    image={img}
                    tone={i === 1 ? 'dark' : 'light'}
                    priority={i === 0}
                    className={i === 0 ? 'aspect-[4/3] h-full transition-transform duration-700 group-hover:scale-[1.03] sm:aspect-auto sm:min-h-[460px]' : 'h-full min-h-[220px] transition-transform duration-700 group-hover:scale-[1.04]'}
                    sizes={i === 0 ? '(min-width: 640px) 66vw, 100vw' : '33vw'}
                  />
                  {i === 0 && (
                    <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-ink shadow-soft">
                      <Expand className="h-3.5 w-3.5" aria-hidden="true" /> {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={photos.length > 0 ? 'pb-24' : 'py-16 sm:py-20'} aria-labelledby="detalhes-title">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <dl className="grid grid-cols-2 gap-6 border-y border-ink/10 py-8 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.2em] text-stone uppercase">
                    <span className="mb-3 block text-gold-dark">{f.icon}</span>
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>

            <h2 id="detalhes-title" className="mt-12 text-4xl text-ink">
              Sobre a acomodação
            </h2>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-muted">
              {room.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 text-4xl text-ink">Comodidades</h2>
            <p className="mt-2 text-sm text-stone">Serviços e comodidades disponíveis no hotel durante a sua estadia.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {roomAmenities.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-ink/[0.08] bg-white px-5 py-4">
                  <Icon name={a.icon} className="h-5 w-5 text-gold-dark" />
                  <span className="text-sm font-medium text-ink">{a.title}</span>
                  {a.note && <span className="ml-auto text-xs text-stone">{a.note}</span>}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-4xl text-ink">Bom saber</h2>
            <ul className="mt-6 space-y-4 text-[0.98rem] text-muted">
              {[
                { icon: <CalendarClock className="h-5 w-5" aria-hidden="true" />, text: `Check-in a partir das ${hotel.policies.checkIn.replace(':00', 'h')}. Recepção 24 horas.` },
                { icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />, text: hotel.policies.cancellation },
                { icon: <PawPrint className="h-5 w-5" aria-hidden="true" />, text: hotel.policies.pets },
              ].map((item) => (
                <li key={item.text} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-gold-dark">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5" aria-label="Reservar esta acomodação">
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-lift sm:p-8 lg:sticky lg:top-28">
              {room.priceFrom ? (
                <p className="text-sm text-muted">
                  a partir de{' '}
                  <span className="font-serif text-4xl text-ink">{formatPrice(room.priceFrom)}</span>
                  <span className="text-stone"> /noite*</span>
                </p>
              ) : (
                <p className="font-serif text-3xl text-ink">Consulte as tarifas</p>
              )}
              <ul className="mt-4 space-y-1.5 text-sm text-graphite">
                {['Wi-Fi gratuito', 'Estacionamento incluso', 'Tarifas com cancelamento gratuito disponíveis'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
              <div className="my-6 h-px bg-ink/10" />
              <BookingForm variant="card" fixedRoom={room.slug} />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {wa && (
                  <ButtonAnchor href={wa} variant="whatsapp" size="sm" className="py-3">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </ButtonAnchor>
                )}
                <ButtonAnchor href={`tel:${hotel.contact.phoneE164}`} external={false} variant="outline" size="sm" className={wa ? 'py-3' : 'col-span-2 py-3'}>
                  <Phone className="h-4 w-4" aria-hidden="true" /> Ligar
                </ButtonAnchor>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
                <ShareButton title={`${room.name} — ${hotel.name}`} />
              </div>
              {room.priceFrom && <p className="mt-4 text-[0.7rem] leading-relaxed text-stone">* {priceDisclaimer}</p>}
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="outras-title" className="bg-cream/60 py-24">
          <div className="container-x">
            <p className="eyebrow">Acomodações</p>
            <h2 id="outras-title" className="mt-4 text-4xl text-ink sm:text-5xl">
              Outras opções
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
              {others.map((r) => (
                <li key={r.slug}>
                  <RoomCard room={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Lightbox items={photos} index={index} onChange={setIndex} />
    </>
  );
}
