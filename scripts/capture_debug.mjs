import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'c:/tmp/reviewx_screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // First check the home page
  await page.goto('http://localhost:3002', { timeout: 15000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}/home.png`, fullPage: true });
  console.log('Home URL:', page.url());
  console.log('Home title:', await page.title());

  // Try campaign detail
  await page.goto('http://localhost:3002/campaign/delivery/1', { timeout: 15000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${OUT_DIR}/delivery_1_debug.png`, fullPage: true });
  console.log('Delivery URL:', page.url());
  console.log('Delivery title:', await page.title());
  const bodyLen = (await page.locator('body').innerText().catch(() => '')).length;
  console.log('Body text length:', bodyLen);

  await browser.close();
}

debug().catch(console.error);
