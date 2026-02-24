/**
 * 파트너 마이페이지 수정 페이지 테스트
 *
 * 테스트 목적:
 * - Phase 1 리팩토링 후 usePhoneVerification 훅 정상 작동 확인
 * - 휴대폰 번호 변경 시 인증 상태 초기화 확인
 * - 인증번호 요청/확인 플로우 확인
 */

import { chromium } from "playwright";

const BASE_URL = "http://localhost:3002";
const TEST_PAGE = "/partner/mypage/edit";

async function runTest() {
  console.log("🧪 파트너 마이페이지 수정 페이지 테스트 시작...\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 페이지 로드
    console.log(`📄 페이지 로드: ${BASE_URL}${TEST_PAGE}`);
    await page.goto(`${BASE_URL}${TEST_PAGE}`, {
      waitUntil: "networkidle",
      timeout: 10000,
    });
    console.log("✅ 페이지 로드 성공\n");

    // 1. 휴대폰 번호 입력 필드 확인
    console.log("🔍 테스트 1: 휴대폰 번호 입력 필드 확인");
    const phoneInput = await page.locator('input[name="phone"]');
    await phoneInput.fill("01012345678");
    await page.waitForTimeout(300);

    const phoneValue = await phoneInput.inputValue();
    if (phoneValue.includes("010-1234-5678")) {
      console.log("✅ 휴대폰 번호 자동 포맷팅 정상 작동\n");
    } else {
      throw new Error(`휴대폰 번호 포맷팅 실패: ${phoneValue}`);
    }

    // 2. 인증번호 요청 버튼 클릭
    console.log("🔍 테스트 2: 인증번호 요청");
    const verifyButton = await page.locator('button:has-text("인증번호 요청")');
    await verifyButton.click();
    await page.waitForTimeout(500);

    // 인증번호 입력 필드가 표시되는지 확인
    const codeInput = await page.locator('input[placeholder="인증번호 6자리"]');
    const isCodeInputVisible = await codeInput.isVisible();
    if (isCodeInputVisible) {
      console.log("✅ 인증번호 입력 필드 표시됨\n");
    } else {
      throw new Error("인증번호 입력 필드가 표시되지 않음");
    }

    // 3. 타이머 표시 확인
    console.log("🔍 테스트 3: 타이머 표시 확인");
    const timerText = await page.locator('text=/\\d{1}:\\d{2}/');
    const isTimerVisible = await timerText.isVisible();
    if (isTimerVisible) {
      const timerValue = await timerText.textContent();
      console.log(`✅ 타이머 정상 작동: ${timerValue}\n`);
    } else {
      throw new Error("타이머가 표시되지 않음");
    }

    // 4. 인증번호 입력
    console.log("🔍 테스트 4: 인증번호 입력");
    await codeInput.fill("123456");
    await page.waitForTimeout(300);

    const codeValue = await codeInput.inputValue();
    if (codeValue === "123456") {
      console.log("✅ 인증번호 입력 성공\n");
    } else {
      throw new Error("인증번호 입력 실패");
    }

    // 5. 인증 확인 버튼 클릭
    console.log("🔍 테스트 5: 인증 확인");
    const confirmButton = await page.locator('button:has-text("인증 확인")');
    await confirmButton.click();
    await page.waitForTimeout(500);

    // 인증 완료 상태 확인 (인증 완료 시 버튼이 "인증 완료"로 변경됨)
    const completedButton = await page.locator('button:has-text("인증 완료")');
    const isCompleted = await completedButton.isVisible();
    if (isCompleted) {
      console.log("✅ 휴대폰 인증 완료\n");
    } else {
      throw new Error("휴대폰 인증 실패");
    }

    // 6. 휴대폰 번호 변경 시 인증 상태 초기화 확인
    console.log("🔍 테스트 6: 휴대폰 번호 변경 시 인증 상태 초기화");
    await phoneInput.fill("01087654321");
    await page.waitForTimeout(500);

    // 인증 완료 버튼이 다시 "인증번호 요청"으로 변경되는지 확인
    const requestButtonAgain = await page.locator('button:has-text("인증번호 요청")');
    const isRequestButtonVisible = await requestButtonAgain.isVisible();
    if (isRequestButtonVisible) {
      console.log("✅ 휴대폰 번호 변경 시 인증 상태 초기화 성공\n");
    } else {
      throw new Error("인증 상태 초기화 실패");
    }

    console.log("✅ 모든 테스트 통과! (6/6)\n");
    console.log("📊 Phase 1 리팩토링 결과:");
    console.log("   - usePhoneVerification 훅 통합 완료");
    console.log("   - 중복 핸들러 제거 (handleVerificationRequest, handleVerify, handleVerificationCodeChange)");
    console.log("   - 중복 state 제거 (7개)");
    console.log("   - 중복 useEffect 제거 (타이머, 헤더 숨기기)");
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

runTest()
  .then(() => {
    console.log("\n🎉 테스트 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 테스트 중 오류 발생");
    process.exit(1);
  });
