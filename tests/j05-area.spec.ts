import { test, expect } from '@playwright/test';

test.describe('j05 area peta @auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/area');
  });

  test('menampilkan filter kategori peta', async ({ page }) => {
    for (const nama of ['All', 'Experience', 'Place', 'Event']) {
      await expect(page.getByRole('button', { name: new RegExp(`^${nama}$`, 'i') })).toBeVisible();
    }
  });

  test('tidak meminta login untuk melihat sekitar', async ({ page }) => {
    await expect(page.getByText('Masuk untuk melihat sekitarmu')).toHaveCount(0);
  });
});
