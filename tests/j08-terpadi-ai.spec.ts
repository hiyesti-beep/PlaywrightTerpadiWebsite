import { test, expect } from '@playwright/test';

test.describe('j08 terpadi AI @auth', () => {
  test('menampilkan paket Terpadi AI', async ({ page }) => {
    await page.goto('/app/ai');

    // Target the actual heading rendered on the page
    await expect(page.getByRole('heading', { name: /Terpadi AI/i })).toBeVisible({ timeout: 10000 });
  });
});