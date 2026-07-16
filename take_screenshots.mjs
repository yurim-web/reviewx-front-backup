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
    id: 'naver_demo_001', email: 'reviewer@naver.com', name: '김은지',
    nickname: '은지블로그', role: 'user', status: 'ACTIVE', profile_image: null,
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
// 03 배송형 상세는 auth 필요 → ctx2(user)에서 캡처
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

// React 실행 전 모든 페이지에 auth 사전 주입 → 리다이렉트 경쟁 조건 방지
const _mockUser2 = {
  id: 'naver_demo_001', email: 'reviewer@naver.com', name: '김은지',
  nickname: '은지블로그', role: 'user', status: 'ACTIVE', profile_image: null,
  phone: '010-1234-5678', address: 'Seoul', detail_address: '701', postal_code: '06236',
};
const _mockToken2 = 'mock_token_portfolio_demo';
await ctx2.addInitScript(({ user, token }) => {
  localStorage.setItem('reviewx_auth_user_user', JSON.stringify(user));
  localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
  localStorage.setItem('reviewx_auth_token_user', token);
  localStorage.setItem('reviewx_auth_token', token);
}, { user: _mockUser2, token: _mockToken2 });

const pg2 = await ctx2.newPage();
// 리뷰어 프로필 API intercept: fetchReviewerProfile이 wrapper째 반환하는 버그 우회 → 직접 data 반환
await pg2.route('**/api/v1/reviewer/mypage/profile', async (route) => {
  await route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify({
    user: { userId: 2, role: 'REVIEWER', name: '김은지', email: 'kimeunji@gmail.com', phoneNum: '010-2222-2222', address: '서울시 서초구 서초대로 456', status: 'ACTIVE', profileImage: { filePath: '/images/mypage/profile.svg' } },
    reviewerProfile: { reviewerId: 2, grade: 'NORMAL', sex: 'W', birthDate: '1998-03-03' }
  }) });
});

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
  await save(pg2, name, 500);
}
// 유저 알림 페이지
try {
  await pg2.goto(BASE_URL + '/user/notification', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await save(pg2, '33_user_notification.png');

// 콘텐츠 등록 모달 (선정 탭 — 콘텐츠 등록 버튼 클릭)
try {
  await pg2.goto(BASE_URL + '/user/campaign_management/selected', { waitUntil: 'domcontentloaded', timeout: 15000 });
} catch { /* 무시 */ }
await pg2.waitForTimeout(4000);
try {
  const btnTexts = await pg2.locator('button').allTextContents();
  console.log('  selected page buttons: ' + JSON.stringify(btnTexts.filter(t => t.trim())));
  await pg2.waitForSelector('button:has-text("콘텐츠 등록")', { timeout: 6000 });
  await pg2.locator('button:has-text("콘텐츠 등록")').first().click();
  await pg2.waitForTimeout(2000);
} catch (e) { console.log('  content modal click failed: ' + e.message); }
await save(pg2, '36_user_content_modal.png', 400);

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
// 03 배송형 상세 캡처 (신청 버튼 클릭 전 — user auth 있어야 페이지가 로드됨)
await save(pg2, '03_delivery_detail.png', 500);
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

// SVG 이미지 fix: Next.js가 dangerouslyAllowSVG 없이 /_next/image로 SVG를 거부함
// → SVG 요청은 /public 폴더에서 직접 파일 읽어 반환
const PUBLIC_DIR = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'public');
await pg3.route('**/_next/image**', async (route) => {
  try {
    const reqUrl = new URL(route.request().url());
    const imgUrl = decodeURIComponent(reqUrl.searchParams.get('url') || '');
    if (imgUrl.endsWith('.svg')) {
      const filePath = path.join(PUBLIC_DIR, imgUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        await route.fulfill({ status: 200, contentType: 'image/svg+xml', body: fs.readFileSync(filePath) });
        return;
      }
    }
  } catch { /* ignore */ }
  await route.continue();
});

// 진행 탭 캠페인 데이터 주입: mock서버가 SELECTING 캠페인 0개 반환 → static fallback(brandLogo 없음)
// → 플랫폼 로고(naverblog/reels/insta SVG)가 표시되도록 캠페인 데이터 직접 주입
await pg3.route('**/partner/campaign_management/SELECTING**', async (route) => {
  await route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({
      result: 'success', generatedAt: new Date().toISOString(),
      data: {
        campaigns: [
          {
            campaignId: 4038, title: 'DIY 인테리어 미션',
            campaignType: 'mission', platform: 'naver_blog',
            thumbnailUrl: '/images/main/campaign_img/eximg_3.png',
            category: '생활', points: 10000, status: 'PURCHASING',
            recruitCount: 10, currentApplicants: 28, selectedCount: 10,
            applicationStartDate: '2026-07-05', applicationEndDate: '2026-08-01',
            campaignStartDate: '2026-08-03', campaignEndDate: '2026-09-01',
            createdAt: '2026-07-05T00:00:00.000Z', updatedAt: '2026-07-05T00:00:00.000Z',
            waitingCount: 3, submittedCount: 4, approvedCount: 3,
          },
          {
            campaignId: 3001, title: '테크 기자단',
            campaignType: 'reporter', platform: 'instagram_reels',
            thumbnailUrl: '/images/main/campaign_img/eximg_6.png',
            category: '디지털', points: 15000, status: 'PURCHASING',
            recruitCount: 3, currentApplicants: 3, selectedCount: 3,
            applicationStartDate: '2026-07-01', applicationEndDate: '2026-07-25',
            campaignStartDate: '2026-07-27', campaignEndDate: '2026-08-31',
            createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z',
            waitingCount: 1, submittedCount: 1, approvedCount: 1,
          },
          {
            campaignId: 4060, title: '디톡스 주스 클렌즈 기자단',
            campaignType: 'reporter', platform: 'naver_blog',
            thumbnailUrl: '/images/main/campaign_img/eximg_1.png',
            category: '식품', points: 8000, status: 'SELECTING',
            recruitCount: 5, currentApplicants: 12, selectedCount: 0,
            applicationStartDate: '2026-07-01', applicationEndDate: '2026-07-20',
            campaignStartDate: '2026-07-22', campaignEndDate: '2026-08-15',
            createdAt: '2026-07-01T00:00:00.000Z', updatedAt: '2026-07-01T00:00:00.000Z',
            waitingCount: 0, submittedCount: 0, approvedCount: 0,
          },
        ],
        hasNext: false, currentPage: 0,
      },
    }),
  });
});

