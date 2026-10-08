/**
 * Pré-renderiza cada rota em HTML estático (SEO + carregamento rápido).
 * Executado após `vite build` (cliente) e `vite build --ssr` (servidor).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = path.join(root, 'dist/client');
const serverEntry = path.join(root, 'dist/server/entry-server.js');

// Subcaminho de publicação (ex.: /hotel-Janauba/ no GitHub Pages).
const base = process.env.BASE_PATH || '/';

let template = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf-8');

// CSS embutido no HTML: elimina uma requisição que bloqueia a primeira pintura.
template = template.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/, (_, href) => {
  const css = fs.readFileSync(path.join(clientDir, href.slice(base.length)), 'utf-8');
  return `<style>${css}</style>`;
});

// Pré-carrega as fontes usadas no topo da página (títulos e textos).
const assetFiles = fs.readdirSync(path.join(clientDir, 'assets'));
const preloads = [/^cormorant-garamond-latin-500-normal-.*\.woff2$/, /^manrope-latin-wght-normal-.*\.woff2$/]
  .map((re) => assetFiles.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="${base}assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');
template = template.replace('<!--head:start-->', `${preloads}\n    <!--head:start-->`);
const { render, head, allRoutes, siteConfig } = await import(pathToFileURL(serverEntry).href);

const HEAD_RE = /<!--head:start-->[\s\S]*?<!--head:end-->/;

function writePage(url, outFile) {
  const html = template
    .replace(HEAD_RE, head(url))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${url}">${render(url)}</div>`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  console.log(`  ✓ ${url.padEnd(36)} → ${path.relative(root, outFile)}`);
}

console.log('Pré-renderizando páginas…');
for (const route of allRoutes) {
  // rota.html: o Cloudflare Pages serve /rota sem redirecionar para /rota/
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  writePage(route.path, path.join(clientDir, file));
  // Cópia em rota/index.html para hospedagens que redirecionam /rota para /rota/ (ex.: GitHub Pages).
  if (process.env.PRERENDER_DIR_INDEX === 'true' && route.path !== '/') {
    writePage(route.path, path.join(clientDir, route.path.slice(1), 'index.html'));
  }
}
writePage('/404', path.join(clientDir, '404.html'));

// Pré-visualizações (branches fora da main no Cloudflare Pages) e cópias marcadas com
// VITE_NOINDEX não devem ser indexadas.
if ((process.env.CF_PAGES && process.env.CF_PAGES_BRANCH !== 'main') || siteConfig.noindex) {
  fs.writeFileSync(path.join(clientDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log('  ✓ robots.txt bloqueando indexação (cópia de visualização)');
}
// sitemap.xml e robots.txt (apenas quando a URL pública estiver definida)
else if (siteConfig.url) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = allRoutes
    .map((r) => `  <url><loc>${siteConfig.url}${r.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  fs.writeFileSync(
    path.join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  fs.writeFileSync(path.join(clientDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`);
  console.log('  ✓ sitemap.xml e robots.txt');
} else {
  console.log('  ! VITE_SITE_URL não definida: canonical e sitemap.xml foram omitidos.');
}

fs.rmSync(path.join(root, 'dist/server'), { recursive: true, force: true });
