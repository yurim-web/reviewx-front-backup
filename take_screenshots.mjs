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
const g1 = (url) => pg1.goto(BASE_URL + url, { waitUntil: 'load', timeout: 20000 }).catch(() => {});
await g1('/'); await save(pg1, '01_home.png');
await g1('/campaign/delivery'); await save(pg1, '02_delivery_list.png');
try {
  const href = await pg1.locator("a[href*='/campaign/delivery/']").first().getAttribute('href');
  await g1(href); await save(pg1, '03_delivery_detail.png');
} catch { console.log('  skip delivery detail'); }
await g1('/campaign/visit'); await save(pg1, '04_visit_list.png');
await g1('/campaign/review'); await save(pg1, '05_review_list.png');
await g1('/campaign/reporter'); await save(pg1, '06_reporter_list.png');
await g1('/campaign/mission'); await save(pg1, '07_mission_list.png');
// 유저 로그인 — 최근 로그인(네이버) 배지 표시
await g1('/user/login');
await pg1.evaluate(() => localStorage.setItem('reviewx_last_login_provider', 'naver'));
await pg1.reload({ waitUntil: 'load', timeout: 20000 }).catch(() => {});
await save(pg1, '08_user_login.png');

// 캠페인 필터 모달 열린 상태 (미션형 - 카테고리 클릭)
await g1('/campaign/mission');
await pg1.waitForTimeout(1200);
try {
  await pg1.locator('button:has-text("카테고리")').first().click({ timeout: 3000 });
  await pg1.waitForTimeout(1000);
} catch (e) { console.log('  filter modal click failed: ' + e.message); }
await save(pg1, '35_campaign_filter.png');

// 파트너 회원가입 페이지
await g1('/partner/signup');
await save(pg1, '37_partner_signup.png');

await ctx1.close();

// ── 2. 유저 페이지 (localStorage 주입) ──
console.log('--- user pages ---');
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg2 = await ctx2.newPage();
await pg2.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 }).catch(() => {});
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
  await pg2.waitForTimeout(4500);
  if (pg2.url().includes('login')) {
    await pg2.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 }).catch(() => {});
    await injectUserAuth(pg2);
    try {
      await pg2.goto(BASE_URL + url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch { /* 무시 */ }
    await pg2.waitForTimeout(4000);
  }
  await save(pg2, name, 500);
}
// 유저 알림 페이지
try {
  await pg2.goto(BASE_URL + '/user/notification', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await save(pg2, '33_user_notification.png');

// 콘텐츠 등록 모달 (선정 탭 — 콘텐츠 등록 버튼 클릭)
// auth 재주입 (이전 페이지 이동으로 만료될 수 있음)
await pg2.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 }).catch(() => {});
await injectUserAuth(pg2);
try {
  await pg2.goto(BASE_URL + '/user/campaign_management/selected', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await pg2.waitForTimeout(4000);
try {
  const btnTexts = await pg2.locator('button').allTextContents();
  console.log('  selected page buttons: ' + JSON.stringify(btnTexts.filter(t => t.trim())));
  // waitForSelector로 버튼이 나타날 때까지 대기
  await pg2.waitForSelector('button:has-text("콘텐츠 등록")', { timeout: 6000 });
  await pg2.locator('button:has-text("콘텐츠 등록")').first().click();
  await pg2.waitForTimeout(2000);
} catch (e) { console.log('  content modal click failed: ' + e.message); }
await save(pg2, '36_user_content_modal.png', 400);

// 캠페인 신청 모달 (배송형 961 — 모크서버 날짜 인터셉트 후 신청 버튼 클릭)
// auth 재주입 (신청 버튼은 로그인 상태에서만 표시)
await pg2.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 }).catch(() => {});
await injectUserAuth(pg2);
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

// 세션 확인 (load 대기)
await pg3.waitForLoadState('load').catch(() => {});
await pg3.waitForTimeout(2000);
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
  await pg3.goto(BASE_URL + '/partner/campaign_management', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '19_partner_cm.png');
  for (const [t, n] of [
    ['scheduled', '20_partner_cm_scheduled.png'],
    ['applied', '21_partner_cm_applied.png'],
    ['progress', '22_partner_cm_progress.png'],
    ['completed', '23_partner_cm_completed.png'],
  ]) {
    await pg3.goto(BASE_URL + '/partner/campaign_management/' + t, { waitUntil: 'load', timeout: 20000 }); await save(pg3, n);
  }
  await pg3.goto(BASE_URL + '/partner/campaign_application/delivery/961', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '24_partner_application.png');
  await pg3.goto(BASE_URL + '/partner/campaign_contents/delivery/961', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '25_partner_contents.png');
  await pg3.goto(BASE_URL + '/partner/point', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '26_partner_point.png');
  await pg3.goto(BASE_URL + '/partner/mypage', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '27_partner_mypage.png');
} else {
  console.log('  partner login failed, skipping partner pages');
}
await ctx3.close();

