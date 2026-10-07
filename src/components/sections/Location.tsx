import { useState } from 'react';
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { nearby } from '@/data/content';
import { fullAddress, hotel } from '@/data/hotel';
import { ButtonAnchor, Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

const mapQuery = `${hotel.name}, ${hotel.address.street}, ${hotel.address.city} - ${hotel.address.state}, ${hotel.address.postalCode}`;
const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

/** Mapa carregado sob demanda (mais rápido e sem cookies de terceiros até o clique). */
function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={`Mapa de localização do ${hotel.name}`}
        src={embedUrl}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div className="grain relative flex h-full w-full items-center justify-center overflow-hidden bg-ink">
      <svg className="absolute inset-0 h-full w-full text-white/[0.07]" aria-hidden="true">
        <defs>
          <pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <path d="M -20 280 C 140 230, 260 330, 420 250 S 700 160, 900 220" stroke="rgb(196 162 113 / 0.35)" strokeWidth="10" fill="none" />
        <path d="M 180 -20 L 260 620" stroke="rgb(255 255 255 / 0.12)" strokeWidth="6" fill="none" />
      </svg>
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-ink shadow-[0_0_0_10px_rgb(196_162_113/0.18)]">
          <MapPin className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-5 font-serif text-2xl text-white">{hotel.address.street}</p>
        <p className="text-sm text-white/60">
          {hotel.address.neighborhood} · {hotel.address.city} – {hotel.address.state}
        </p>
        <Button variant="outline-light" size="sm" className="mt-6" onClick={() => setLoaded(true)}>
          Carregar mapa interativo
        </Button>
        <p className="mt-3 max-w-xs text-[0.68rem] text-white/40">O mapa é fornecido pelo Google Maps.</p>
      </div>
    </div>
  );
}

export function Location() {
  return (
    <section id="localizacao" aria-labelledby="localizacao-title" className="scroll-mt-20 bg-cream/60 py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Localização"
            id="localizacao-title"
            title={
              <>
                No Centro de <em className="text-gold-dark">Janaúba</em>
              </>
            }
            description="Uma localização prática para quem vem a trabalho ou a passeio pelo Norte de Minas."
          />

          <address className="mt-9 flex gap-4 not-italic" data-reveal>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-gold-light">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-[0.98rem] leading-relaxed text-graphite">
              <strong className="block font-semibold text-ink">{hotel.address.street}</strong>
              {hotel.address.neighborhood} · {hotel.address.city} – {hotel.address.stateName}
              <br />
              CEP {hotel.address.postalCode}
            </span>
          </address>

          <div className="mt-10" data-reveal>
            <h3 className="font-sans text-[0.68rem] font-semibold tracking-[0.22em] text-muted uppercase">Pontos de referência</h3>
            <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {nearby.map((place) => (
                <li key={place.name}>
                  <a
                    href={place.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-3.5"
                  >
                    <span>
                      <span className="block font-medium text-ink transition-colors group-hover:text-gold-dark">{place.name}</span>
                      <span className="text-xs text-stone">{place.description}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-serif text-xl text-ink">
                      {place.minutes} min
                      <ArrowUpRight className="h-4 w-4 text-stone transition group-hover:text-gold-dark" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-stone">Tempos aproximados de deslocamento, segundo o Google.</p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-reveal>
            <ButtonAnchor href={directionsUrl} variant="dark">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Como chegar
            </ButtonAnchor>
            <ButtonAnchor href={hotel.links.googleMaps} variant="outline">
              Abrir no Google Maps
            </ButtonAnchor>
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <div className="h-[420px] overflow-hidden rounded-2xl shadow-lift sm:h-[520px] lg:sticky lg:top-28 lg:h-[600px]">
            <MapEmbed />
          </div>
          <p className="sr-only">{fullAddress}</p>
        </div>
      </div>
    </section>
  );
}
