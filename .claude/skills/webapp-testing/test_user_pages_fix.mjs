/**
 * smoke test: ESLint 수정된 user 페이지 6개
 * - /user/login
 * - /user/notification
 * - /user/mypage/profile
 * - /user/mypage/address
 * - /user/mypage/channel
 * - /user/mypage/channel/connect
 */
import { chromium } from "playwright";

const BASE_URL = "http://localhost:3002";
const PAGES = [
  { path: "/user/login", name: "로그인" },
  { path: "/user/notification", name: "알림" },
  { path: "/user/mypage/profile", name: "마이페이지 프로필" },
  { path: "/user/mypage/address", name: "마이페이지 주소" },
  { path: "/user/mypage/channel", name: "마이페이지 채널" },
  { path: "/user/mypage/channel/connect", name: "채널 연결" },
];

const SCREENSHOT_DIR =
  "c:/develop/reviewx-web/.claude/skills/webapp-testing/screenshots";

async function testPage(page, { path, name }) {
  const url = `${BASE_URL}${path}`;
  const errors = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  let status = 0;
  page.on("response", (res) => {
    if (res.url() === url || res.url() === url + "/") status = res.status();
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

  // React 에러 경계 체크
  const hasErrorBoundary = await page
    .locator("text=Something went wrong")
    .count();
  const hasNextError = await page
    .locator("#__next-error-overlay")
    .count();
  const hasErrorText = await page
    .locator('[data-nextjs-dialog]')
    .count();

  if (hasErrorBoundary > 0) errors.push("React 에러 경계 감지");
  if (hasNextError > 0) errors.push("Next.js 에러 오버레이 감지");
  if (hasErrorText > 0) errors.push("Next.js 다이얼로그 에러 감지");

  // 스크린샷
  const safeName = name.replace(/[/\s]/g, "_");
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/fix_${safeName}.png`,
    fullPage: true,
  });

  const pass = errors.length === 0 && consoleErrors.length === 0;
  return { name, path, pass, errors, consoleErrors };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const pageInfo of PAGES) {
    const page = await browser.newPage();
    try {
      const result = await testPage(page, pageInfo);
      results.push(result);
    } catch (err) {
      results.push({ name: pageInfo.name, path: pageInfo.path, pass: false, errors: [err.message], consoleErrors: [] });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log("\n========== Smoke Test 결과 ==========");
  let allPass = true;
  for (const r of results) {
    const icon = r.pass ? "✅" : "❌";
    console.log(`${icon} ${r.name} (${r.path})`);
    if (!r.pass) {
      allPass = false;
      if (r.errors.length) console.log(`   오류: ${r.errors.join(", ")}`);
      if (r.consoleErrors.length)
        console.log(`   콘솔 에러: ${r.consoleErrors.slice(0, 3).join(" | ")}`);
    }
  }
  console.log("=====================================");
  console.log(allPass ? "\n🎉 전체 통과!" : "\n⚠️  일부 실패");
  process.exit(allPass ? 0 : 1);
}

run();
