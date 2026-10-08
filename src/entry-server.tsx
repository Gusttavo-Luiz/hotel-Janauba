import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { absoluteUrl, siteConfig } from './config/site';
import { allRoutes, breadcrumbJsonLd, getRouteMeta, hotelJsonLd, shareImage } from './data/seo';

export { allRoutes, siteConfig };

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/** Tags de <head> específicas de cada página (title, description, canonical, OG, JSON-LD). */
export function head(url: string) {
  const meta = getRouteMeta(url);
  const canonical = absoluteUrl(meta.path);
  const image = absoluteUrl(shareImage.path) || shareImage.path;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : '',
    siteConfig.googleSiteVerification
      ? `<meta name="google-site-verification" content="${escapeHtml(siteConfig.googleSiteVerification)}" />`
      : '',
    canonical ? `<link rel="canonical" href="${canonical}" />` : '',
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    canonical ? `<meta property="og:url" content="${canonical}" />` : '',
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${shareImage.width}" />`,
    `<meta property="og:image:height" content="${shareImage.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(shareImage.alt)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLd(hotelJsonLd()),
  ];
  const crumbs = breadcrumbJsonLd(url);
  if (crumbs) tags.push(jsonLd(crumbs));
  return tags.filter(Boolean).join('\n    ');
}
