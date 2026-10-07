import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[0.06em] whitespace-nowrap transition-all duration-300 ease-[var(--ease-elegant)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-light shadow-[0_10px_30px_-12px_rgb(196_162_113/0.7)] hover:shadow-[0_14px_34px_-12px_rgb(196_162_113/0.85)]',
  dark: 'bg-ink text-ivory hover:bg-graphite',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-ivory',
  'outline-light': 'border border-white/40 text-white hover:border-white hover:bg-white hover:text-ink',
  ghost: 'text-ink hover:text-gold-dark px-0!',
  whatsapp: 'bg-whatsapp text-white hover:brightness-110',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.72rem] uppercase',
  md: 'px-6 py-3 text-[0.78rem] uppercase',
  lg: 'px-8 py-4 text-[0.8rem] uppercase',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export const Button = forwardRef<HTMLButtonElement, StyleProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ variant, size, className, children, type = 'button', ...props }, ref) {
    return (
      <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props}>
        {children}
      </button>
    );
  },
);

export function ButtonLink({ variant, size, className, children, ...props }: StyleProps & LinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** Link externo (abre em nova aba com rel seguro). */
export function ButtonAnchor({
  variant,
  size,
  className,
  children,
  external = true,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  return (
    <a
      className={buttonClass(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
