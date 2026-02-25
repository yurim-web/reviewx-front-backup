import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const OUT_DIR = 'c:/tmp/reviewx_screenshots';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const MOCK_USER = { id: 'user_kakao_001', email: '', name: '카카오유저', role: 'user' };
const MOCK_TOKEN = 'mock_token_for_screenshot';

const TYPES = ['delivery', 'visit', 'mission', 'review', 'reporter'];

async function tryCapture(ctx, type, ids) {
  for (const id of ids) {
    const url = `http://localhost:3002/campaign/${type}/${id}`;
    const page = await ctx.newPage();
    await page.addInitScript(([u, t]) => {
      localStorage.setItem('reviewx_auth_user', JSON.stringify(u));
      localStorage.setItem('reviewx_auth_token', t);
    }, [MOCK_USER, MOCK_TOKEN]);

    try {
      await page.goto(url, { timeout: 10000 });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);

      const title = await page.title();
      if (title.includes('찾을 수 없') || title.includes('404')) {
        await page.close();
        continue;
      }

      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (bodyText.trim().length < 100) {
        await page.close();
        continue;
      }

      // Full page screenshot
      await page.screenshot({ path: `${OUT_DIR}/${type}_page.png`, fullPage: true });
      console.log(`  ✅ Page captured: ${type} (id=${id})`);

      // Try 신청 button
      const applyBtn = page.locator('button').filter({ hasText: /신청/ }).first();
      if (await applyBtn.count() > 0) {
        await applyBtn.scrollIntoViewIfNeeded().catch(() => {});
        await applyBtn.click({ timeout: 5000 }).catch(e => console.log('  Click err:', e.message));
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${OUT_DIR}/${type}_modal.png`, fullPage: false });
        console.log(`  ✅ Modal captured: ${type}`);
      } else {
        console.log(`  ⚠️  No 신청 button for ${type} (status might be closed)`);
        // Still save the page screenshot
      }

      await page.close();
      return true;
    } catch(e) {
      await page.close();
    }
  }
  return false;
}

async function findFromCategoryPages(ctx) {
  const foundLinks = {};
  const categoryUrls = [
    'http://localhost:3002/user',
    'http://localhost:3002/user?tab=배송형',
  ];

  // Try looking at the list/category pages for each type
  for (const type of TYPES) {
    const listPage = await ctx.newPage();
    await listPage.goto(`http://localhost:3002/campaign/${type}`, { timeout: 10000 }).catch(() => {});
    await listPage.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await listPage.waitForTimeout(1500);
    const links = await listPage.$$eval('a[href*="/campaign/"]', els =>
      els.map(el => el.href).filter(h => h.includes(`/campaign/${type === 'review' ? 'review' : type}/`))
    ).catch(() => []);
    if (links.length > 0) {
      const m = links[0].match(/\/campaign\/[^/]+\/(\d+)/);
      if (m) foundLinks[type] = parseInt(m[1]);
    }
    await listPage.close();
  }
  return foundLinks;
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

  // Get links from home page
  const homePage = await ctx.newPage();
  await homePage.goto('http://localhost:3002/user', { timeout: 15000 });
  await homePage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await homePage.waitForTimeout(2000);

  const allLinks = await homePage.$$eval('a[href*="/campaign/"]', els =>
    els.map(el => el.href)
  );
  await homePage.close();

  // Group by type
  const byType = {};
  for (const link of allLinks) {
    const m = link.match(/\/campaign\/(delivery|visit|mission|review|reporter)\/(\d+)/);
    if (m) {
      if (!byType[m[1]]) byType[m[1]] = [];
      const id = parseInt(m[2]);
      if (!byType[m[1]].includes(id)) byType[m[1]].push(id);
    }
  }
  console.log('Links from home:', Object.fromEntries(Object.entries(byType).map(([k,v]) => [k, v.slice(0,3)])));

  // Also try IDs 1001-1020, 2001-2020, etc.
  const idRanges = {
    delivery: [...Array(20).keys()].map(i => i + 1001),
    mission:  [...Array(20).keys()].map(i => i + 4001),
    visit:    byType['visit'] || [...Array(5).keys()].map(i => i + 1011),
  };

  for (const type of TYPES) {
    const hasModal = existsSync(`${OUT_DIR}/${type}_modal.png`);
    if (hasModal) {
      console.log(`\n${type}: already captured, skipping`);
      continue;
    }

    console.log(`\nTrying ${type}...`);
    const ids = byType[type] || idRanges[type] || [];
    const ok = await tryCapture(ctx, type, ids);
    if (!ok) console.log(`  ❌ Could not capture ${type}`);
  }

  await browser.close();
  console.log('\nDone!');
}

capture().catch(console.error);
