import { useBooking } from '@/context/BookingContext';
import { whatsappUrl } from '@/services/whatsapp';
import { Button, ButtonAnchor } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { HeroBackdrop } from './Hero';

export function CtaBand() {
  const { openBooking } = useBooking();
  const wa = whatsappUrl('Olá! Gostaria de consultar disponibilidade no Hotel Premier Janaúba.');

  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden py-24 text-white sm:py-28">
      <div className="absolute inset-0 -z-10">
        <HeroBackdrop />
      </div>
      <div className="container-x text-center" data-reveal>
        <p className="eyebrow eyebrow-light justify-center">Reserve sua estadia</p>
        <h2 id="cta-title" className="mx-auto mt-5 max-w-3xl text-[2.6rem] leading-[1.05] sm:text-6xl">
          Sua estadia em Janaúba <em className="text-gold-light">começa aqui</em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-white/70">
          Escolha as datas, consulte as tarifas e garanta o seu quarto no Centro da cidade.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" onClick={() => openBooking()}>
            Reservar agora
          </Button>
          {wa && (
            <ButtonAnchor href={wa} variant="outline-light" size="lg">
              <WhatsAppIcon className="h-4 w-4" />
              Falar no WhatsApp
            </ButtonAnchor>
          )}
        </div>
      </div>
    </section>
  );
}
