import { chromium } from 'playwright';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'c:/tmp/reviewx_screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const TYPES = [
  { type: 'delivery', label: '배송형' },
  { type: 'visit',    label: '방문형' },
  { type: 'mission',  label: '미션형' },
  { type: 'review',   label: '구매평' },
  { type: 'reporter', label: '기자단' },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  for (const { type, label } of TYPES) {
    let captured = false;
    for (const id of [1, 2, 3, 4, 5]) {
      const url = `http://localhost:3002/campaign/${type}/${id}`;
      console.log(`Trying ${url}...`);
      try {
        await page.goto(url, { timeout: 10000 });
        await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1500);

        const bodyText = await page.locator('body').innerText().catch(() => '');
        if (bodyText.includes('404') || bodyText.includes('not found') || bodyText.trim().length < 50) {
          continue;
        }

        // Full page screenshot
        const pagePath = `${OUT_DIR}/${type}_page.png`;
        await page.screenshot({ path: pagePath, fullPage: true });
        console.log(`  ✅ Page captured: ${pagePath}`);

        // Try to find and click 신청하기 button
        const btn = page.locator('button').filter({ hasText: /신청|Apply/i }).first();
        const btnCount = await btn.count();
        if (btnCount > 0) {
          await btn.click({ timeout: 3000 }).catch(() => {});
          await page.waitForTimeout(1000);
          const modalPath = `${OUT_DIR}/${type}_modal.png`;
          await page.screenshot({ path: modalPath, fullPage: false });
          console.log(`  ✅ Modal captured: ${modalPath}`);
        }

        captured = true;
        break;
      } catch (e) {
        console.log(`  ❌ Error: ${e.message}`);
      }
    }
    if (!captured) console.log(`  ⚠️  No valid page found for ${label}`);
  }

  await browser.close();
  console.log('\nDone!');
}

capture().catch(console.error);
