import { cn } from '@/lib/utils';

/**
 * Logotipo tipográfico provisório. Substitua pelo logo oficial do hotel
 * (ex.: <img src="/images/logo.svg" />) quando o arquivo for fornecido.
 */
export function Logo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const light = tone === 'light';
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid h-10 w-10 shrink-0 rotate-45 place-items-center border transition-colors duration-500',
          light ? 'border-gold-light/70' : 'border-gold-dark/60',
        )}
      >
        <span
          className={cn(
            '-rotate-45 font-serif text-xl leading-none font-semibold transition-colors duration-500',
            light ? 'text-gold-light' : 'text-gold-dark',
          )}
        >
          P
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif text-[1.45rem] font-semibold tracking-[0.2em] transition-colors duration-500',
            light ? 'text-white' : 'text-ink',
          )}
        >
          PREMIER
        </span>{' '}
        <span
          className={cn(
            'mt-1 text-[0.56rem] font-semibold tracking-[0.42em] transition-colors duration-500',
            light ? 'text-white/65' : 'text-stone',
          )}
        >
          HOTEL · JANAÚBA
        </span>
      </span>
    </span>
  );
}
