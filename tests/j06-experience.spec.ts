import { test, expect } from '@playwright/test';

test.describe('j06 experience feed @auth', () => {
  test('menu Experience bisa dibuka dari sidebar', async ({ page }) => {
    await page.goto('/app/area');
    await page.getByRole('link', { name: 'Experience', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/?$/);
    await expect(page).not.toHaveURL(/\/app\/login/);
  });
});