// ── 4. 매니저 페이지 (localStorage 주입) ──
console.log('--- manager pages ---');
// 1920px 뷰포트: 반응형 미구현 관리자 페이지 전체 표시
const ctx4 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const pg4 = await ctx4.newPage();

// 대시보드 반려/신고 차트: 7월 데이터 route intercept (정적 fallback이 3월 날짜라 차트 비어있음)
await pg4.route((url) => url.href.includes('/api/admin/campaigns/rejected') && !url.href.includes('/rejected/'), async (route) => {
  await route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify({
    result: 'OK', data: {
      rejectList: [
        { rejectId: 1, campaignId: 901, campaignTitle: '스킨케어 체험단', rejectCode: 'R001', rejectReason: '콘텐츠 품질 미달', processedBy: '관리자1', reviewerName: '홍길동', processedAt: '2026-07-03T14:23:00' },
        { rejectId: 2, campaignId: 902, campaignTitle: '식품 체험단', rejectCode: 'R002', rejectReason: '기한 초과', processedBy: '관리자1', reviewerName: '김철수', processedAt: '2026-07-05T09:45:00' },
        { rejectId: 3, campaignId: 903, campaignTitle: '뷰티 제품 리뷰', rejectCode: 'R003', rejectReason: '등록 정보 불일치', processedBy: '관리자2', reviewerName: '이영희', processedAt: '2026-07-08T16:12:00' },
        { rejectId: 4, campaignId: 904, campaignTitle: '패션 체험단', rejectCode: 'R001', rejectReason: '콘텐츠 품질 미달', processedBy: '관리자1', reviewerName: '박지민', processedAt: '2026-07-10T11:30:00' },
        { rejectId: 5, campaignId: 905, campaignTitle: '전자제품 리뷰', rejectCode: 'R002', rejectReason: '기한 초과', processedBy: '관리자2', reviewerName: '최수진', processedAt: '2026-07-12T13:55:00' },
        { rejectId: 6, campaignId: 906, campaignTitle: '여행 체험단', rejectCode: 'R004', rejectReason: '불성실 참여', processedBy: '관리자1', reviewerName: '정민준', processedAt: '2026-07-14T10:18:00' },
        { rejectId: 7, campaignId: 907, campaignTitle: '가구 체험단', rejectCode: 'R001', rejectReason: '콘텐츠 품질 미달', processedBy: '관리자2', reviewerName: '강동원', processedAt: '2026-07-15T15:42:00' },
      ],
      rejectStats: [], pagination: { total: 7, page: 1, size: 10 }
    }
  }) });
});
await pg4.route((url) => new URL(url.href).pathname === '/api/admin/reports', async (route) => {
  await route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify({
    result: 'OK', data: {
      reports: [
        { reportNumber: '000401', campaignTitle: '스킨케어 체험단', targetName: '홍길동', targetType: 'REVIEWER', targetUserId: 2001, inspector: '관리자1', inspectorType: 'ADMIN', reportCode: 'W012', reportCodeLabel: '허위 리뷰', reportCount: 1, processedAt: '2026-07-04T12:40:00' },
        { reportNumber: '000402', campaignTitle: '뷰티 제품 리뷰', targetName: '이영희', targetType: 'REVIEWER', targetUserId: 2002, inspector: '관리자2', inspectorType: 'ADMIN', reportCode: 'W011', reportCodeLabel: '스팸 콘텐츠', reportCount: 1, processedAt: '2026-07-07T18:56:00' },
        { reportNumber: '000403', campaignTitle: '식품 체험단', targetName: '김철수', targetType: 'REVIEWER', targetUserId: 2003, inspector: '관리자1', inspectorType: 'ADMIN', reportCode: 'W013', reportCodeLabel: '부적절한 내용', reportCount: 2, processedAt: '2026-07-10T14:30:00' },
        { reportNumber: '000404', campaignTitle: '패션 체험단', targetName: '박지민', targetType: 'REVIEWER', targetUserId: 2004, inspector: '관리자2', inspectorType: 'ADMIN', reportCode: 'W012', reportCodeLabel: '허위 리뷰', reportCount: 1, processedAt: '2026-07-13T10:20:00' },
        { reportNumber: '000405', campaignTitle: '전자제품 리뷰', targetName: '최수진', targetType: 'PARTNER', targetUserId: 501, inspector: '관리자1', inspectorType: 'ADMIN', reportCode: 'W013', reportCodeLabel: '부적절한 내용', reportCount: 1, processedAt: '2026-07-15T16:15:00' },
      ]
    }
  }) });
});

