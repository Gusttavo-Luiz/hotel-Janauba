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
  // Sem animações: elementos no meio de um fade gerariam falsos erros de contraste.
  test.use({ reducedMotion: 'reduce' });

  for (const route of routes) {
    test(`sem violações em ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }
});
