import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = String.raw`C:\Users\User\Desktop\project\reviewx-front\reviewx-front-backup\portfolio_screenshots`;
const BASE_URL = 'http://localhost:3002';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function save(page, filename, waitMs = 2200) {
  await page.waitForTimeout(waitMs);
  const filePath = path.join(OUTPUT_DIR, filename);
  await page.screenshot({ path: filePath, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log("  ok " + filename);
}

async function injectUserAuth(page) {
  const mockUser = {
    id: 'naver_demo_001', email: 'reviewer@naver.com', name: 'User',
    nickname: 'User', role: 'user', status: 'ACTIVE', profile_image: null,
    phone: '010-1234-5678', address: 'Seoul', detail_address: '701', postal_code: '06236',
  };
  const mockToken = 'mock_token_portfolio_demo';
  await page.evaluate(({ user, token }) => {
    localStorage.setItem('reviewx_auth_user_user', JSON.stringify(user));
    localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
    localStorage.setItem('reviewx_auth_token_user', token);
    localStorage.setItem('reviewx_auth_token', token);
  }, { user: mockUser, token: mockToken });
}

async function injectManagerAuth(page) {
  const mockManager = {
    id: 'admin_ga_001', email: 'manager_ga@test.com', name: '김관리',
    role: 'manager_ga', status: 'ACTIVE',
  };
  const mockToken = 'mock_admin_token_admin_ga_001_portfolio';
  await page.evaluate(({ user, token }) => {
    localStorage.setItem('reviewx_auth_user_manager_ga', JSON.stringify(user));
    localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
    localStorage.setItem('reviewx_auth_token_manager_ga', token);
    localStorage.setItem('reviewx_auth_token', token);
  }, { user: mockManager, token: mockToken });
}

const browser = await chromium.launch({ headless: true });

// ── 1. 공개 페이지 ──
console.log('--- public pages ---');
const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg1 = await ctx1.newPage();
await pg1.goto(BASE_URL + '/', { waitUntil: 'networkidle' }); await save(pg1, '01_home.png');
await pg1.goto(BASE_URL + '/campaign/delivery', { waitUntil: 'networkidle' }); await save(pg1, '02_delivery_list.png');
try {
  const href = await pg1.locator("a[href*='/campaign/delivery/']").first().getAttribute('href');
  await pg1.goto(BASE_URL + href, { waitUntil: 'networkidle' }); await save(pg1, '03_delivery_detail.png');
} catch { console.log('  skip delivery detail'); }
await pg1.goto(BASE_URL + '/campaign/visit', { waitUntil: 'networkidle' }); await save(pg1, '04_visit_list.png');
await pg1.goto(BASE_URL + '/campaign/review', { waitUntil: 'networkidle' }); await save(pg1, '05_review_list.png');
await pg1.goto(BASE_URL + '/campaign/reporter', { waitUntil: 'networkidle' }); await save(pg1, '06_reporter_list.png');
await pg1.goto(BASE_URL + '/campaign/mission', { waitUntil: 'networkidle' }); await save(pg1, '07_mission_list.png');
// 유저 로그인 — 최근 로그인(네이버) 배지 표시
await pg1.goto(BASE_URL + '/user/login', { waitUntil: 'networkidle' });
await pg1.evaluate(() => localStorage.setItem('reviewx_last_login_provider', 'naver'));
await pg1.reload({ waitUntil: 'networkidle' });
await save(pg1, '08_user_login.png');
await ctx1.close();

// ── 2. 유저 페이지 (localStorage 주입) ──
console.log('--- user pages ---');
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg2 = await ctx2.newPage();
await pg2.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
await injectUserAuth(pg2);
for (const [url, name] of [
  ['/user/campaign_management/all', '09_user_campaign_all.png'],
  ['/user/campaign_management/applied', '10_user_campaign_applied.png'],
  ['/user/campaign_management/selected', '11_user_campaign_selected.png'],
  ['/user/campaign_management/completed', '12_user_campaign_completed.png'],
  ['/user/campaign_management/cancelled', '13_user_campaign_cancelled.png'],
  ['/user/point/all', '14_user_point.png'],
  ['/user/mypage/profile', '15_user_mypage_profile.png'],
  ['/user/mypage/edit', '16_user_mypage_edit.png'],
]) {
  try {
    await pg2.goto(BASE_URL + url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch { /* 리다이렉트 중단 무시 */ }
  await pg2.waitForTimeout(2500);
  if (pg2.url().includes('login')) {
    await pg2.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded' });
    await injectUserAuth(pg2);
    try {
      await pg2.goto(BASE_URL + url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch { /* 무시 */ }
    await pg2.waitForTimeout(2500);
  }
  await save(pg2, name, 500);
}
// 유저 알림 페이지
try {
  await pg2.goto(BASE_URL + '/user/notification', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await save(pg2, '33_user_notification.png');

// 캠페인 신청 모달 (배송형 961 — 모크서버 날짜 인터셉트 후 신청 버튼 클릭)
// 모크서버가 2027년 날짜를 반환하므로 route로 현재 범위로 오버라이드
await pg2.route('**/api/v1/reviewer/campaign/DELIVERY/961', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  if (json.data) {
    json.data.recruitStartAt = '2026-07-01T00:00:00+09:00';
    json.data.recruitEndAt   = '2026-08-30T23:59:59+09:00';
    if (json.data.recruit) {
      json.data.recruit.recruitStartAt = '2026-07-01T00:00:00+09:00';
      json.data.recruit.recruitEndAt   = '2026-08-30T23:59:59+09:00';
    }
  }
  await route.fulfill({ response, json });
});
try {
  await pg2.goto(BASE_URL + '/campaign/delivery/961', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await pg2.waitForTimeout(3500);
try {
  const btn = pg2.locator('button[class*="apply_button"]');
  const btnText = await btn.first().textContent().catch(() => '?');
  console.log('  apply button text: ' + btnText);
  await btn.first().click({ timeout: 3000 });
  await pg2.waitForTimeout(2200);
} catch (e) { console.log('  apply modal click failed: ' + e.message); }
await save(pg2, '34_delivery_apply_modal.png', 400);
await pg2.unroute('**/api/v1/reviewer/campaign/DELIVERY/961');
await ctx2.close();

// ── 3. 파트너 페이지 (mock 서버 세션 or 폼 로그인) ──
console.log('--- partner pages ---');
const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg3 = await ctx3.newPage();

// 로그인 페이지 캡처 (리다이렉트 전)
await pg3.goto(BASE_URL + '/partner/login', { waitUntil: 'domcontentloaded' });
await pg3.waitForTimeout(600);
await save(pg3, '17_partner_login.png', 100);

// 세션 확인 (networkidle 대기)
await pg3.waitForLoadState('networkidle');
await pg3.waitForTimeout(1500);
const partnerUrl = pg3.url();
console.log('  partner url: ' + partnerUrl);

if (!partnerUrl.includes('login')) {
  console.log('  partner session active');
} else {
  // 세션 없음 → 폼 로그인 시도
  try {
    await pg3.fill("input[id='email']", 'test@test.com');
    await pg3.fill("input[id='password']", 'cjdaud1!');
    await pg3.click("button[type='submit']");
    await pg3.waitForLoadState('networkidle');
    await pg3.waitForTimeout(2000);
    console.log('  partner after login: ' + pg3.url());
  } catch (e) { console.log('  partner login err: ' + e.message); }
}

if (!pg3.url().includes('login')) {
  await save(pg3, '18_partner_home.png');
  await pg3.goto(BASE_URL + '/partner/campaign_management', { waitUntil: 'networkidle' }); await save(pg3, '19_partner_cm.png');
  for (const [t, n] of [
    ['scheduled', '20_partner_cm_scheduled.png'],
    ['applied', '21_partner_cm_applied.png'],
    ['progress', '22_partner_cm_progress.png'],
    ['completed', '23_partner_cm_completed.png'],
  ]) {
    await pg3.goto(BASE_URL + '/partner/campaign_management/' + t, { waitUntil: 'networkidle' }); await save(pg3, n);
  }
  await pg3.goto(BASE_URL + '/partner/campaign_application/delivery/961', { waitUntil: 'networkidle' }); await save(pg3, '24_partner_application.png');
  await pg3.goto(BASE_URL + '/partner/campaign_contents/delivery/961', { waitUntil: 'networkidle' }); await save(pg3, '25_partner_contents.png');
  await pg3.goto(BASE_URL + '/partner/point', { waitUntil: 'networkidle' }); await save(pg3, '26_partner_point.png');
  await pg3.goto(BASE_URL + '/partner/mypage', { waitUntil: 'networkidle' }); await save(pg3, '27_partner_mypage.png');
} else {
  console.log('  partner login failed, skipping partner pages');
}
await ctx3.close();

// ── 4. 매니저 페이지 (localStorage 주입) ──
console.log('--- manager pages ---');
const ctx4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg4 = await ctx4.newPage();
await pg4.goto(BASE_URL + '/manager/login', { waitUntil: 'networkidle' }); await save(pg4, '28_manager_login.png');

// localStorage 직접 주입 (폼 로그인 대신)
await pg4.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
await injectManagerAuth(pg4);
try {
  await pg4.goto(BASE_URL + '/manager_ga', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* redirect 중단 무시 */ }
await pg4.waitForTimeout(3000);
console.log('  manager url: ' + pg4.url());
if (!pg4.url().includes('login') && !pg4.url().includes('manager/login')) {
  await save(pg4, '29_manager_home.png');
  try { await pg4.goto(BASE_URL + '/manager_ga/campaign/progress', { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
  await save(pg4, '30_manager_campaigns.png');
  try { await pg4.goto(BASE_URL + '/manager_ga/member/reviewers', { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
  await save(pg4, '31_manager_reviewers.png');
  try { await pg4.goto(BASE_URL + '/manager_ga/member/partners', { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
  await save(pg4, '32_manager_partners.png');
} else {
  console.log('  manager auth failed, skipping manager pages');
}
await ctx4.close();

await browser.close();
const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png')).sort();
console.log('\n=== Done: ' + files.length + ' screenshots ===');
files.forEach(f => console.log('  ' + f));
