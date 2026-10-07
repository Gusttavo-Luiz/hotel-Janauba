import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { HeroBackdrop } from './Hero';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
  children?: ReactNode;
}

/** Cabeçalho escuro das páginas internas (mantém o header transparente consistente). */
export function PageHero({ eyebrow, title, description, breadcrumbs, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 text-white sm:pt-44 sm:pb-20">
      <div className="absolute inset-0 -z-10">
        <HeroBackdrop />
      </div>
      <div className="container-x">
        {breadcrumbs && (
          <nav aria-label="Trilha de navegação" className="mb-8 animate-fade-in">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
              {breadcrumbs.map((b, i) => (
                <li key={b.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                  {b.to ? (
                    <Link to={b.to} className="transition-colors hover:text-gold-light">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/85">
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow eyebrow-light animate-fade-in">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl animate-slide-up text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl animate-slide-up text-[1.02rem] leading-relaxed text-white/70 [animation-delay:150ms]">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
