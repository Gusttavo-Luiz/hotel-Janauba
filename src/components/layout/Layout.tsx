import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { BookingProvider } from '@/context/BookingContext';
import { getRouteMeta } from '@/data/seo';
import { absoluteUrl } from '@/config/site';
import { useRevealOnScroll } from '@/hooks';
import { FloatingActions } from '@/components/floating/FloatingActions';
import { Footer } from './Footer';
import { Header } from './Header';

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

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      // aguarda a renderização da nova página antes de rolar
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => window.clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.key, location.hash]);

  useRevealOnScroll(location.pathname);
  return null;
}

export function Layout() {
  return (
    <BookingProvider>
      <RouteEffects />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </BookingProvider>
  );
}
