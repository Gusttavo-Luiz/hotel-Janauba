import { expect, test } from '@playwright/test';

test.describe('Contato', () => {
  test('valida os campos obrigatórios', async ({ page }) => {
    await page.goto('/#contato');
    await page.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.getByText('Informe seu nome.')).toBeVisible();
    await expect(page.getByText('Informe seu e-mail.')).toBeVisible();
    await expect(page.getByText('Selecione um assunto.')).toBeVisible();
    await expect(page.locator('#contato-name')).toBeFocused();

    await page.locator('#contato-email').fill('email-invalido');
    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  });

  test('guarda o rascunho ao recarregar a página', async ({ page }) => {
    await page.goto('/#contato');
    await page.locator('#contato-name').fill('Maria Teste');
    await page.locator('#contato-phone').fill('38999990000');
    await page.locator('#contato-subject').selectOption('Reservas');
    await page.locator('#contato-message').fill('Gostaria de saber sobre o estacionamento.');
    await expect(page.locator('#contato-phone')).toHaveValue('(38) 99999-0000');

    await page.reload();
    await expect(page.locator('#contato-name')).toHaveValue('Maria Teste');
    await expect(page.locator('#contato-subject')).toHaveValue('Reservas');
    await expect(page.locator('#contato-message')).toHaveValue('Gostaria de saber sobre o estacionamento.');
  });
});

test.describe('Localização e dúvidas', () => {
  test('copia o endereço e oferece rotas no Waze e no Google Maps', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'permissão de área de transferência só no Chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#localizacao');
    const section = page.locator('#localizacao');
    await section.getByRole('button', { name: 'Copiar endereço' }).click();
    await expect(section.getByText('Endereço copiado!')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Rua Inhumas, 175 – Centro, Janaúba – MG, 39442-030');
    await expect(section.getByRole('link', { name: 'Abrir no Waze' })).toHaveAttribute('href', /waze\.com\/ul\?q=Rua%20Inhumas%2C%20175/);
    await expect(section.getByRole('link', { name: 'Abrir no Google Maps' })).toHaveAttribute('href', /google\.com\/maps/);
  });

  test('as perguntas frequentes abrem e levam à recepção', async ({ page }) => {
    await page.goto('/#perguntas-frequentes');
    const faq = page.locator('#perguntas-frequentes');
    await faq.getByText('Qual é o horário de check-in?').click();
    await expect(faq.getByText(/14h|14:00/).first()).toBeVisible();
    await expect(faq.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', /wa\.me\/5538998760055/);
  });
});
