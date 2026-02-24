/**
 * campaign_management 페이지 리팩토링 테스트
 * applied, scheduled, progress, completed, cancelled, extension-request 페이지 검증
 */

const { chromium } = require('playwright');

const testPages = [
  {
    name: 'applied',
    url: 'http://localhost:3002/partner/campaign_management/applied',
    emoji: '📝',
    statTab: '신청'
  },
  {
    name: 'scheduled',
    url: 'http://localhost:3002/partner/campaign_management/scheduled',
    emoji: '📅',
    statTab: '예정'
  },
  {
    name: 'progress',
    url: 'http://localhost:3002/partner/campaign_management/progress',
    emoji: '🚀',
    statTab: '진행'
  },
  {
    name: 'completed',
    url: 'http://localhost:3002/partner/campaign_management/completed',
    emoji: '✅',
    statTab: '종료'
  },
  {
    name: 'cancelled',
    url: 'http://localhost:3002/partner/campaign_management/cancelled',
    emoji: '❌',
    statTab: '취소'
  },
  {
    name: 'extension-request',
    url: 'http://localhost:3002/partner/campaign_management/extension-request',
    emoji: '⏰',
    statTab: '연장 요청'
  },
];

async function testPage(page, pageInfo) {
  const errors = [];
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors.push(`${msg.type()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${pageInfo.emoji} 테스트: ${pageInfo.name} (${pageInfo.statTab})`);
  console.log(`${'='.repeat(60)}`);

  try {
    console.log(`📍 접속: ${pageInfo.url}`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ 페이지 로딩 완료');

    const title = await page.title();
    console.log(`📄 페이지 타이틀: ${title}`);

    console.log('\n🔍 주요 요소 확인:');

    // CampaignManagementTabPage 컴포넌트 렌더링 확인
    const hasContainer = await page.locator('[class*="container"]').first().isVisible().catch(() => false);
    if (hasContainer) {
      console.log('  ✅ Container 렌더링');
    } else {
      console.log('  ⚠️ Container 확인 불가');
    }

    // 필터바 존재 확인
    const hasFilterBar = await page.locator('input[type="text"], select').first().isVisible().catch(() => false);
    if (hasFilterBar) {
      console.log('  ✅ 필터바 존재');
    } else {
      console.log('  ⚠️ 필터바 확인 불가');
    }

    // 캠페인 목록 또는 빈 상태 확인
    const hasCampaigns = await page.locator('[class*="campaign"]').first().isVisible().catch(() => false);
    if (hasCampaigns) {
      console.log('  ✅ 캠페인 목록 렌더링');
    } else {
      console.log('  ℹ️ 캠페인 없음 (정상)');
    }

    console.log('\n📋 콘솔 메시지:');
    if (consoleErrors.length > 0) {
      console.log(`  ⚠️ 콘솔 메시지 (${consoleErrors.length}개):`);
      consoleErrors.slice(0, 5).forEach(err => console.log(`    - ${err}`));
    } else {
      console.log('  ✅ 콘솔 에러 없음');
    }

    await page.screenshot({ path: `test-screenshots/management-${pageInfo.name}.png`, fullPage: false });
    console.log(`\n📸 스크린샷 저장: test-screenshots/management-${pageInfo.name}.png`);

    console.log(`\n${'='.repeat(60)}`);
    if (errors.length > 0) {
      console.log(`❌ 테스트 실패 (${errors.length}개 오류)`);
      errors.forEach(err => console.log(`  - ${err}`));
      return false;
    } else {
      console.log('✅ 테스트 통과');
      return true;
    }

  } catch (error) {
    console.log(`\n❌ 예외 발생: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 캠페인 관리 페이지 리팩토링 테스트');
  console.log('   6개 페이지 통합 검증');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const results = {};

  for (const pageInfo of testPages) {
    results[pageInfo.name] = await testPage(page, pageInfo);
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('📊 전체 테스트 결과');
  console.log('='.repeat(60));

  const passed = Object.values(results).filter(r => r).length;
  const total = testPages.length;

  testPages.forEach(pageInfo => {
    const status = results[pageInfo.name] ? '✅ 통과' : '❌ 실패';
    console.log(`${pageInfo.name.padEnd(20)}: ${status}`);
  });

  console.log(`\n총 ${total}개 중 ${passed}개 통과 (${Math.round(passed/total*100)}%)`);

  if (passed === total) {
    console.log('\n🎉 모든 테스트 통과!');
    process.exit(0);
  } else {
    console.log(`\n⚠️ ${total - passed}개 테스트 실패`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('테스트 실행 중 오류:', error);
  process.exit(1);
});
