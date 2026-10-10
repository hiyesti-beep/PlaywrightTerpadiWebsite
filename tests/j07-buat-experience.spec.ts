import { test, expect } from '@playwright/test';

test.describe('j07 buat experience @auth', () => {
  // Hanya membuka form, TIDAK memposting supaya tidak membuat data di produksi
  test('form buat experience bisa dibuka', async ({ page }) => {
    await page.goto('/app/area');
    await page.getByRole('link', { name: 'Create', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/post\/new/);
    await expect(page).not.toHaveURL(/\/app\/login/);
  });
});