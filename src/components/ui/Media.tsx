import { useId, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import type { SiteImage } from '@/types';

interface MediaProps {
  image: SiteImage;
  className?: string;
  /** Tom do placeholder: claro para fundos claros, escuro para fundos escuros. */
  tone?: 'light' | 'dark';
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
}

/**
 * Imagem responsiva com lazy loading. Sem `src`, exibe um placeholder
 * elegante e claramente identificado como espaço reservado para foto.
 */
export function Media({ image, className, tone = 'light', sizes = '100vw', priority, imgClassName }: MediaProps) {
  const [loaded, setLoaded] = useState(false);
  const patternId = `ph-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  if (!image.src) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={cn(
          'relative isolate flex items-center justify-center overflow-hidden',
          tone === 'light'
            ? 'bg-[linear-gradient(135deg,#efe6d7_0%,#e2d4bd_55%,#d6c4a6_100%)] text-gold-dark'
            : 'bg-[linear-gradient(140deg,#2b2621_0%,#1c1a17_60%,#141311_100%)] text-gold-light',
          className,
        )}
      >
        <svg className="absolute inset-0 -z-10 h-full w-full opacity-[0.18]" aria-hidden="true">
          <defs>
            <pattern id={patternId} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="22" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        {siteConfig.showPlaceholderLabels && (
          <div className="flex max-w-[80%] flex-col items-center gap-2 text-center">
            <ImageIcon aria-hidden="true" strokeWidth={1.2} className="h-7 w-7 opacity-70" />
            <span className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase opacity-60">
              Espaço para foto
            </span>
            <span className="font-serif text-base leading-tight italic opacity-90 sm:text-lg">{image.placeholder}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-sand', className)}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-[opacity,transform] duration-700',
          loaded || priority ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  );
}
