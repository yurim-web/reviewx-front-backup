/**
 * 파트너 페이지 스모크 테스트 (Node.js Playwright)
 * 주요 partner 페이지들의 HTTP 200 로드 확인
 */
import { chromium } from "playwright";

const BASE_URL = "http://localhost:3002";

const PAGES = [
  ["/partner/login", "파트너 로그인"],
  ["/partner/signup", "파트너 회원가입"],
  ["/partner/find-account", "아이디/비밀번호 찾기"],
  ["/partner/mypage", "파트너 마이페이지"],
  ["/partner/mypage/edit", "파트너 내정보 수정"],
  ["/partner/mypage/profile", "파트너 프로필"],
  ["/partner/notification", "파트너 알림"],
  ["/partner/campaign_management", "캠페인 관리"],
  ["/partner/campaign_management/applied", "신청내역 탭"],
  ["/partner/campaign_management/scheduled", "예정 탭"],
  ["/partner/campaign_management/progress", "진행 탭"],
  ["/partner/campaign_management/completed", "완료 탭"],
  ["/partner/campaign_management/cancelled", "취소 탭"],
  ["/partner/campaign_management/extension-request", "기한연장 탭"],
  ["/partner/campaign_management/penalty", "패널티 탭"],
  ["/partner/campaign/create/delivery", "배송형 캠페인 등록"],
  ["/partner/campaign/create/mission", "미션형 캠페인 등록"],
  ["/partner/campaign/create/reporter", "기자단 캠페인 등록"],
  ["/partner/campaign/create/review", "구매평 캠페인 등록"],
  ["/partner/campaign/create/visit", "방문형 캠페인 등록"],
  ["/partner/point/charge", "포인트 충전"],
  ["/partner/point/all", "포인트 전체내역"],
];

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // 파트너 mock auth 주입
  const authPage = await context.newPage();
  await authPage.goto(`${BASE_URL}/partner/login`);
  await authPage.waitForLoadState("networkidle");
  await authPage.evaluate(() => {
    const partnerUser = {
      id: "partner_test_001",
      email: "partner@test.com",
      name: "테스트 파트너",
      role: "partner",
      business_name: "테스트 광고주",
      business_number: "123-45-67890",
      business_type: "법인사업자",
      phone: "010-1234-5678",
    };
    localStorage.setItem("reviewx_auth_user", JSON.stringify(partnerUser));
    localStorage.setItem("reviewx_auth_role", "partner");
    sessionStorage.setItem("partner_logged_in", "true");
    localStorage.setItem("partner_accounts", JSON.stringify([partnerUser]));
  });
  await authPage.close();

  const results = [];

  for (const [path, label] of PAGES) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    try {
      const response = await page.goto(`${BASE_URL}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      await page.waitForLoadState("networkidle", { timeout: 10000 });

      const status = response?.status() ?? 0;
      const ok = status === 200;
      const criticalErrors = consoleErrors.filter(
        (e) => !e.includes("Warning:") && !e.includes("DevTools"),
      );

      results.push({ path, label, status, ok, errors: criticalErrors });

      const icon = ok ? "✅" : "❌";
      const errStr =
        criticalErrors.length > 0
          ? ` | 오류: ${criticalErrors[0].slice(0, 60)}`
          : "";
      console.log(`${icon} [${status}] ${label}${errStr}`);
    } catch (e) {
      results.push({ path, label, status: 0, ok: false, errors: [e.message] });
      console.log(`❌ [ERR] ${label} | ${e.message.slice(0, 60)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  console.log(`\n${"=".repeat(50)}`);
  console.log(`결과: ${passed}/${total} 통과`);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log("\n실패한 페이지:");
    failed.forEach((r) => console.log(`  - ${r.label} (${r.path}): ${r.status}`));
  }

  return passed === total;
}

runTests().then((ok) => process.exit(ok ? 0 : 1));
