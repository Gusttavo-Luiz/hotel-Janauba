import { ShieldCheck } from 'lucide-react';
import { BOOKING_SECTION_ID } from '@/context/BookingContext';
import { hotel } from '@/data/hotel';
import { BookingForm } from '@/components/booking/BookingForm';

export function BookingSection() {
  return (
    <section id={BOOKING_SECTION_ID} aria-labelledby="reservar-title" className="relative z-10 -mt-24 scroll-mt-28 pb-6">
      <div className="container-x">
        <div className="rounded-2xl border border-white/60 bg-white p-5 shadow-lift sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Reservas</p>
              <h2 id="reservar-title" className="mt-2 text-3xl text-ink sm:text-[2.1rem]">
                Planeje sua estadia
              </h2>
            </div>
            <p className="flex items-center gap-2 text-xs text-muted sm:text-right">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden="true" />
              Check-in a partir das {hotel.policies.checkIn.replace(':00', 'h')} · Tarifas com cancelamento gratuito disponíveis
            </p>
          </div>
          <BookingForm variant="bar" />
        </div>
      </div>
    </section>
  );
}
