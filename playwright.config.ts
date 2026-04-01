import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default defineConfig({
  globalSetup: './tests/ga-global-setup',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
  },
  /**
   * ✅ 테스트 환경(기기) 설정 — 자유롭게 추가/삭제 가능
   *
   * Playwright 내장 기기 목록 (devices['기기명']):
   *   PC     : 'Desktop Chrome' | 'Desktop Firefox' | 'Desktop Safari'
   *   아이폰  : 'iPhone 15 Pro' | 'iPhone 14' | 'iPhone 13'  → Safari(WebKit) 자동 적용
   *   안드로이드: 'Galaxy S23' | 'Pixel 7'
   *   태블릿  : 'iPad Pro 11' | 'iPad Air 4' | 'iPad Mini 6'
   *
   * 예시) 태블릿 추가:
   * { name: 'Tablet iPad Pro', use: { ...devices['iPad Pro 11'] } },
   */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone 15 Safari',
      use: { ...devices['iPhone 15 Pro'] },
    },
  ],
});
