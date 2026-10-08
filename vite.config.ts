import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Na Vercel, sem VITE_SITE_URL definida, usa o domínio de produção do projeto.
  const vercelProduction =
    process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '';
  const siteUrl = env.VITE_SITE_URL || vercelProduction;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      ...(siteUrl ? { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) } : {}),
      // Métricas (Vercel Web Analytics) apenas em builds feitos na Vercel.
      'import.meta.env.VITE_ANALYTICS': JSON.stringify(process.env.VERCEL ? 'vercel' : ''),
    },
    build: {
      target: 'es2020',
      // Fontes sempre como arquivo (o CSS é embutido no HTML pelo pré-render).
      assetsInlineLimit: (file: string) => (/\.woff2?$/.test(file) ? false : undefined),
      cssMinify: true,
    },
  };
});
