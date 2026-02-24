import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3002';
const PAGES = [
  ['/user/login', '유저 로그인'],
  ['/user/find-account', '계정찾기'],
  ['/user/signup', '회원가입'],
  ['/user/notification', '알림'],
  ['/user/mypage', '마이페이지'],
  ['/user/mypage/edit', '내정보 수정'],
  ['/user/mypage/profile', '프로필'],
  ['/user/mypage/address', '주소'],
  ['/user/mypage/channel', '채널'],
  ['/user/mypage/channel/connect', '채널연결'],
  ['/user/point/all', '포인트 전체'],
  ['/user/campaign_management', '캠페인관리'],
];
const REACT_ERR = ['Unhandled Runtime Error','Application error','TypeError:','ReferenceError:','Cannot read properties'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();

// Set mock auth
const ap = await ctx.newPage();
await ap.goto(BASE_URL);
await ap.waitForLoadState('networkidle');
await ap.evaluate(() => {
  localStorage.setItem('reviewx_auth_user', JSON.stringify({
    id: 'user_test_001', email: 'test@user.com', name: '테스트유저', role: 'reviewer'
  }));
  localStorage.setItem('reviewx_auth_role', 'reviewer');
  localStorage.setItem('reviewx_auth_token', 'mock_token_user');
});
await ap.close();

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
    const reactErrs = REACT_ERR.filter(p => html.toLowerCase().includes(p.toLowerCase()));
    const jsErrs = consoleErrs.filter(e => REACT_ERR.some(p => e.toLowerCase().includes(p.toLowerCase())));
    const ok = status === 200 && !reactErrs.length && !jsErrs.length;
    results.push({ label, status, ok, reactErrs, jsErrs: jsErrs.slice(0,2) });
  } catch(e) {
    results.push({ label, status: 0, ok: false, reactErrs: [], jsErrs: [String(e).slice(0,80)] });
  } finally {
    await page.close();
  }
}
await browser.close();

console.log('\n' + '='.repeat(55));
console.log('  유저 페이지 최종 스모크 테스트');
console.log('='.repeat(55));
for (const r of results) {
  const icon = r.ok ? '✅' : '❌';
  console.log(`${icon} [${r.status}] ${r.label}`);
  if (r.reactErrs.length) console.log(`   React: ${r.reactErrs.join(', ')}`);
  if (r.jsErrs.length) console.log(`   JS: ${r.jsErrs.join(', ')}`);
}
const passed = results.filter(r => r.ok).length;
console.log('='.repeat(55));
console.log(`결과: ${passed}/${results.length} 통과`);
console.log('='.repeat(55));
process.exit(passed === results.length ? 0 : 1);
