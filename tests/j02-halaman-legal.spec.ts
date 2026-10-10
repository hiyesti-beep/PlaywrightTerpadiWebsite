import { test, expect } from '@playwright/test';

const halaman = [
  { link: 'Syarat', url: '/terms', judul: /Syarat Layanan/ },
  { link: 'Privasi', url: '/privacy', judul: /Kebijakan Privasi/ },
  { link: 'Hapus akun', url: '/delete-account', judul: /Hapus Akun/ },
  { link: 'Keselamatan anak', url: '/child-safety', judul: /Standar Keselamatan Anak/ },
];

test.describe('j02 halaman legal', () => {
  for (const { link, url, judul } of halaman) {
    test(`footer "${link}" membuka ${url}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('contentinfo').getByRole('link', { name: link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${url}$`));
      await expect(page).toHaveTitle(judul);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(judul);
    });
  }
});
