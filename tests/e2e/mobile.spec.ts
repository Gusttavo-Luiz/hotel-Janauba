import { expect, test } from '@playwright/test';
import { pickDates } from './helpers';

test.describe('Celular', () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, 'só no celular'));

  const bar = (page: import('@playwright/test').Page) => page.locator('div.floating-actions.fixed.inset-x-0');

  test('a barra fixa mostra o preço do quarto e leva ao formulário dele', async ({ page }) => {
    await page.goto('/acomodacoes/quarto-familia');
    await page.mouse.wheel(0, 3000);
    await expect(bar(page)).toContainText('R$ 320');
    await bar(page).getByRole('button', { name: 'Reservar' }).click();
    await expect(page.locator('#reservar-quarto').getByRole('button', { name: /Check-in/ }).first()).toBeFocused();
  });

  test('a barra fixa mostra as datas escolhidas', async ({ page }) => {
    await page.goto('/acomodacoes/quarto-duplo');
    await pickDates(page, page.locator('#reservar-quarto'), 10, 13);
    await page.mouse.wheel(0, 4000);
    await expect(bar(page)).toContainText('3 noites · 2 hóspedes');
  });

  test('o menu abre e fecha', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('#menu-mobile');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });
});
