import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, cn, nightsBetween, toISODate } from '@/lib/utils';
import { Field, fieldAria } from '@/components/ui/Field';

const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const WEEKDAYS_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
const addMonths = (iso: string, n: number) => {
  const d = parse(iso);
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return toISODate(new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay)));
};
const monthDiff = (a: string, b: string) => {
  const [ay, am] = a.split('-').map(Number);
  const [by, bm] = b.split('-').map(Number);
  return (by - ay) * 12 + (bm - am);
};
/** "Qua, 22 out" */
const shortLabel = (iso: string) => {
  const d = parse(iso);
  return `${WEEKDAYS_ABBR[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
};
/** "quarta-feira, 22 de outubro de 2026" */
const longLabel = (iso: string) => {
  const d = parse(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
};

/** Dias do mês em semanas (domingo a sábado), com `null` nas posições vazias. */
function monthWeeks(firstOfMonth: string) {
  const first = parse(firstOfMonth);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(addDays(firstOfMonth, day - 1));
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

type Picking = 'checkIn' | 'checkOut';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  /** Hoje (YYYY-MM-DD); vazio até o componente montar no navegador. */
  min: string;
  ids: { checkIn: string; checkOut: string };
  errors: { checkIn?: string; checkOut?: string };
  /** Exibe dois meses lado a lado em telas médias ou maiores. */
  twoMonths?: boolean;
  checkInRef?: Ref<HTMLButtonElement>;
}

/**
 * Seleção de check-in e check-out num calendário único, no visual do site.
 * Acessível por teclado (setas, Page Up/Down, Home/End, Enter, Esc) e com rótulos em português.
 */
export function DateRangePicker({ checkIn, checkOut, onChange, min, ids, errors, twoMonths, checkInRef }: DateRangePickerProps) {
  const [picking, setPicking] = useState<Picking | null>(null);
  const [months, setMonths] = useState(1);
  const [view, setView] = useState('');
  const [focusDate, setFocusDate] = useState('');
  const [hover, setHover] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<Picking, HTMLButtonElement | null>>({ checkIn: null, checkOut: null });
  const open = picking !== null;
  const today = min || toISODate(new Date());

  const close = useCallback(
    (returnFocus?: Picking) => {
      // Só o check-in escolhido: sugere a noite seguinte como check-out.
      if (checkIn && !checkOut) onChange(checkIn, addDays(checkIn, 1));
      setPicking(null);
      setHover('');
      if (returnFocus) triggerRefs.current[returnFocus]?.focus();
    },
    [checkIn, checkOut, onChange],
  );

  const openAt = (which: Picking) => {
    const shown = twoMonths && window.matchMedia('(min-width: 768px)').matches ? 2 : 1;
    const start = (which === 'checkOut' && checkOut) || checkIn || today;
    setMonths(shown);
    setView(monthStart(start));
    setFocusDate(start < today ? today : start);
    setPicking(which);
  };

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  // Enquanto aberto: esconde as ações flutuantes e garante o calendário inteiro na tela
  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.overlay = 'calendar';
    dialogRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return () => {
      delete document.documentElement.dataset.overlay;
    };
  }, [open]);

  // Move o foco do teclado para o dia ativo
  useEffect(() => {
    if (!open || !focusDate) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus({ preventScroll: true });
  }, [open, focusDate, view]);

  const moveFocus = (next: string) => {
    setFocusDate(next);
    const diff = monthDiff(view, next);
    if (diff < 0) setView(monthStart(next));
    else if (diff > months - 1) setView(addMonths(monthStart(next), -(months - 1)));
  };

  const select = (date: string) => {
    if (date < today) return;
    if (picking === 'checkIn' || !checkIn || date <= checkIn) {
      onChange(date, checkOut && checkOut > date ? checkOut : '');
      setPicking('checkOut');
      setFocusDate(date);
      return;
    }
    onChange(checkIn, date);
    setPicking(null);
    setHover('');
    triggerRefs.current.checkOut?.focus();
  };

  const onGridKeyDown = (e: KeyboardEvent) => {
    if (!focusDate) return;
    const d = parse(focusDate);
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focusDate, -1),
      ArrowRight: () => addDays(focusDate, 1),
      ArrowUp: () => addDays(focusDate, -7),
      ArrowDown: () => addDays(focusDate, 7),
      Home: () => addDays(focusDate, -d.getDay()),
      End: () => addDays(focusDate, 6 - d.getDay()),
      PageUp: () => addMonths(focusDate, -1),
      PageDown: () => addMonths(focusDate, 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      moveFocus(moves[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(focusDate);
    }
  };

  const onPopoverKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close(picking ?? 'checkIn');
    }
  };

  // Intervalo destacado: o escolhido, ou a prévia enquanto o mouse passa sobre os dias
  const rangeEnd = checkOut || (picking === 'checkOut' && hover > checkIn ? hover : '');
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const trigger = (which: Picking, label: string, value: string) => (
    <Field id={ids[which]} label={label} error={errors[which]}>
      <button
        ref={(el) => {
          triggerRefs.current[which] = el;
          if (which === 'checkIn' && checkInRef) {
            if (typeof checkInRef === 'function') checkInRef(el);
            else (checkInRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          }
        }}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={picking === which}
        onClick={() => (picking === which ? close() : openAt(which))}
        className={cn(
          'field-input flex items-center justify-between gap-2 text-left',
          picking === which && 'border-gold-dark ring-2 ring-gold/25',
        )}
        {...fieldAria(ids[which], errors[which])}
      >
        <span className={cn('truncate', !value && 'text-stone')}>{value ? shortLabel(value) : 'Selecione'}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-stone" aria-hidden="true" />
      </button>
    </Field>
  );

  return (
    <div ref={wrapperRef} className="relative col-span-2 grid grid-cols-2 gap-4" onKeyDown={onPopoverKeyDown}>
      {trigger('checkIn', 'Check-in', checkIn)}
      {trigger('checkOut', 'Check-out', checkOut)}

      {open && view && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label={picking === 'checkIn' ? 'Escolha a data de check-in' : 'Escolha a data de check-out'}
          className={cn(
            'absolute top-full left-0 z-40 mt-2 w-full animate-scale-in rounded-2xl border border-ink/10 bg-white p-4 shadow-lift sm:p-5',
            months === 2 && 'md:w-[min(42rem,calc(100vw-2.5rem))]',
          )}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView(addMonths(view, -1))}
              disabled={monthDiff(monthStart(today), view) <= 0}
              aria-label="Mês anterior"
              className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-cream disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold-dark uppercase" aria-live="polite">
              {picking === 'checkIn' ? 'Check-in' : 'Check-out'}
            </p>
            <button
              type="button"
              onClick={() => setView(addMonths(view, 1))}
              aria-label="Próximo mês"
              className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-cream"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={gridRef} className={cn('mt-2 grid gap-6', months === 2 && 'md:grid-cols-2')} onKeyDown={onGridKeyDown}>
            {Array.from({ length: months }, (_, i) => {
              const first = addMonths(view, i);
              const d = parse(first);
              const title = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
              return (
                <table key={first} role="grid" aria-label={title} className="w-full border-collapse">
                  <caption className="mb-3 text-center font-serif text-xl text-ink capitalize">{title}</caption>
                  <thead>
                    <tr>
                      {WEEKDAYS_SHORT.map((w, idx) => (
                        <th key={idx} scope="col" abbr={WEEKDAYS[idx]} className="pb-2 text-center text-[0.65rem] font-semibold text-stone">
                          {w}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthWeeks(first).map((week, w) => (
                      <tr key={w}>
                        {week.map((date, idx) => {
                          if (!date) return <td key={idx} />;
                          const past = date < today;
                          const isStart = date === checkIn;
                          const isEnd = date === rangeEnd;
                          const inRange = !!checkIn && !!rangeEnd && date > checkIn && date < rangeEnd;
                          return (
                            <td
                              key={date}
                              role="gridcell"
                              aria-selected={isStart || isEnd}
                              className={cn(
                                'p-0 text-center',
                                inRange && 'bg-gold/15',
                                isStart && rangeEnd && 'rounded-l-full bg-gold/15',
                                isEnd && checkIn && 'rounded-r-full bg-gold/15',
                              )}
                            >
                              <button
                                type="button"
                                data-date={date}
                                tabIndex={date === focusDate ? 0 : -1}
                                aria-label={`${longLabel(date)}${isStart ? ', check-in' : ''}${isEnd ? ', check-out' : ''}`}
                                aria-disabled={past || undefined}
                                onClick={() => select(date)}
                                onMouseEnter={() => setHover(date)}
                                className={cn(
                                  'relative mx-auto grid h-10 w-10 place-items-center rounded-full text-sm transition-colors',
                                  past
                                    ? 'cursor-not-allowed text-stone-light line-through decoration-stone-light/60'
                                    : 'text-ink hover:bg-cream',
                                  (isStart || isEnd) && 'bg-ink font-semibold text-ivory hover:bg-ink',
                                  date === today && !isStart && !isEnd && 'font-semibold text-gold-dark',
                                )}
                              >
                                {parse(date).getDate()}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <p className="text-sm text-muted" aria-live="polite">
              {nights > 0
                ? `${shortLabel(checkIn)} → ${shortLabel(checkOut)} · ${nights} ${nights === 1 ? 'noite' : 'noites'}`
                : picking === 'checkOut' && checkIn
                  ? 'Agora escolha a data de check-out'
                  : 'Escolha a data de check-in'}
            </p>
            <div className="flex gap-2">
              {(checkIn || checkOut) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('', '');
                    setPicking('checkIn');
                    setFocusDate(today);
                  }}
                  className="rounded-full px-4 py-2 text-xs font-semibold tracking-[0.08em] text-muted uppercase transition hover:bg-cream hover:text-ink"
                >
                  Limpar
                </button>
              )}
              <button
                type="button"
                onClick={() => close(picking ?? 'checkIn')}
                className="rounded-full bg-ink px-5 py-2 text-xs font-semibold tracking-[0.08em] text-ivory uppercase transition hover:bg-graphite"
              >
                {nights > 0 ? 'Confirmar' : 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
