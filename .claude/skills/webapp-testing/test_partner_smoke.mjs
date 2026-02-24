import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3002';
const PAGES = [
  ['/partner/login', '파트너 로그인'],
  ['/partner/find-account', '파트너 계정찾기'],
  ['/partner/mypage', '파트너 마이페이지'],
  ['/partner/mypage/edit', '파트너 내정보 수정'],
  ['/partner/mypage/profile', '파트너 프로필'],
  ['/partner/campaign_management/scheduled', '캘페인관리 예정'],
  ['/partner/campaign_management/progress', '캘페인관리 진행'],
  ['/partner/notification', '파트너 알림'],
];
const REACT_ERR_PATTERNS = ['Unhandled Runtime Error','Application error','TypeError:','ReferenceError:','Cannot read properties'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();

const authPage = await ctx.newPage();
await authPage.goto(BASE_URL);
await authPage.waitForLoadState('networkidle');
await authPage.evaluate(() => {
  localStorage.setItem('reviewx_auth_user', JSON.stringify({
    id: 'partner_test_001', email: 'test@partner.com',
    name: '테스트파트너', role: 'partner', business_name: '테스트주식회사'
  }));
  localStorage.setItem('reviewx_auth_role', 'partner');
  localStorage.setItem('reviewx_auth_token', 'mock_token_partner');
});
await authPage.close();

const results = [];
for (const [path, label] of PAGES) {
  const url = BASE_URL + path;
  const consoleErrs = [];
  const page = await ctx.newPage();
  page.on('console', msg => { if (msg.type() === 'error') consoleErrs.push(msg.text()); });
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const status = resp ? resp.status() : 0;
    const html = await page.content();
    const reactErrs = REACT_ERR_PATTERNS.filter(p => html.toLowerCase().includes(p.toLowerCase()));
    const jsErrs = consoleErrs.filter(e => REACT_ERR_PATTERNS.some(p => e.toLowerCase().includes(p.toLowerCase())));
    const ok = status === 200 && !reactErrs.length && !jsErrs.length;
    results.push({ label, status, ok, reactErrs, jsErrs: jsErrs.slice(0, 2) });
  } catch (e) {
    results.push({ label, status: 0, ok: false, reactErrs: [], jsErrs: [String(e).slice(0, 80)] });
  } finally {
    await page.close();
  }
}
await browser.close();

console.log(String.fromCharCode(10) + "=".repeat(55));
console.log('  파트너 페이지 스모크 테스트');
console.log('='.repeat(55));
for (const r of results) {
  const icon = r.ok ? 'PASS' : 'FAIL';
  console.log(icon + ' [' + r.status + '] ' + r.label);
  if (r.reactErrs.length) console.log('    React: ' + r.reactErrs.join(', '));
  if (r.jsErrs.length) console.log('    JS: ' + r.jsErrs.join(', '));
}
const passed = results.filter(r => r.ok).length;
console.log('='.repeat(55));
console.log('결과: ' + passed + '/' + results.length + ' 통과');
console.log('='.repeat(55));
process.exit(passed === results.length ? 0 : 1);