import { test, expect } from '@playwright/test';

test.describe('j01 landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('menampilkan judul dan hero', async ({ page }) => {
    await expect(page).toHaveTitle(/Terpadi/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Lihat yang seru di sekitarmu.');
  });

  test('navigasi utama tersedia', async ({ page }) => {
    const nav = page.getByRole('banner');
    for (const nama of ['Experience', 'Area', 'Terpadi AI', 'Paket']) {
      await expect(nav.getByRole('link', { name: nama, exact: true }).first()).toBeVisible();
    }
  });

  test('tombol Masuk menuju halaman login', async ({ page }) => {
    await page.getByRole('link', { name: 'Masuk', exact: true }).first().click();
    await expect(page).toHaveURL(/\/app\/login/);
  });

  test('versi bahasa Inggris', async ({ page }) => {
    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText("See what's happening near you.");
  });
});
