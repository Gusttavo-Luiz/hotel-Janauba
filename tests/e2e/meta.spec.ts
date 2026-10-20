import { expect, test } from '@playwright/test';

test.describe('Ícones e manifest', () => {
  test.beforeEach(({ isMobile }) => test.skip(isMobile, 'basta rodar uma vez'));

  test('o manifest e todos os ícones existem', async ({ page, request }) => {
    await page.goto('/');
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    const manifestUrl = new URL(manifestHref!, page.url());
    const manifest = await (await request.get(manifestUrl.href)).json();
    expect(manifest.name).toBe('Hotel Premier Janaúba');
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(['192x192', '512x512', '512x512']);
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);

    const appleHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    const urls = [new URL(appleHref!, page.url()).href, ...manifest.icons.map((i: { src: string }) => new URL(i.src, manifestUrl).href)];
    for (const url of urls) {
      const res = await request.get(url);
      expect(res.status(), url).toBe(200);
      expect(res.headers()['content-type'], url).toContain('image/png');
    }
  });
});
