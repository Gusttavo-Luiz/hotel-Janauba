import { cn } from '@/lib/utils';

/** Arcos concêntricos em traço fino: o motivo visual da identidade do site. */
export function ArchMotif({ className, count = 6 }: { className?: string; count?: number }) {
  return (
    <svg className={cn('pointer-events-none', className)} viewBox="0 0 600 800" fill="none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M ${60 + i * 40} 800 V ${360 + i * 12} A ${240 - i * 40} ${240 - i * 40} 0 0 1 ${540 - i * 40} ${360 + i * 12} V 800`}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
