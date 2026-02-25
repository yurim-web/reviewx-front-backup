import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'c:/tmp/reviewx_screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // Go to home and extract campaign links
  await page.goto('http://localhost:3002/user', { timeout: 15000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Extract all campaign links
  const links = await page.$$eval('a[href*="/campaign/"]', els =>
    els.map(el => el.href).filter(href => href.match(/\/campaign\/(delivery|visit|mission|review|reporter)\/\d+/))
  );

  console.log('Found campaign links:', links.length);

  // Deduplicate by type
  const byType = {};
  for (const link of links) {
    const m = link.match(/\/campaign\/(delivery|visit|mission|review|reporter)\/(\d+)/);
    if (m && !byType[m[1]]) {
      byType[m[1]] = { url: link, id: m[2] };
    }
  }

  const typeMap = {
    delivery: '배송형',
    visit: '방문형',
    mission: '미션형',
    review: '구매평',
    reporter: '기자단',
  };

  for (const [type, { url }] of Object.entries(byType)) {
    const label = typeMap[type];
    console.log(`\nCapturing ${label}: ${url}`);

    await page.goto(url, { timeout: 15000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Full page
    const pagePath = `${OUT_DIR}/${type}_page.png`;
    await page.screenshot({ path: pagePath, fullPage: true });
    console.log(`  ✅ Page: ${pagePath}`);

    // Try to find 신청하기 button
    const btns = await page.locator('button').allInnerTexts();
    console.log('  Buttons found:', btns.slice(0, 10));

    const applyBtn = page.locator('button').filter({ hasText: /신청/ }).first();
    const btnCount = await applyBtn.count();
    if (btnCount > 0) {
      await applyBtn.scrollIntoViewIfNeeded().catch(() => {});
      await applyBtn.click({ timeout: 5000 }).catch(e => console.log('  Click error:', e.message));
      await page.waitForTimeout(1500);
      const modalPath = `${OUT_DIR}/${type}_modal.png`;
      await page.screenshot({ path: modalPath, fullPage: false });
      console.log(`  ✅ Modal: ${modalPath}`);
      // Close modal if possible
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(500);
    } else {
      console.log('  ⚠️  No 신청 button found');
    }
  }

  await browser.close();
  console.log('\nAll done!');
}

capture().catch(console.error);
