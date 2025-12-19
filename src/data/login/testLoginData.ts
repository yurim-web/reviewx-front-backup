/* ========================================
   🧪 로그인 테스트 헬퍼 (함수 모음)
   ======================================== */

/**
 * 사용처 (어디에서 이 헬퍼를 쓰는지)
 *
 * - 관리자 로그인 페이지:
 *   - src/app/manager/login/page.tsx
 *     - checkUserTestLogin
 *     - isBlockedUserAccount
 *     - isBlockedUserAccountUsername
 *     - BANNED_USER_ACCOUNTS (re-export 된 목업 데이터)
 *
 * - 파트너 로그인 페이지:
 *   - src/app/partner/login/page.tsx
 *     - checkTestLogin
 *     - isBlockedAccount
 *     - isBlockedAccountEmail
 *     - BANNED_ACCOUNTS (re-export 된 목업 데이터)
 *
 */

/**
 * 이 파일은 "로그인 테스트용 헬퍼 함수"만 모아둔 파일입니다.
 *
 * ⚠️ 실제 API 연결 시:
 * - testLoginMockData.ts (임시 목업 데이터 파일)만 삭제하고
 * - 이 파일의 함수들은 필요에 따라 실제 API 로직으로 교체하면 됩니다.
 *
 * 임시 데이터는 모두 testLoginMockData.ts 에 정의되어 있으며,
 * 이 파일에서는 그 데이터를 import 해서 테스트용 로직만 제공합니다.
 */

import {
  PARTNER_LOGIN_ACCOUNTS,
  PARTNER_BLOCKED_ACCOUNTS,
  BANNED_ACCOUNTS,
  ADMIN_LOGIN_ACCOUNTS,
  ADMIN_BLOCKED_USER_ACCOUNTS,
  BANNED_USER_ACCOUNTS,
  TEST_USER_ACCOUNTS,
} from "./testLoginMockData";

/* =========================================================
   파트너 로그인 테스트 헬퍼
   ========================================================= */

/**
 * 차단된 계정인지 확인하는 함수 (파트너용 - 이메일만 확인)
 */
export function isBlockedAccountEmail(email: string): boolean {
  return PARTNER_BLOCKED_ACCOUNTS.some((account) => account.email === email);
}

/**
 * 차단된 계정인지 확인하는 함수 (파트너용 - 이메일/비밀번호 확인)
 */
export function isBlockedAccount(email: string, password: string): boolean {
  return PARTNER_BLOCKED_ACCOUNTS.some(
    (account) => account.email === email && account.password === password
  );
}

/**
 * 파트너 로그인 테스트 함수 (이메일 기반)
 *
 * @returns 에러 메시지 (성공이면 null)
 */
export function checkTestLogin(email: string, password: string): string | null {
  // 1. 실제 계정으로 로그인 성공
  const matchedAccount = PARTNER_LOGIN_ACCOUNTS.find(
    (account) => account.email === email && account.password === password
  );

  if (matchedAccount) {
    return null; // 성공 (에러 없음)
  }

  // 2. 아이디는 맞지만 비밀번호가 틀린 경우 (일반 계정 또는 차단된 계정)
  const accountExists = PARTNER_LOGIN_ACCOUNTS.some(
    (account) => account.email === email
  );
  const blockedAccountExists = PARTNER_BLOCKED_ACCOUNTS.some(
    (account) => account.email === email
  );

  if (accountExists || blockedAccountExists) {
    return "아이디 또는 비밀번호가 일치하지 않습니다.";
  }

  // 3. 정지/탈퇴된 계정인 경우
  if (BANNED_ACCOUNTS.includes(email)) {
    return "정지/탈퇴된 계정입니다.";
  }

  // 4. 존재하지 않는 계정인 경우
  return "존재하지 않는 계정입니다.";
}

/* =========================================================
   관리자 / 유저 로그인 테스트 헬퍼
   - 현재 유저단은 SNS 로그인만 사용하므로,
     아이디/비밀번호 기반 로직은 관리자용으로만 사용됩니다.
   ========================================================= */

/**
 * 차단된 계정인지 확인하는 함수 (유저/관리자용 - 아이디만 확인)
 */
export function isBlockedUserAccountUsername(username: string): boolean {
  return ADMIN_BLOCKED_USER_ACCOUNTS.some(
    (account) => account.username === username
  );
}

/**
 * 차단된 계정인지 확인하는 함수 (유저/관리자용 - 아이디/비밀번호 확인)
 */
export function isBlockedUserAccount(
  username: string,
  password: string
): boolean {
  return ADMIN_BLOCKED_USER_ACCOUNTS.some(
    (account) => account.username === username && account.password === password
  );
}

/**
 * 유저/관리자 로그인 테스트 함수 (아이디 기반)
 *
 * @returns 에러 메시지 (성공이면 null)
 */
export function checkUserTestLogin(
  username: string,
  password: string
): string | null {
  // 1. 실제 계정으로 로그인 성공
  const matchedAccount = TEST_USER_ACCOUNTS.find(
    (account) => account.username === username && account.password === password
  );

  if (matchedAccount) {
    return null; // 성공 (에러 없음)
  }

  // 2. 아이디는 맞지만 비밀번호가 틀린 경우 (일반 계정 또는 차단된 계정)
  const accountExists = TEST_USER_ACCOUNTS.some(
    (account) => account.username === username
  );
  const blockedAccountExists = isBlockedUserAccountUsername(username);

  if (accountExists || blockedAccountExists) {
    return "아이디 또는 비밀번호가 일치하지 않습니다.";
  }

  // 3. 정지/탈퇴된 계정인 경우 (관리자)
  if (BANNED_USER_ACCOUNTS.includes(username)) {
    return "정지/탈퇴된 계정입니다.";
  }

  // 4. 존재하지 않는 계정인 경우
  return "존재하지 않는 계정입니다.";
}

/**
 * ⚠️ 하위 호환을 위해 임시 목업 데이터도 그대로 re-export 합니다.
 *
 * - 다른 곳에서 여전히 `@/data/login/testLoginData` 경로로
 *   목업 데이터를 import 하고 있을 수 있으므로,
 *   testLoginMockData.ts 의 모든 export 를 다시 노출합니다.
 *
 * - 나중에 API 연동 시에는:
 *   1) testLoginMockData.ts 삭제
 *   2) 여기 `export *` 구문 삭제
 *   3) 위 헬퍼 함수들을 실제 API 기반 로직으로 교체
 */
export * from "./testLoginMockData";
