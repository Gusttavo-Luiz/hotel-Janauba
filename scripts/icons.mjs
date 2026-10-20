/**
 * Gera os ícones do site a partir de scripts/icons.html:
 *   public/apple-touch-icon.png (180), public/icon-192.png, public/icon-512.png,
 *   public/icon-maskable-512.png (com margem para o recorte do Android).
 * Uso: npm run icons (requer Playwright e um Chromium disponíveis).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import('playwright');
const source = pathToFileURL(path.join(root, 'scripts/icons.html')).href;

const icons = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
];

const browser = await chromium.launch();
for (const { file, size, maskable } of icons) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.goto(maskable ? `${source}?maskable` : source);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public', file), type: 'png' });
  await page.close();
  console.log(`✓ public/${file}`);
}
await browser.close();
