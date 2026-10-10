import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './tests/support/auth';

export default defineConfig({
  testDir: './tests',
  /* Jalankan test secara paralel */
  fullyParallel: true,

  /* Gagal di CI jika tidak sengaja meninggalkan test.only */
  forbidOnly: !!process.env.CI,

  /* Jumlah retry di CI */
  retries: process.env.CI ? 2 : 0,

  /* Batasi worker di CI */
  workers: process.env.CI ? 1 : undefined,

  /* Format laporan test */
  reporter: 'html',

  /* Pengaturan global */
  use: {
    baseURL: 'https://terpadi.com',
    headless: false, // Menampilkan browser (via WSLg)
    trace: 'on-first-retry',
    locale: 'id-ID',
    /* Terpadi butuh lokasi; pakai lokasi Jakarta supaya popup izin lokasi tidak muncul */
    geolocation: { latitude: -6.2607, longitude: 106.8137 },
    permissions: ['geolocation'],
  },

  projects: [
    /* j00: login Google manual/otomatis -> simpan context ke storageState */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      timeout: 5 * 60 * 1000, // beri waktu untuk login Google + verifikasi WhatsApp
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          // Kurangi deteksi "browser ini mungkin tidak aman" dari Google
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },

    /* Skenario tanpa login */
    {
      name: 'publik',
      grepInvert: /@auth/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Skenario yang butuh login: memakai storageState dari project setup */
    {
      name: 'auth',
      grep: /@auth/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
    },
  ],
});
