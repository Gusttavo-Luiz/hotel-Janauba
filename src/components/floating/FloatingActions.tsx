import { ArrowUp } from 'lucide-react';
import { useScrolled } from '@/hooks';
import { cn } from '@/lib/utils';
import { whatsappUrl } from '@/services/whatsapp';
import { WhatsAppIcon } from '@/components/ui/Icon';

/** Botão flutuante do WhatsApp + voltar ao topo. */
export function FloatingActions() {
  const scrolled = useScrolled(600);
  const wa = whatsappUrl();

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo"
        tabIndex={scrolled ? 0 : -1}
        className={cn(
          'grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-ivory/95 text-ink shadow-soft backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:bg-white',
          scrolled ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        )}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="group pointer-events-auto relative flex h-14 items-center gap-0 rounded-full bg-whatsapp pr-4 pl-4 text-white shadow-[0_12px_30px_-10px_rgb(18_128_67/0.6)] transition-all duration-500 hover:-translate-y-0.5 hover:gap-2.5 hover:pr-5"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp opacity-20 [animation-duration:2.6s]" aria-hidden="true" />
          <WhatsAppIcon className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-[max-width] duration-500 group-hover:max-w-40 group-focus-visible:max-w-40">
            Fale conosco
          </span>
        </a>
      )}
    </div>
  );
}
