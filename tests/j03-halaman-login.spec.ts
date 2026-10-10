import { test, expect } from '@playwright/test';

test.describe('j03 halaman login (belum login)', () => {
  test('menampilkan tombol Lanjut dengan Google', async ({ page }) => {
    await page.goto('/app/login');
    await expect(page.getByRole('heading', { name: 'Masuk ke Terpadi' })).toBeVisible();
    await expect(page.locator('iframe[title="Tombol Login dengan Google"]')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ketentuan' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Kebijakan Privasi' })).toBeVisible();
  });

  for (const url of ['/app/post/new', '/app/ai']) {
    test(`${url} redirect ke login dengan returnTo`, async ({ page }) => {
      await page.goto(url);
      await expect(page).toHaveURL(/\/app\/login\?returnTo=/, { timeout: 15_000 });
    });
  }
});
