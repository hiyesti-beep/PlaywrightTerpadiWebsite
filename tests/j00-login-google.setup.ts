import { test as setup, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AUTH_FILE } from './support/auth';

/*
 * j00 - Login dengan Google lalu simpan context ke storageState (AUTH_FILE).
 *
 * - Jika GOOGLE_EMAIL & GOOGLE_PASSWORD di-set, email/password diisi otomatis.
 *   Selain itu (atau jika Google meminta 2FA / verifikasi WhatsApp Terpadi),
 *   selesaikan login secara manual di jendela browser yang terbuka.
 * - storageState dipakai ulang selama belum lebih tua dari AUTH_MAX_AGE_HOURS
 *   (default 168 jam). Paksa login ulang dengan REAUTH=1.
 */
const MAX_AGE_MS = Number(process.env.AUTH_MAX_AGE_HOURS ?? 168) * 60 * 60 * 1000;
const LOGIN_TIMEOUT = 4 * 60 * 1000;

function authMasihValid(): boolean {
  if (process.env.REAUTH || !fs.existsSync(AUTH_FILE)) return false;
  return Date.now() - fs.statSync(AUTH_FILE).mtimeMs < MAX_AGE_MS;
}

async function isiAkunGoogle(popup: Page) {
  const email = process.env.GOOGLE_EMAIL;
  const password = process.env.GOOGLE_PASSWORD;
  if (!email || !password) return;

  await popup.locator('input[type="email"]').fill(email);
  await popup.locator('#identifierNext').click();
  await popup.locator('input[type="password"]').fill(password);
  await popup.locator('#passwordNext').click();
}

setup('j00 login dengan Google dan simpan storageState', async ({ page }) => {
  setup.skip(authMasihValid(), `storageState masih valid: ${AUTH_FILE}`);

  await page.goto('/app/login');
  await expect(page.getByRole('heading', { name: 'Masuk ke Terpadi' })).toBeVisible();

  // Tombol Google Identity Services dirender di dalam iframe dan membuka popup
  const tombolGoogle = page
    .frameLocator('iframe[title="Tombol Login dengan Google"]')
    .getByRole('button');

  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    tombolGoogle.click(),
  ]);
  await popup.waitForLoadState();
  await isiAkunGoogle(popup);

  // Tunggu sampai login (termasuk verifikasi WhatsApp bila diminta) selesai
  await page.waitForURL(
    (url) => url.pathname.startsWith('/app') && !/login|verif|whatsapp|onboard/i.test(url.pathname),
    { timeout: LOGIN_TIMEOUT },
  );

  // Pastikan halaman yang dilindungi tidak lagi redirect ke /app/login
  await page.goto('/app/post/new');
  await expect(page).not.toHaveURL(/\/app\/login/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