// 캠페인 관리 통계 route intercept: 진행 탭 카운트 수정 (0 → 3)
await pg3.route('**/partner/campaign_management', async (route) => {
  try {
    const response = await route.fetch();
    const json = await response.json();
    if (json?.data?.stats) {
      json.data.stats.ongoingCount = 3;
    }
    await route.fulfill({ response, json });
  } catch { await route.continue(); }
});

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
  // 세션 없음 → 폼 로그인 시도 (waitForURL로 redirect 확실히 대기)
  try {
    await pg3.fill("input[id='email']", 'test@test.com');
    await pg3.fill("input[id='password']", 'cjdaud1!');
    await pg3.click("button[type='submit']");
    await pg3.waitForURL(url => !url.includes('/partner/login'), { timeout: 10000 }).catch(() => {});
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
  await pg3.goto(BASE_URL + '/partner/point/all', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '26_partner_point.png', 3000);
  await pg3.goto(BASE_URL + '/partner/mypage', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '27_partner_mypage.png');
  // 패널티 탭 캡처
  await pg3.goto(BASE_URL + '/partner/campaign_management/penalty', { waitUntil: 'load', timeout: 20000 }); await save(pg3, '40_partner_cm_penalty.png', 2500);
  // 캠페인 등록 페이지 캡처
  // getCampaignCreatePage()가 data.data를 spread하는데 mock 서버는 flat 구조 반환 → data 래퍼 추가 intercept
  await pg3.route('http://localhost:3001/partner/campaign/create', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          result: 'OK', generatedAt: new Date().toISOString(),
          data: {
            partner: { partnerId: 501, businessName: '마크엑스컴퍼니', currentPoint: 425000 },
            categories: [
              { categoryId: 1, categoryName: '식품' }, { categoryId: 2, categoryName: '뷰티' },
              { categoryId: 3, categoryName: '가전' }, { categoryId: 4, categoryName: '생활' },
              { categoryId: 5, categoryName: '패션' },
            ],
            channels: [
              { channelId: 1, channelName: 'NAVER_BLOG' }, { channelId: 2, channelName: 'NAVER_CLIP' },
              { channelId: 3, channelName: 'INSTAGRAM' }, { channelId: 4, channelName: 'INSTAGRAM_REELS' },
            ],
            regions: [
              { regionId: 100, name: '서울특별시', level: 1, parentId: null },
              { regionId: 200, name: '경기도', level: 1, parentId: null },
            ],
          }
        })
      });
    } else { await route.continue(); }
  });
  await pg3.goto(BASE_URL + '/partner/campaign/create/delivery', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
  await pg3.waitForSelector('text=캠페인 제목', { timeout: 15000 }).catch(() => {});
  await save(pg3, '41_partner_campaign_create.png', 500);
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

await pg4.goto(BASE_URL + '/manager/login', { waitUntil: 'load', timeout: 20000 });
await pg4.waitForTimeout(1500);
await pg4.screenshot({ path: path.join(OUTPUT_DIR, '28_manager_login.png'), clip: { x: 240, y: 0, width: 1440, height: 900 } });
console.log('  ok 28_manager_login.png');

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
  // 캠페인 진행현황: 상태 필터 드롭다운 열린 상태로 캡처 (FilterButton은 div 컴포넌트)
  await gotoManager('/manager_ga/campaign/progress', '30_manager_campaigns.png', async () => {
    try {
      await pg4.locator('span').filter({ hasText: /^상태$/ }).first().click({ timeout: 3000 });
      await pg4.waitForTimeout(700);
    } catch (e) { console.log('  filter click failed: ' + e.message); }
  });
  await gotoManager('/manager_ga/member/reviewers', '31_manager_reviewers.png');
  await gotoManager('/manager_ga/member/partners', '32_manager_partners.png');
  // 상세 페이지 - 리뷰어 채널 데이터 주입 (hook이 user_accounts localStorage에서 채널 stats 보강)
  await pg4.evaluate(() => {
    const userAccounts = [
      {
        id: 'user_kakao_001',
        channel_details: [
          { name: '네이버 블로그', url: 'https://blog.naver.com/catbrushing', status: 'connected' },
          { name: '네이버 클립', url: 'https://clip.naver.com/catbrushing', status: 'connected' },
          { name: '인스타그램', url: 'https://instagram.com/cat_brushing', status: 'connected' },
          { name: '유튜브', url: '', status: 'disconnected' },
        ]
      }
    ];
    localStorage.setItem('user_accounts', JSON.stringify(userAccounts));
  });
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
