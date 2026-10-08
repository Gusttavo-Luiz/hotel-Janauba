import { inject, track as vercelTrack } from '@vercel/analytics';

/**
 * Métricas anônimas e sem cookies (Vercel Web Analytics).
 * Só é ativado em builds feitos na Vercel; em outros ambientes nada é enviado.
 * Visitas e páginas vistas funcionam no plano gratuito; os eventos de clique
 * (track) aparecem no painel apenas nos planos pagos da Vercel.
 */
const enabled = import.meta.env.PROD && import.meta.env.VITE_ANALYTICS === 'vercel';

type Props = Record<string, string | number | boolean | null>;

export function initAnalytics() {
  if (enabled) inject({ mode: 'production' });
}

export function track(event: string, props?: Props) {
  if (enabled) vercelTrack(event, props);
}

const linkEvents: Array<[RegExp, string]> = [
  [/^https:\/\/wa\.me\//, 'WhatsApp'],
  [/^https:\/\/www\.booking\.com\//, 'Booking.com'],
  [/^tel:/, 'Ligar'],
  [/^https:\/\/www\.google\.com\/maps\/dir\//, 'Como chegar'],
  [/^https:\/\/www\.instagram\.com\//, 'Instagram'],
];

/** Registra cliques nos links de conversão (WhatsApp, Booking.com, telefone, rota, Instagram). */
export function trackLinkClicks() {
  if (!enabled) return () => {};
  const onClick = (e: MouseEvent) => {
    const anchor = (e.target as Element | null)?.closest?.('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') ?? '';
    const match = linkEvents.find(([re]) => re.test(href));
    if (match) track(match[1], { pagina: window.location.pathname });
  };
  document.addEventListener('click', onClick, { capture: true });
  return () => document.removeEventListener('click', onClick, { capture: true });
}
