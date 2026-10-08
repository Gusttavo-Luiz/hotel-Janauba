import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArchMotif } from './ArchMotif';

interface ArtPanelProps {
  /** Ícone ou marca exibida acima do destaque. */
  icon?: ReactNode;
  /** Destaque principal (número ou palavra curta), em serifa grande. */
  figure: ReactNode;
  /** Legenda curta abaixo do destaque. */
  caption?: ReactNode;
  /** Linha complementar opcional. */
  note?: ReactNode;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const figureSize = {
  sm: 'text-5xl',
  md: 'text-6xl sm:text-7xl',
  lg: 'text-6xl sm:text-7xl lg:text-8xl',
};

/**
 * Composição tipográfica usada no lugar de uma foto ainda não enviada:
 * mostra uma informação real do hotel sobre o motivo de arcos da identidade.
 */
export function ArtPanel({ icon, figure, caption, note, tone = 'light', size = 'md', className }: ArtPanelProps) {
  const dark = tone === 'dark';
  return (
    <div className={cn('absolute inset-0 flex items-center justify-center', className)}>
      <ArchMotif
        className={cn(
          'absolute -bottom-[12%] left-1/2 h-[115%] -translate-x-1/2',
          dark ? 'text-gold-light/[0.16]' : 'text-gold-dark/[0.2]',
        )}
      />
      <div
        className={cn(
          'absolute inset-0',
          dark
            ? 'bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgb(196_162_113/0.16),transparent_70%)]'
            : 'bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgb(255_255_255/0.45),transparent_70%)]',
        )}
      />
      <div className="relative flex max-w-[85%] flex-col items-center text-center">
        {icon && (
          <span
            className={cn(
              'mb-4 grid place-items-center rounded-full border',
              size === 'sm' ? 'h-11 w-11' : 'h-14 w-14',
              dark ? 'border-gold-light/40 text-gold-light' : 'border-gold-dark/35 text-gold-dark',
            )}
          >
            {icon}
          </span>
        )}
        <span className={cn('font-serif leading-none font-medium', figureSize[size], dark ? 'text-white' : 'text-ink')}>
          {figure}
        </span>
        {caption && (
          <span
            className={cn(
              'mt-3 text-[0.68rem] font-semibold tracking-[0.24em] uppercase',
              dark ? 'text-gold-light' : 'text-gold-dark',
            )}
          >
            {caption}
          </span>
        )}
        {note && (
          <span className={cn('mt-2 font-serif text-lg italic', dark ? 'text-white/70' : 'text-muted')}>{note}</span>
        )}
      </div>
    </div>
  );
}
