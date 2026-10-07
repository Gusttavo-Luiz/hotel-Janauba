import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  id,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div data-reveal className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      <p className={cn('eyebrow', tone === 'dark' && 'eyebrow-light', align === 'center' && 'justify-center')}>
        {eyebrow}
      </p>
      <Tag
        id={id}
        className={cn(
          'mt-4 text-[2.4rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]',
          tone === 'dark' ? 'text-ivory' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-[1.05rem]',
            tone === 'dark' ? 'text-white/70' : 'text-muted',
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
