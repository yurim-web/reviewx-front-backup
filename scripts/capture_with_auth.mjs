import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'c:/tmp/reviewx_screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Mock reviewer auth user (matches AuthUser type)
const MOCK_USER = {
  id: 'user_kakao_001',
  email: '',
  name: '카카오유저',
  role: 'user',
};

const MOCK_TOKEN = 'mock_token_for_screenshot';

async function injectAuth(page) {
  await page.addInitScript(([user, token]) => {
    localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
    localStorage.setItem('reviewx_auth_token', token);
  }, [MOCK_USER, MOCK_TOKEN]);
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); // Mobile viewport (앱처럼)
  const page = await ctx.newPage();

  // Go to home to extract campaign links first (without auth to get links)
  const tempPage = await ctx.newPage();
  await tempPage.goto('http://localhost:3002/user', { timeout: 15000 });
  await tempPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await tempPage.waitForTimeout(2000);

  const links = await tempPage.$$eval('a[href*="/campaign/"]', els =>
    els.map(el => el.href).filter(href => href.match(/\/campaign\/(delivery|visit|mission|review|reporter)\/\d+/))
  );
  await tempPage.close();

  const byType = {};
  for (const link of links) {
    const m = link.match(/\/campaign\/(delivery|visit|mission|review|reporter)\/(\d+)/);
    if (m && !byType[m[1]]) byType[m[1]] = link;
  }
  console.log('Found types:', Object.keys(byType));

  const typeMap = {
    delivery: '배송형',
    visit: '방문형',
    mission: '미션형',
    review: '구매평',
    reporter: '기자단',
  };

  for (const [type, url] of Object.entries(byType)) {
    const label = typeMap[type];
    console.log(`\n--- ${label} (${type}) ---`);

    // New page with auth injected
    const authPage = await ctx.newPage();
    await authPage.addInitScript(([user, token]) => {
      localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
      localStorage.setItem('reviewx_auth_token', token);
    }, [MOCK_USER, MOCK_TOKEN]);

    await authPage.goto(url, { timeout: 15000 });
    await authPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await authPage.waitForTimeout(2000);

    // Full page screenshot
    const pagePath = `${OUT_DIR}/${type}_page.png`;
    await authPage.screenshot({ path: pagePath, fullPage: true });
    console.log(`  ✅ Page: ${pagePath}`);

    // Find and click 신청 button
    const btns = await authPage.locator('button').allInnerTexts();
    console.log('  Buttons:', btns.filter(t => t.trim()).slice(0, 8));

    const applyBtn = authPage.locator('button').filter({ hasText: /신청/ }).first();
    const btnCount = await applyBtn.count();

    if (btnCount > 0) {
      await applyBtn.scrollIntoViewIfNeeded().catch(() => {});
      await applyBtn.click({ timeout: 5000 }).catch(e => console.log('  Click err:', e.message));
      await authPage.waitForTimeout(2000);

      // Check if modal opened (look for modal/dialog)
      const modalVisible = await authPage.locator('[class*="modal"], [class*="Modal"], dialog').count();
      console.log('  Modal elements found:', modalVisible);

      const modalPath = `${OUT_DIR}/${type}_modal.png`;
      await authPage.screenshot({ path: modalPath, fullPage: false });
      console.log(`  ✅ Modal screenshot: ${modalPath}`);
    } else {
      console.log('  ⚠️  No 신청 button');
    }

    await authPage.close();
  }

  await browser.close();
  console.log('\nDone!');
}

capture().catch(console.error);
