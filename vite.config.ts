import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // No Cloudflare Pages, sem VITE_SITE_URL definida, o build da branch main usa o
  // endereço do projeto: https://<hash>.<projeto>.pages.dev → https://<projeto>.pages.dev
  const pagesMatch =
    process.env.CF_PAGES_BRANCH === 'main'
      ? (process.env.CF_PAGES_URL ?? '').match(/^https:\/\/[^.]+\.(.+\.pages\.dev)\/?$/)
      : null;
  const siteUrl = env.VITE_SITE_URL || (pagesMatch ? `https://${pagesMatch[1]}` : '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: siteUrl ? { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) } : {},
    build: {
      target: 'es2020',
      // Fontes sempre como arquivo (o CSS é embutido no HTML pelo pré-render).
      assetsInlineLimit: (file: string) => (/\.woff2?$/.test(file) ? false : undefined),
      cssMinify: true,
    },
  };
});
