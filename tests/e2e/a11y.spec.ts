import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/o-hotel',
  '/acomodacoes',
  '/acomodacoes/quarto-duplo',
  '/acomodacoes/quarto-triplo',
  '/acomodacoes/quarto-familia',
  '/politica-de-privacidade',
  '/termos-de-uso',
  '/pagina-que-nao-existe',
];

test.describe('Acessibilidade (axe, WCAG 2.1 AA)', () => {
  for (const route of routes) {
    test(`sem violações em ${route}`, async ({ page }) => {
      // Sem animações: um texto no meio de um fade daria falso erro de contraste.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const found = results.violations.flatMap((v) => v.nodes.map((n) => `${v.id} · ${n.html}\n${n.failureSummary}`));
      expect(found).toEqual([]);
    });
  }
});
