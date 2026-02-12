import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-mobile',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  timeout: 600000, // 10분
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'Galaxy S23',
      use: {
        ...devices['Galaxy S23'],
      },
    },
  ],
});
