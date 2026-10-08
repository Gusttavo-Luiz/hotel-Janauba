import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CalendarCheck, ExternalLink, RotateCcw } from 'lucide-react';
import { getRoom, rooms } from '@/data/rooms';
import { useBooking } from '@/context/BookingContext';
import { addDays, cn, toISODate } from '@/lib/utils';
import {
  bookingConfig,
  bookingSummary,
  buildBookingOptions,
  validateBooking,
  type BookingErrors,
  type BookingRequest,
} from '@/services/booking';
import { Button, ButtonAnchor } from '@/components/ui/Button';
import { Field, fieldAria } from '@/components/ui/Field';
import { WhatsAppIcon } from '@/components/ui/Icon';

interface BookingFormProps {
  /** `bar`: barra horizontal da home. `card`: cartão lateral da página do quarto. */
  variant?: 'bar' | 'card';
  /** Quarto fixo (página de detalhes). */
  fixedRoom?: string;
}

type Result = ReturnType<typeof buildBookingOptions> & { summary: ReturnType<typeof bookingSummary> };

export function BookingForm({ variant = 'bar', fixedRoom }: BookingFormProps) {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const booking = useBooking();
  const isBar = variant === 'bar';

  const [today, setToday] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [localRoom, setLocalRoom] = useState(fixedRoom ?? '');
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Na barra da home, a acomodação é compartilhada com os cards ("Reservar").
  const roomSlug = fixedRoom ?? (isBar ? booking.roomSlug : localRoom);
  const setRoomSlug = isBar && !fixedRoom ? booking.setRoomSlug : setLocalRoom;

  useEffect(() => setToday(toISODate(new Date())), []);

  useEffect(() => {
    const room = getRoom(roomSlug);
    if (room) setGuests(room.capacity);
  }, [roomSlug]);

  useEffect(() => {
    if (isBar && booking.focusSignal > 0) {
      const t = window.setTimeout(() => checkInRef.current?.focus({ preventScroll: true }), 450);
      return () => window.clearTimeout(t);
    }
  }, [isBar, booking.focusSignal]);

  const request: BookingRequest = {
    checkIn,
    checkOut,
    guests,
    rooms: roomsCount,
    roomSlug: roomSlug || undefined,
    promoCode: promoCode.trim() || undefined,
  };

  // Revalida em tempo real depois da primeira tentativa de envio.
  useEffect(() => {
    if (submitted && today) setErrors(validateBooking(request, today));
    setResult(null);
  }, [checkIn, checkOut, guests, roomsCount, roomSlug, promoCode]);

  const onCheckInChange = (value: string) => {
    setCheckIn(value);
    if (value && (!checkOut || checkOut <= value)) setCheckOut(addDays(value, 1));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const current = today || toISODate(new Date());
    const found = validateBooking(request, current);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(fid(firstError))?.focus();
      return;
    }
    setResult({ ...buildBookingOptions(request), summary: bookingSummary(request) });
    window.setTimeout(() => resultRef.current?.focus(), 30);
  };

  const reset = () => {
    setResult(null);
    checkInRef.current?.focus();
  };

  const guestOptions = Array.from({ length: bookingConfig.maxGuests }, (_, i) => i + 1);
  const roomOptions = Array.from({ length: bookingConfig.maxRooms }, (_, i) => i + 1);

  return (
    <div>
      <form
        noValidate
        onSubmit={onSubmit}
        aria-label="Consultar disponibilidade"
        className={cn(
          'grid gap-4',
          isBar
            ? cn(
                'grid-cols-2 md:grid-cols-4 lg:items-start',
                bookingConfig.promoCodeEnabled
                  ? 'lg:grid-cols-[1fr_1fr_0.75fr_0.75fr_1.1fr_1fr_auto]'
                  : 'lg:grid-cols-[1fr_1fr_0.75fr_0.75fr_1.25fr_auto]',
              )
            : 'grid-cols-2',
        )}
      >
        <Field id={fid('checkIn')} label="Check-in" error={errors.checkIn}>
          <input
            ref={checkInRef}
            type="date"
            className="field-input"
            value={checkIn}
            min={today || undefined}
            onChange={(e) => onCheckInChange(e.target.value)}
            required
            {...fieldAria(fid('checkIn'), errors.checkIn)}
          />
        </Field>
        <Field id={fid('checkOut')} label="Check-out" error={errors.checkOut}>
          <input
            type="date"
            className="field-input"
            value={checkOut}
            min={checkIn ? addDays(checkIn, 1) : today || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            {...fieldAria(fid('checkOut'), errors.checkOut)}
          />
        </Field>
        <Field id={fid('guests')} label="Hóspedes" error={errors.guests}>
          <select
            className="field-input"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            {...fieldAria(fid('guests'), errors.guests)}
          >
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'hóspede' : 'hóspedes'}
              </option>
            ))}
          </select>
        </Field>
        <Field id={fid('rooms')} label="Quartos" error={errors.rooms}>
          <select
            className="field-input"
            value={roomsCount}
            onChange={(e) => setRoomsCount(Number(e.target.value))}
            {...fieldAria(fid('rooms'), errors.rooms)}
          >
            {roomOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'quarto' : 'quartos'}
              </option>
            ))}
          </select>
        </Field>

        {!fixedRoom && (
          <Field id={fid('roomSlug')} label="Acomodação" className="col-span-2 md:col-span-2 lg:col-span-1">
            <select
              className="field-input"
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value)}
              {...fieldAria(fid('roomSlug'))}
            >
              <option value="">Todas as acomodações</option>
              {rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name} (até {r.capacity})
                </option>
              ))}
            </select>
          </Field>
        )}

        {bookingConfig.promoCodeEnabled && (
          <Field id={fid('promoCode')} label="Código promocional" optional className="col-span-2 md:col-span-2 lg:col-span-1">
            <input
              type="text"
              className="field-input uppercase"
              value={promoCode}
              maxLength={20}
              autoComplete="off"
              onChange={(e) => setPromoCode(e.target.value)}
              {...fieldAria(fid('promoCode'))}
            />
          </Field>
        )}

        <div className={cn('col-span-2', isBar ? 'md:col-span-2 lg:col-span-1 lg:pt-[1.45rem]' : 'pt-1')}>
          <Button type="submit" size="lg" className="w-full lg:px-7">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Ver disponibilidade
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {result && (
          <div
            ref={resultRef}
            tabIndex={-1}
            className={cn(
              'mt-6 animate-scale-in rounded-xl border border-gold/30 bg-cream/70 p-5 outline-none sm:p-6',
              isBar && 'lg:flex lg:items-center lg:justify-between lg:gap-8',
            )}
          >
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold-dark uppercase">Sua estadia</p>
              <p className="mt-1.5 font-serif text-2xl leading-tight text-ink">{result.summary.period}</p>
              <p className="mt-1 text-sm text-muted">{result.summary.details}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark underline-offset-4 hover:underline"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" /> Alterar datas
              </button>
            </div>
            <div className={cn('mt-5 flex flex-col gap-3', isBar && 'sm:flex-row lg:mt-0 lg:shrink-0')}>
              <ButtonAnchor href={result.providerUrl} variant="dark" size="md">
                Ver tarifas no {bookingConfig.providerLabel}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </ButtonAnchor>
              {result.whatsappUrl && (
                <ButtonAnchor href={result.whatsappUrl} variant="whatsapp" size="md">
                  <WhatsAppIcon className="h-4 w-4" />
                  Reservar pelo WhatsApp
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
                </ButtonAnchor>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
