/**
 * Gera public/og-image.jpg a partir de scripts/og-image.html.
 * Uso: npm run og-image (requer Playwright e um Chromium disponíveis).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(root, 'scripts/og-image.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public/og-image.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
console.log('✓ public/og-image.jpg');
