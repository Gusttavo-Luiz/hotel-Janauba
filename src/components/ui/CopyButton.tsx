import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn, copyText } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel?: string;
  icon?: ReactNode;
  className?: string;
}

/** Botão que copia um texto e confirma por alguns segundos (anunciado a leitores de tela). */
export function CopyButton({ text, label, copiedLabel = 'Copiado!', icon, className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    setState((await copyText(text)) ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-muted uppercase transition-colors hover:text-gold-dark',
        className,
      )}
    >
      {state === 'copied' ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : (icon ?? <Copy className="h-4 w-4" aria-hidden="true" />)}
      <span aria-live="polite">{state === 'copied' ? copiedLabel : state === 'failed' ? 'Não foi possível copiar' : label}</span>
    </button>
  );
}
