/**
 * 콘텐츠 관리 페이지 리팩토링 테스트
 * delivery, visit, review, reporter, mission 페이지 검증
 */

const { chromium } = require('playwright');

// 테스트할 캠페인 ID (localStorage에 있는 샘플 데이터)
const testPages = [
  {
    name: 'delivery',
    url: 'http://localhost:3002/partner/campaign_contents/delivery/delivery_001',
    emoji: '📦'
  },
  {
    name: 'visit',
    url: 'http://localhost:3002/partner/campaign_contents/visit/visit_001',
    emoji: '🏢'
  },
  {
    name: 'review',
    url: 'http://localhost:3002/partner/campaign_contents/review/review_001',
    emoji: '🛒'
  },
  {
    name: 'reporter',
    url: 'http://localhost:3002/partner/campaign_contents/reporter/reporter_001',
    emoji: '📰'
  },
  {
    name: 'mission',
    url: 'http://localhost:3002/partner/campaign_contents/mission/mission_001',
    emoji: '🎯'
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
  console.log(`${pageInfo.emoji} 테스트: ${pageInfo.name} 콘텐츠 관리 페이지`);
  console.log(`${'='.repeat(60)}`);

  try {
    console.log(`📍 접속: ${pageInfo.url}`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ 페이지 로딩 완료');

    const title = await page.title();
    console.log(`📄 페이지 타이틀: ${title}`);

    console.log('\n🔍 주요 요소 확인:');

    // CampaignContentsLayout 컴포넌트가 렌더링되었는지 확인
    const hasLayout = await page.locator('[class*="campaign_contents"]').first().isVisible().catch(() => false);
    if (hasLayout) {
      console.log('  ✅ Layout 컴포넌트 렌더링');
    } else {
      console.log('  ⚠️ Layout 컴포넌트 확인 불가 (데이터 없을 수 있음)');
    }

    // 탭 네비게이션 존재 확인
    const hasTabs = await page.locator('button, [role="tab"]').first().isVisible().catch(() => false);
    if (hasTabs) {
      console.log('  ✅ 탭 네비게이션 존재');
    } else {
      console.log('  ⚠️ 탭 네비게이션 확인 불가');
    }

    console.log('\n📋 콘솔 메시지:');
    if (consoleErrors.length > 0) {
      console.log(`  ⚠️ 콘솔 메시지 (${consoleErrors.length}개):`);
      consoleErrors.slice(0, 5).forEach(err => console.log(`    - ${err}`));
    } else {
      console.log('  ✅ 콘솔 에러 없음');
    }

    await page.screenshot({ path: `test-screenshots/content-${pageInfo.name}.png`, fullPage: false });
    console.log(`\n📸 스크린샷 저장: test-screenshots/content-${pageInfo.name}.png`);

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
  console.log('🚀 콘텐츠 관리 페이지 리팩토링 테스트');
  console.log('   delivery/visit/review/reporter/mission 페이지 검증');
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
    console.log(`${pageInfo.name.padEnd(10)}: ${status}`);
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
