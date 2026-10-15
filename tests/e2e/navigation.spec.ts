import { expect, test } from '@playwright/test';

test.describe('Navegação', () => {
  test('Voltar retoma a posição da página anterior', async ({ page }) => {
    await page.goto('/acomodacoes');
    const link = page.getByRole('link', { name: 'Ver detalhes do Quarto Triplo' }).first();
    await link.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);

    // clique direto no elemento: o click() do Playwright rolaria de novo se a barra fixa do celular cobrisse o link
    await link.evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL(/\/acomodacoes\/quarto-triplo$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await page.goBack();
    await expect(page).toHaveURL(/\/acomodacoes$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(before, -1);
  });

  test('o foco vai para o título da nova página', async ({ page }) => {
    await page.goto('/acomodacoes');
    await page.getByRole('link', { name: 'Ver detalhes do Quarto Família' }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: 'Quarto Família' })).toBeFocused();
    await expect(page).toHaveTitle(/Quarto Família/);
  });

  test('"Reservar" na página do quarto leva ao formulário do próprio quarto', async ({ page }) => {
    await page.goto('/acomodacoes/quarto-duplo');
    await page.locator('header').getByRole('button', { name: 'Reservar' }).click();
    await expect(page).toHaveURL(/\/acomodacoes\/quarto-duplo$/);
    await expect(page.locator('#reservar-quarto').getByRole('button', { name: /Check-in/ }).first()).toBeFocused();
  });

  test('"Reservar" num card leva à barra de reserva com o quarto escolhido', async ({ page }) => {
    await page.goto('/acomodacoes');
    await page.getByRole('button', { name: 'Reservar Quarto Família' }).first().click();
    await expect(page).toHaveURL(/\/#reservar$/);
    await expect(page.locator('#reservar').getByLabel('Acomodação')).toHaveValue('quarto-familia');
  });

  test('a troca de página tem fade, o primeiro carregamento não', async ({ page }) => {
    await page.goto('/acomodacoes');
    const wrapper = page.locator('main > div').first();
    await expect(wrapper).not.toHaveClass(/animate-page-in/);
    await page.getByRole('link', { name: 'Ver detalhes do Quarto Duplo' }).first().evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL(/\/acomodacoes\/quarto-duplo$/);
    await expect(page.locator('main > div').first()).toHaveClass(/animate-page-in/);
  });

  test('Anterior / Próximo percorrem os quartos em ordem', async ({ page }) => {
    const nav = () => page.getByRole('navigation', { name: 'Navegar entre as acomodações' });
    await page.goto('/acomodacoes/quarto-duplo');
    await expect(nav().getByRole('link')).toHaveCount(1);
    await nav().getByRole('link', { name: 'Próxima acomodação: Quarto Triplo' }).click();
    await expect(page).toHaveURL(/\/acomodacoes\/quarto-triplo$/);
    await expect(nav().getByRole('link', { name: 'Acomodação anterior: Quarto Duplo' })).toBeVisible();
    await nav().getByRole('link', { name: 'Próxima acomodação: Quarto Família' }).click();
    await expect(page).toHaveURL(/\/acomodacoes\/quarto-familia$/);
    await expect(nav().getByRole('link')).toHaveCount(1);
    await expect(nav().getByRole('link', { name: 'Acomodação anterior: Quarto Triplo' })).toBeVisible();
  });

  test('endereço inexistente mostra a página 404', async ({ page }) => {
    await page.goto('/pagina-que-nao-existe');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/não encontrada/i);
  });
});
