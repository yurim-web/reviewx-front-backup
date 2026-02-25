/**
 * manager_ga 영역 스모크 테스트 (Node.js + Playwright)
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const PAGES = [
  ["대시보드",    "http://localhost:3002/manager_ga"],
  ["리뷰어 목록", "http://localhost:3002/manager_ga/member/reviewers"],
  ["파트너 목록", "http://localhost:3002/manager_ga/member/partners"],
  ["블랙리스트",  "http://localhost:3002/manager_ga/member/blacklist"],
  ["게시글",      "http://localhost:3002/manager_ga/community/posts"],
  ["캠페인 현황", "http://localhost:3002/manager_ga/campaign/progress"],
  ["알림",        "http://localhost:3002/manager_ga/notification"],
];

const SCREENSHOT_DIR = "/tmp/manager_ga_screenshots";
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const [name, url] of PAGES) {
  const page = await context.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    const status = response?.status() ?? 0;
    const bodyText = await page.locator('body').innerText();
    const isEmpty = bodyText.trim().length < 50;

    const safeName = name.replace(/\s+/g, '_');
    const shotPath = join(SCREENSHOT_DIR, `${safeName}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });

    results.push({
      name, url, status, isEmpty,
      consoleErrors: consoleErrors.slice(0, 5),
      screenshot: shotPath,
      ok: status < 400 && !isEmpty && consoleErrors.length === 0,
    });
  } catch (e) {
    results.push({ name, url, status: -1, error: e.message, consoleErrors, ok: false });
  } finally {
    await page.close();
  }
}

await browser.close();

// 결과 출력
console.log('\n' + '='.repeat(60));
console.log('  manager_ga 스모크 테스트 결과');
console.log('='.repeat(60));

let allOk = true;
for (const r of results) {
  const icon = r.ok ? '✅' : '❌';
  console.log(`\n${icon} [${r.name}]  ${r.url}`);
  if (r.status !== -1) {
    console.log(`   HTTP 상태: ${r.status}`);
    console.log(`   빈 화면:   ${r.isEmpty ? 'YES ⚠' : 'No'}`);
    if (r.consoleErrors.length > 0) {
      console.log(`   콘솔 에러: ${r.consoleErrors.length}개`);
      r.consoleErrors.forEach(e => console.log(`     - ${e.slice(0, 120)}`));
    } else {
      console.log('   콘솔 에러: 없음');
    }
    console.log(`   스크린샷:  ${r.screenshot}`);
  } else {
    console.log(`   오류:      ${r.error}`);
  }
  if (!r.ok) allOk = false;
}

console.log('\n' + '='.repeat(60));
if (allOk) {
  console.log('  🎉 모든 페이지 정상 (7/7)');
} else {
  const failCount = results.filter(r => !r.ok).length;
  console.log(`  ⚠  ${failCount}개 페이지 문제 발생`);
}
console.log('='.repeat(60) + '\n');
