export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export const formatPrice = (value: number) => brl.format(value);

export const formatScore = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 1 });

/** Data local no formato YYYY-MM-DD (compatível com <input type="date">). */
export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = Date.parse(`${checkIn}T00:00:00Z`);
  const b = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function formatDateBR(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const sectionHref = (section: string) => (section === 'inicio' ? '/' : `/#${section}`);

/** Prefixo do site quando publicado num subcaminho (ex.: '/hotel-Janauba' no GitHub Pages); '' na raiz. */
export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixa caminhos absolutos de arquivos públicos (ex.: '/images/a.webp') com o subcaminho do site. */
export const withBase = (p: string) => (p.startsWith('/') && !p.startsWith('//') ? `${basePath}${p}` : p);
