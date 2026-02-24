/**
 * campaign_management 페이지 렌더링 테스트
 * 테스트 URL: /user/campaign_management/*
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";

const BASE_URL = "http://localhost:3002";
const SCREENSHOT_DIR = join(process.cwd(), ".claude/skills/webapp-testing/screenshots");

const PAGES = [
  { path: "/user/campaign_management/all", name: "all" },
  { path: "/user/campaign_management/applied", name: "applied" },
  { path: "/user/campaign_management/selected", name: "selected" },
  { path: "/user/campaign_management/completed", name: "completed" },
  { path: "/user/campaign_management/cancelled", name: "cancelled" },
  { path: "/user/campaign_management/penalty", name: "penalty" },
];

async function testPage(page, url, name) {
  const result = { name, url, status: "ok", error: null, consoleErrors: [] };

  page.on("console", (msg) => {
    if (msg.type() === "error") result.consoleErrors.push(msg.text());
  });

  page.on("pageerror", (err) => {
    result.consoleErrors.push(`PAGE ERROR: ${err.message}`);
  });

  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    result.httpStatus = response?.status();

    // 페이지 로드 후 스크린샷
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `${name}.png`),
      fullPage: true,
    });

    // 기본 UI 요소 확인
    const hasContent = await page.locator("body").count();
    if (!hasContent) result.status = "empty";

    // React 에러 바운더리 확인
    const errorBoundary = await page.locator("text=Something went wrong").count();
    if (errorBoundary > 0) {
      result.status = "error";
      result.error = "React error boundary triggered";
    }

    // Next.js 에러 overlay 확인
    const nextError = await page.locator("#nextjs__container_errors_label").count();
    if (nextError > 0) {
      result.status = "error";
      result.error = "Next.js error overlay detected";
    }
  } catch (err) {
    result.status = "fail";
    result.error = err.message;
  }

  return result;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const { path, name } of PAGES) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = `${BASE_URL}${path}`;
    process.stdout.write(`테스트 중: ${name}...`);
    const result = await testPage(page, url, name);
    results.push(result);
    console.log(result.status === "ok" ? " ✅" : ` ❌ ${result.error}`);
    await context.close();
  }

  await browser.close();

  // 결과 출력
  console.log("\n===== 테스트 결과 =====");
  let allPassed = true;
  for (const r of results) {
    const icon = r.status === "ok" ? "✅" : "❌";
    const errors = r.consoleErrors.length > 0 ? `\n   콘솔 에러: ${r.consoleErrors.join(", ")}` : "";
    console.log(`${icon} [${r.name}] HTTP ${r.httpStatus ?? "N/A"} ${r.error ? "→ " + r.error : ""}${errors}`);
    if (r.status !== "ok" || r.consoleErrors.length > 0) allPassed = false;
  }
  console.log(`\n스크린샷 저장 위치: ${SCREENSHOT_DIR}`);
  console.log(allPassed ? "\n전체 통과 🎉" : "\n일부 실패 — 위 항목 확인 필요");
  process.exit(allPassed ? 0 : 1);
}

run().catch((e) => {
  console.error("테스트 실행 오류:", e);
  process.exit(1);
});
