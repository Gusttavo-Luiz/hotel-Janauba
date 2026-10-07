import { Link } from 'react-router';
import { Clock, Instagram, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { amenities } from '@/data/amenities';
import { navigation } from '@/data/content';
import { fullAddress, hotel } from '@/data/hotel';
import { rooms } from '@/data/rooms';
import { sectionHref } from '@/lib/utils';
import { whatsappUrl } from '@/services/whatsapp';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { Logo } from './Logo';

const linkClass = 'text-sm text-white/65 transition-colors hover:text-gold-light';

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-[0.68rem] font-semibold tracking-[0.24em] text-gold-light uppercase">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  const wa = whatsappUrl();
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative bg-ink text-white">
      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link to="/" aria-label={`${hotel.name} — página inicial`}>
            <Logo tone="light" />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Hospedagem no Centro de Janaúba (MG), com recepção 24 horas, Wi-Fi gratuito, estacionamento incluso e
            quartos para 2 a 4 hóspedes.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={hotel.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${hotel.social.instagram.handle}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-light hover:text-gold-light"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-light hover:text-gold-light"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Navegação">
            {navigation.map((item) => (
              <li key={item.section}>
                <Link to={sectionHref(item.section)} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/#perguntas-frequentes" className={linkClass}>
                Perguntas frequentes
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn title="Acomodações">
            {rooms.map((room) => (
              <li key={room.slug}>
                <Link to={`/acomodacoes/${room.slug}`} className={linkClass}>
                  {room.name}
                </Link>
              </li>
            ))}
          </FooterColumn>
          <div className="mt-10">
            <FooterColumn title="Serviços">
              {amenities.map((a) => (
                <li key={a.id} className="text-sm text-white/65">
                  {a.shortTitle ?? a.title}
                </li>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <FooterColumn title="Contato">
            <li>
              <a
                href={hotel.links.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 text-sm leading-relaxed text-white/65 transition-colors hover:text-gold-light"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" aria-hidden="true" />
                <address className="not-italic">{fullAddress}</address>
              </a>
            </li>
            <li>
              <a href={`tel:${hotel.contact.phoneE164}`} className={`${linkClass} flex items-center gap-3`}>
                <Phone className="h-4 w-4 text-gold-light" aria-hidden="true" />
                {hotel.contact.phoneDisplay}
              </a>
            </li>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-3`}>
                  <WhatsAppIcon className="h-4 w-4 text-gold-light" />
                  WhatsApp {hotel.contact.phoneDisplay}
                </a>
              </li>
            )}
            {hotel.contact.email && (
              <li>
                <a href={`mailto:${hotel.contact.email}`} className={`${linkClass} flex items-center gap-3`}>
                  <Mail className="h-4 w-4 text-gold-light" aria-hidden="true" />
                  {hotel.contact.email}
                </a>
              </li>
            )}
            <li className="flex items-center gap-3 text-sm text-white/65">
              <Clock className="h-4 w-4 text-gold-light" aria-hidden="true" />
              {hotel.contact.serviceHours}
            </li>
          </FooterColumn>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
            <span>Encontre-nos também:</span>
            <a href={hotel.links.booking} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gold-light">
              Booking.com <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a href={hotel.links.tripadvisor} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gold-light">
              Tripadvisor <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span suppressHydrationWarning>{year}</span> {hotel.name}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link to="/politica-de-privacidade" className="hover:text-gold-light">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link to="/termos-de-uso" className="hover:text-gold-light">
                Termos de uso
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
