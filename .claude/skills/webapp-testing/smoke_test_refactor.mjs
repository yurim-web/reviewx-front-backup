/**
 * 리팩토링 검증 스모크 테스트 (Node.js Playwright)
 * - 사용자 페이지 + 파트너 페이지가 정상 렌더링되는지 확인
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = join(__dirname, 'screenshots');

if (!existsSync(SCREENSHOT_DIR)) {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
}

const PAGES_TO_TEST = [
  // User pages
  ['/user/login', 'user_login'],
  ['/user/signup', 'user_signup'],
  ['/user/find-account', 'user_find_account'],
  ['/user/campaign_management', 'user_campaign_mgmt'],
  ['/user/mypage', 'user_mypage'],
  ['/user/mypage/edit', 'user_mypage_edit'],
  ['/user/point/all', 'user_point_all'],
  ['/user/notification', 'user_notification'],
  // Partner pages
  ['/partner/login', 'partner_login'],
  ['/partner/campaign_management', 'partner_campaign_mgmt'],
  ['/partner/mypage', 'partner_mypage'],
  ['/partner/point/all', 'partner_point_all'],
  ['/partner/campaign/create/delivery', 'partner_create_delivery'],
  ['/partner/campaign/create/visit', 'partner_create_visit'],
  ['/partner/campaign/create/review', 'partner_create_review'],
  ['/partner/campaign/create/reporter', 'partner_create_reporter'],
  ['/partner/campaign/create/mission', 'partner_create_mission'],
];

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

// Suppress console noise
page.on('console', () => {});
page.on('pageerror', () => {});

console.log('\n' + '='.repeat(60));
console.log('  리팩토링 검증 스모크 테스트');
console.log('='.repeat(60));
console.log(`  대상: ${BASE_URL}`);
console.log('='.repeat(60) + '\n');

for (const [path, name] of PAGES_TO_TEST) {
  const url = BASE_URL + path;
  try {
    const response = await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    const status = response?.status() ?? '?';
    const ok = typeof status === 'number' && status < 400;

    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${name}.png`),
      fullPage: false,
    });

    // Check body has content
    const bodyText = await page.locator('body').innerText({ timeout: 3000 }).catch(() => '');
    const hasContent = bodyText.trim().length > 10;

    const sym = ok && hasContent ? '✓' : '✗';
    let msg = `${sym} [${status}] ${path}`;
    if (!hasContent) msg += ' (빈 페이지)';
    results.push([ok && hasContent, msg]);
    console.log(msg);
  } catch (e) {
    const errMsg = String(e).slice(0, 80);
    results.push([false, `✗ [ERR] ${path} → ${errMsg}`]);
    console.log(`✗ [ERR] ${path} → ${errMsg}`);
  }
}

await browser.close();

console.log('\n' + '='.repeat(60));
const passed = results.filter(([ok]) => ok).length;
const total = results.length;
console.log(`  결과: ${passed}/${total} 통과`);
console.log('='.repeat(60) + '\n');

const failed = results.filter(([ok]) => !ok);
if (failed.length > 0) {
  console.log('실패 페이지:');
  for (const [, msg] of failed) {
    console.log(`  ${msg}`);
  }
  process.exit(1);
} else {
  console.log('모든 페이지 정상 렌더링 확인!');
  process.exit(0);
}
