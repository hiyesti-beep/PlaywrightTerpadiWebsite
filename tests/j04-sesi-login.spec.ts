import { test, expect } from '@playwright/test';

test.describe('j04 sesi login dari storageState @auth', () => {
  test('sidebar tidak lagi menampilkan tombol Masuk', async ({ page }) => {
    await page.goto('/app/area');
    await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Masuk', exact: true })).toHaveCount(0);
  });
  test('halaman login tidak lagi diperlukan', async ({ page }) => {
    // Navigate with domcontentloaded to prevent hanging on full load state
    await page.goto('/app/post/new', { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/app\/login/);
  });
});
