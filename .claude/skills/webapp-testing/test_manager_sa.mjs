import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3002';

const PAGES = [
  ['/manager_sa', '대시보드'],
  ['/manager_sa/campaign/progress', '캠페인 진행 현황'],
  ['/manager_sa/member/admins', '관리자 목록'],
  ['/manager_sa/member/blacklist', '차단 이력'],
  ['/manager_sa/member/partners', '파트너 목록'],
  ['/manager_sa/member/reviewers', '리뷰어 목록'],
  ['/manager_sa/settlement/withdrawal', '출금 현황'],
  ['/manager_sa/settlement/withdrawal_request', '출금 요청'],
  ['/manager_sa/settlement/payment_history', '결제 내역'],
];

const SCREENSHOT_DIR = '/tmp/manager_sa_screenshots';
try { mkdirSync(SCREENSHOT_DIR, { recursive: true }); } catch {}

const results = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const [path, name] of PAGES) {
  const url = BASE_URL + path;
  console.log(`\n[테스트] ${name} (${url})`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const bodyText = await page.innerText('body');
    const hasError = ['Application error', 'Error:', 'Unhandled Runtime Error', '500'].some(
      kw => bodyText.includes(kw)
    );

    const safeName = name.replace(/ /g, '_');
    const shotPath = join(SCREENSHOT_DIR, `${safeName}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    const status = hasError ? '❌ ERROR' : '✅ OK';
    results.push([name, status, shotPath]);
    console.log(`  ${status} - 스크린샷: ${shotPath}`);

    if (hasError) {
      const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
      console.log(`  오류 내용: ${lines.slice(0, 5).join(' | ')}`);
    }
  } catch (e) {
    results.push([name, `❌ EXCEPTION: ${e.message}`, '']);
    console.log(`  ❌ EXCEPTION: ${e.message}`);
  }
}

await browser.close();

console.log('\n\n========== 결과 요약 ==========');
for (const [name, status] of results) {
  console.log(`  ${status}  ${name}`);
}
console.log('================================');
