/**
 * smoke test: 나머지 user 페이지
 * - 이전에 테스트한 페이지 제외한 모든 user 페이지
 */
import { chromium } from "playwright";

const BASE_URL = "http://localhost:3002";
const PAGES = [
  { path: "/user/mypage/edit", name: "마이페이지 수정" },
  { path: "/user/point/all", name: "포인트 전체" },
  { path: "/user/point/earned", name: "포인트 적립" },
  { path: "/user/point/pending", name: "포인트 예정" },
  { path: "/user/point/withdrawn", name: "포인트 출금완료" },
  { path: "/user/point/withdrawal_request", name: "포인트 출금신청" },
  { path: "/user/signup", name: "회원가입" },
  { path: "/user/find-account", name: "계정찾기" },
];

const SCREENSHOT_DIR =
  "c:/develop/reviewx-web/.claude/skills/webapp-testing/screenshots";

async function testPage(browser, { path, name }) {
  const url = `${BASE_URL}${path}`;
  const errors = [];
  const consoleErrors = [];

  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

    const hasErrorBoundary = await page.locator("text=Something went wrong").count();
    const hasNextDialog = await page.locator("[data-nextjs-dialog]").count();

    if (hasErrorBoundary > 0) errors.push("React 에러 경계 감지");
    if (hasNextDialog > 0) errors.push("Next.js 에러 다이얼로그 감지");

    const safeName = name.replace(/[/\s]/g, "_");
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/remaining_${safeName}.png`,
      fullPage: true,
    });
  } finally {
    await page.close();
  }

  const pass = errors.length === 0 && consoleErrors.length === 0;
  return { name, path, pass, errors, consoleErrors };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const pageInfo of PAGES) {
    try {
      const result = await testPage(browser, pageInfo);
      results.push(result);
    } catch (err) {
      results.push({
        name: pageInfo.name,
        path: pageInfo.path,
        pass: false,
        errors: [err.message],
        consoleErrors: [],
      });
    }
  }

  await browser.close();

  console.log("\n========== 나머지 페이지 Smoke Test 결과 ==========");
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
  console.log("===================================================");
  console.log(allPass ? "\n🎉 전체 통과!" : "\n⚠️  일부 실패");
  process.exit(allPass ? 0 : 1);
}

run();
