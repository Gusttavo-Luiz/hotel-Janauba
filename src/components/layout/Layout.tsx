import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { BookingProvider } from '@/context/BookingContext';
import { getRouteMeta } from '@/data/seo';
import { absoluteUrl } from '@/config/site';
import { useRevealOnScroll } from '@/hooks';
import { FloatingActions } from '@/components/floating/FloatingActions';
import { Footer } from './Footer';
import { Header } from './Header';

const SCROLL_KEY = 'hotel-premier:rolagem';

function readScroll(key: string): number | undefined {
  try {
    const all = JSON.parse(window.sessionStorage.getItem(SCROLL_KEY) ?? '{}') as Record<string, unknown>;
    return typeof all[key] === 'number' ? all[key] : undefined;
  } catch {
    return undefined;
  }
}

function saveScroll(key: string, y: number) {
  try {
    const all = JSON.parse(window.sessionStorage.getItem(SCROLL_KEY) ?? '{}') as Record<string, number>;
    delete all[key]; // reinsere no fim (mais recente)
    all[key] = Math.round(y);
    // mantém só as entradas mais recentes
    const entries = Object.entries(all).slice(-30);
    window.sessionStorage.setItem(SCROLL_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* armazenamento indisponível */
  }
}

function isReloadOrHistoryLoad() {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type === 'reload' || entry?.type === 'back_forward';
}

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Rolagem para âncoras (#secao) e topo a cada navegação; atualiza metadados. */
function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    const canonical = absoluteUrl(meta.path);
    if (canonical) {
      setMeta('link[rel="canonical"]', 'href', canonical);
      setMeta('meta[property="og:url"]', 'content', canonical);
    }
  }, [location.pathname]);

  // Guarda a posição de rolagem de cada entrada do histórico, para o "Voltar" do navegador.
  // A primeira entrada de cada carregamento tem sempre a chave 'default': diferencia pela rota.
  const scrollKey = location.key === 'default' ? `default:${location.pathname}` : location.key;
  const keyRef = useRef(scrollKey);
  useLayoutEffect(() => {
    keyRef.current = scrollKey;
  }, [scrollKey]);
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    let frame = 0;
    const save = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => saveScroll(keyRef.current, window.scrollY));
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', save);
    };
  }, []);

  const navigationType = useNavigationType();
  const firstRender = useRef(true);
  useEffect(() => {
    const initial = firstRender.current;
    firstRender.current = false;
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      // aguarda a renderização da nova página antes de rolar
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => window.clearTimeout(t);
    }
    // No carregamento inicial, só restaura ao recarregar ou voltar de outro site.
    const restorable = initial ? isReloadOrHistoryLoad() : navigationType === 'POP';
    const saved = restorable ? readScroll(scrollKey) : undefined;
    window.scrollTo({ top: saved ?? 0, behavior: 'instant' as ScrollBehavior });
    // Numa navegação por link, o foco vai para o título da nova página (leitores de tela anunciam).
    if (!initial && navigationType !== 'POP') {
      const title = document.querySelector<HTMLElement>('main h1');
      if (title) {
        title.tabIndex = -1;
        title.focus({ preventScroll: true });
      }
    }
  }, [scrollKey, location.hash]);

  useRevealOnScroll(location.pathname);
  return null;
}

/**
 * Envolve a página atual: a cada troca de rota a página entra com um fade curto.
 * No primeiro carregamento não há animação (o HTML pré-renderizado aparece direto).
 */
function PageTransition() {
  const { pathname } = useLocation();
  const initialPath = useRef(pathname);
  const navigated = useRef(false);
  useEffect(() => {
    if (pathname !== initialPath.current) navigated.current = true;
  }, [pathname]);
  const animate = navigated.current || pathname !== initialPath.current;
  return (
    <div key={pathname} className={animate ? 'animate-page-in' : undefined}>
      <Outlet />
    </div>
  );
}

export function Layout() {
  return (
    <BookingProvider>
      <RouteEffects />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <PageTransition />
      </main>
      <Footer />
      <FloatingActions />
    </BookingProvider>
  );
}
