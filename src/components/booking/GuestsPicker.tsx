import { useCallback, useId, useRef, useState } from 'react';
import { ChevronDown, Minus, Plus, Users } from 'lucide-react';
import { getRoom, maxRoomCapacity } from '@/data/rooms';
import { useClickOutside, useEscape, useOverlayPanel } from '@/hooks';
import { cn } from '@/lib/utils';
import { Field, fieldAria } from '@/components/ui/Field';

interface GuestsPickerProps {
  guests: number;
  rooms: number;
  onChange: (guests: number, rooms: number) => void;
  maxGuests: number;
  maxRooms: number;
  /** Acomodação escolhida (define a capacidade por quarto). */
  roomSlug?: string;
  id: string;
  error?: string;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  unit: [string, string];
}) {
  const labelId = useId();
  const decRef = useRef<HTMLButtonElement>(null);
  const incRef = useRef<HTMLButtonElement>(null);
  // Ao chegar no limite o botão fica desativado: o foco passa para o botão oposto.
  const step = (delta: number) => {
    const next = value + delta;
    onChange(next);
    if (delta < 0 && next <= min) incRef.current?.focus();
    if (delta > 0 && next >= max) decRef.current?.focus();
  };
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p id={labelId} className="font-medium text-ink">
          {label}
        </p>
        {hint && <p className="text-xs text-stone">{hint}</p>}
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={labelId}>
        <button
          ref={decRef}
          type="button"
          onClick={() => step(-1)}
          disabled={value <= min}
          aria-label={`Diminuir ${unit[1]}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-lg font-semibold text-ink tabular-nums">
          <span className="sr-only">{plural(value, unit[0], unit[1])}</span>
          <span aria-hidden="true">{value}</span>
        </output>
        <button
          ref={incRef}
          type="button"
          onClick={() => step(1)}
          disabled={value >= max}
          aria-label={`Aumentar ${unit[1]}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Hóspedes e quartos num único campo, com botões − e + e aviso de capacidade. */
export function GuestsPicker({ guests, rooms, onChange, maxGuests, maxRooms, roomSlug, id, error }: GuestsPickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const room = getRoom(roomSlug);
  const perRoom = room?.capacity ?? maxRoomCapacity;
  const neededRooms = Math.ceil(guests / perRoom);
  const overCapacity = rooms < neededRooms;

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);
  const dismiss = useCallback(() => close(), [close]);

  useClickOutside(open, wrapperRef, dismiss);
  useOverlayPanel(open, panelRef);
  useEscape(open, () => close(true));

  const setGuests = (n: number) => onChange(n, Math.min(rooms, n));
  const setRooms = (n: number) => onChange(guests, n);

  return (
    <div ref={wrapperRef} className="relative col-span-2">
      <Field id={id} label="Hóspedes e quartos" error={error}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className={cn(
            'field-input flex items-center justify-between gap-2 text-left',
            open && 'border-gold-dark ring-2 ring-gold/25',
          )}
          {...fieldAria(id, error)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-stone" aria-hidden="true" />
            <span className="truncate">
              {plural(guests, 'hóspede', 'hóspedes')} · {plural(rooms, 'quarto', 'quartos')}
            </span>
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-stone transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </Field>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Hóspedes e quartos"
          className="absolute top-full right-0 left-0 z-40 mt-2 min-w-[17rem] animate-scale-in rounded-2xl border border-ink/10 bg-white p-4 shadow-lift sm:p-5"
        >
          <div className="divide-y divide-ink/10">
            <Stepper
              label="Hóspedes"
              hint={room ? `O ${room.name} recebe até ${perRoom}` : `Até ${perRoom} por quarto`}
              value={guests}
              min={1}
              max={maxGuests}
              onChange={setGuests}
              unit={['hóspede', 'hóspedes']}
            />
            <Stepper
              label="Quartos"
              value={rooms}
              min={1}
              max={Math.min(maxRooms, guests)}
              onChange={setRooms}
              unit={['quarto', 'quartos']}
            />
          </div>

          <div aria-live="polite">
            {overCapacity && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gold/15 px-3 py-2.5 text-sm text-ink">
                <span>Para {plural(guests, 'hóspede', 'hóspedes')}, escolha ao menos {plural(neededRooms, 'quarto', 'quartos')}.</span>
                {neededRooms <= maxRooms && (
                  <button
                    type="button"
                    onClick={() => {
                      setRooms(neededRooms);
                      confirmRef.current?.focus();
                    }}
                    className="text-xs font-semibold text-gold-dark underline-offset-4 hover:underline"
                  >
                    Ajustar
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end border-t border-ink/10 pt-4">
            <button
              ref={confirmRef}
              type="button"
              onClick={() => close(true)}
              className="rounded-full bg-ink px-5 py-2 text-xs font-semibold tracking-[0.08em] text-ivory uppercase transition hover:bg-graphite"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