await pg4.goto(BASE_URL + '/manager/login', { waitUntil: 'load', timeout: 20000 }); await save(pg4, '28_manager_login.png');

// localStorage 직접 주입 (폼 로그인 대신)
await pg4.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 });
await injectManagerAuth(pg4);
try {
  await pg4.goto(BASE_URL + '/manager_ga', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* redirect 중단 무시 */ }
await pg4.waitForTimeout(3000);
// manager_ga가 아닌 경우 재시도 (auth 타이밍 이슈)
if (!pg4.url().includes('manager_ga')) {
  console.log('  manager auth retry...');
  await pg4.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 });
  await injectManagerAuth(pg4);
  await pg4.waitForTimeout(500);
  try {
    await pg4.goto(BASE_URL + '/manager_ga', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch { }
  await pg4.waitForTimeout(5000);
}
console.log('  manager url: ' + pg4.url());

// 매니저 페이지용 저장 함수 (클립 없이 전체 뷰포트 캡처)
const saveM = async (filename, waitMs = 2200) => {
  await pg4.waitForTimeout(waitMs);
  await pg4.screenshot({ path: path.join(OUTPUT_DIR, filename) });
  console.log('  ok ' + filename);
};

// 매니저 페이지 이동 + 인증 재주입 헬퍼 (beforeSave: 저장 전 액션 콜백)
const gotoManager = async (url, filename, beforeSave) => {
  try { await pg4.goto(BASE_URL + url, { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
  await pg4.waitForTimeout(2000);
  if (!pg4.url().includes(url)) {
    console.log('  re-auth for ' + filename);
    await pg4.goto(BASE_URL + '/', { waitUntil: 'load', timeout: 20000 });
    await injectManagerAuth(pg4);
    await pg4.waitForTimeout(500);
    try { await pg4.goto(BASE_URL + url, { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
    await pg4.waitForTimeout(4000);
  }
  console.log('  ' + filename + ' url: ' + pg4.url());
  if (beforeSave) { try { await beforeSave(); } catch(e) { console.log('  action failed: ' + e.message); } }
  await saveM(filename);
};

// 실제로 manager_ga에 있을 때만 캡처
if (pg4.url().includes('manager_ga')) {
  // 대시보드: 차트 렌더링 대기 후 fullPage 캡처
  await pg4.waitForTimeout(3500);
  await pg4.screenshot({ path: path.join(OUTPUT_DIR, '29_manager_home.png'), fullPage: true });
  console.log('  ok 29_manager_home.png');
  // 캠페인 진행현황: 상태 필터 드롭다운 열린 상태로 캡처
  await gotoManager('/manager_ga/campaign/progress', '30_manager_campaigns.png', async () => {
    try {
      await pg4.locator('button:has-text("상태")').first().click({ timeout: 3000 });
      await pg4.waitForTimeout(700);
    } catch (e) { console.log('  filter click failed: ' + e.message); }
  });
  await gotoManager('/manager_ga/member/reviewers', '31_manager_reviewers.png');
  await gotoManager('/manager_ga/member/partners', '32_manager_partners.png');
  // 상세 페이지
  await gotoManager('/manager_ga/member/reviewers/1', '38_manager_reviewer_detail.png');
  await gotoManager('/manager_ga/member/partners/1', '39_manager_partner_detail.png');
} else {
  console.log('  manager auth failed, skipping manager pages');
}
await ctx4.close();

await browser.close();
const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png')).sort();
console.log('\n=== Done: ' + files.length + ' screenshots ===');
files.forEach(f => console.log('  ' + f));
