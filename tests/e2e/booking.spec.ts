import { expect, test } from '@playwright/test';
import { guestsTrigger, pickDates } from './helpers';

test.describe('Consulta de disponibilidade', () => {
  test('gera os links do Booking.com e do WhatsApp com a estadia escolhida', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('#reservar');
    const { checkIn, checkOut } = await pickDates(page, bar);
    await bar.getByLabel('Acomodação').selectOption('quarto-triplo');
    await expect(guestsTrigger(bar)).toHaveText(/3 hóspedes · 1 quarto/);

    await bar.getByRole('button', { name: 'Ver disponibilidade' }).click();
    const booking = bar.getByRole('link', { name: /Ver tarifas no Booking\.com/ });
    await expect(booking).toBeVisible();
    const url = new URL((await booking.getAttribute('href'))!);
    expect(url.hostname).toContain('booking.com');
    expect(url.searchParams.get('checkin')).toBe(checkIn);
    expect(url.searchParams.get('checkout')).toBe(checkOut);
    expect(url.searchParams.get('group_adults')).toBe('3');
    expect(url.searchParams.get('no_rooms')).toBe('1');

    const whatsapp = await bar.getByRole('link', { name: /Reservar pelo WhatsApp/ }).getAttribute('href');
    expect(whatsapp).toContain('wa.me/5538998760055');
    expect(decodeURIComponent(whatsapp!)).toContain('Quarto Triplo');
  });

  test('pede as datas antes de consultar', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('#reservar');
    await bar.getByRole('button', { name: 'Ver disponibilidade' }).click();
    await expect(bar.getByText('Informe a data de check-in.')).toBeVisible();
    await expect(bar.getByRole('button', { name: /Check-in/ }).first()).toBeFocused();
  });

  test('avisa quando os hóspedes passam da capacidade do quarto', async ({ page }) => {
    await page.goto('/acomodacoes/quarto-duplo');
    const form = page.locator('#reservar-quarto');
    await guestsTrigger(form).click();
    await page.getByRole('button', { name: 'Aumentar hóspedes' }).click();
    await expect(page.getByText(/Para 3 hóspedes, escolha ao menos 2 quartos/)).toBeVisible();
    await page.getByRole('button', { name: 'Ajustar' }).click();
    await expect(guestsTrigger(form)).toHaveText(/3 hóspedes · 2 quartos/);
  });

  test('a estadia escolhida acompanha o visitante entre as páginas', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('#reservar');
    await pickDates(page, bar);
    const chosen = await bar.getByRole('button', { name: /Check-in/ }).first().innerText();

    await page.goto('/acomodacoes/quarto-familia');
    const form = page.locator('#reservar-quarto');
    await expect(form.getByRole('button', { name: /Check-in/ }).first()).toHaveText(chosen);

    await page.reload();
    await expect(form.getByRole('button', { name: /Check-in/ }).first()).toHaveText(chosen);
  });
});
