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

const template = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf-8');
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
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`;
  writePage(route.path, path.join(clientDir, file));
}
writePage('/404', path.join(clientDir, '404.html'));

// Deploys de pré-visualização da Vercel não devem ser indexados.
if (process.env.VERCEL_ENV === 'preview') {
  fs.writeFileSync(path.join(clientDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log('  ✓ robots.txt bloqueando indexação (deploy de pré-visualização)');
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
