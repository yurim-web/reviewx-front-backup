/* ========================================
   🧪 로그인 테스트 목업 데이터
   ======================================== */

/**
 * 로그인 테스트용 임시 목업 데이터
 *
 * ⚠️ 실제 API 연결 시 이 파일 전체를 삭제하세요
 *
 * - 파트너 / 관리자 로그인 시나리오를 테스트하기 위한
 *   하드코딩된 계정 정보만 모아둔 파일입니다.
 * - 실제 서비스 연동 시에는 DB / API 응답으로 대체됩니다.
 */

/* =========================================================
   파트너 계정 테스트 데이터
   1) 로그인 가능 계정
   2) 이용 제한(차단) 계정
   3) 정지/탈퇴 계정
   ========================================================= */

/**
 * 1) 파트너 로그인 가능 계정 (이메일/비밀번호)
 */
export const PARTNER_LOGIN_ACCOUNTS = [
  {
    email: "test@test.com",
    password: "cjdaud1!",
  },
  {
    email: "test@cmcm.co.kr",
    password: "cjdaud1!",
  },
];

// 기존 이름 유지 (파트너 로그인용 전체 계정)
export const TEST_ACCOUNTS = PARTNER_LOGIN_ACCOUNTS;

/**
 * 2) 파트너 이용 제한(차단) 계정 (이메일/비밀번호)
 */
export const PARTNER_BLOCKED_ACCOUNTS = [
  {
    email: "blocked@test.com",
    password: "cjdaud1!",
  },
  {
    email: "blocked_partner@test.com",
    password: "cjdaud1!",
  },
];

// 기존 이름 유지 (파트너 차단 계정)
export const BLOCKED_ACCOUNTS = PARTNER_BLOCKED_ACCOUNTS;

/**
 * 3) 파트너 정지/탈퇴 계정 (이메일/비밀번호)
 *
 * - 로그인 시 정지/탈퇴 안내 페이지(/pause_info)로 이동
 */
export const PARTNER_BANNED_ACCOUNT_CREDENTIALS = [
  {
    email: "banned@test.com",
    password: "cjdaud1!",
  },
  {
    email: "deleted@test.com",
    password: "cjdaud1!",
  },
  {
    email: "fail@test.com",
    password: "cjdaud1!",
  },
];

// 기존 이름 유지 (파트너 정지/탈퇴 계정)
export const BANNED_ACCOUNT_CREDENTIALS = PARTNER_BANNED_ACCOUNT_CREDENTIALS;

/**
 * 정지/탈퇴된 계정 이메일 목록 (파트너용)
 *
 * - 기존 로직 호환을 위해 이메일만 따로 export
 */
export const BANNED_ACCOUNTS = BANNED_ACCOUNT_CREDENTIALS.map(
  (account) => account.email
);

/* =========================================================
   관리자 계정 테스트 데이터
   1) 로그인 가능 계정
   2) 이용 제한(차단) 계정
   3) 정지/탈퇴 계정
   ========================================================= */

/**
 * 1) 관리자 로그인 가능 계정 (이메일/비밀번호)
 */
export const ADMIN_LOGIN_ACCOUNTS = [
  {
    username: "manager_sa@test.com",
    password: "cjdaud1!",
  },
  {
    username: "manager_ga@test.com",
    password: "cjdaud1!",
  },
];

/**
 * 2) 관리자 이용 제한(차단) 계정 (이메일/비밀번호)
 */
export const ADMIN_BLOCKED_USER_ACCOUNTS = [
  {
    username: "blocked_admin@test.com",
    password: "cjdaud1!",
  },
];

/**
 * 3) 관리자 정지/탈퇴 계정 (이메일/비밀번호)
 *
 * - 로그인 시 정지/탈퇴 안내 페이지(/pause_info)로 이동
 */
export const ADMIN_BANNED_USER_ACCOUNT_CREDENTIALS = [
  {
    username: "banned_admin@test.com",
    password: "cjdaud1!",
  },
];

// 기존 이름 유지 (관리자 정지/탈퇴 계정)
export const BANNED_USER_ACCOUNT_CREDENTIALS =
  ADMIN_BANNED_USER_ACCOUNT_CREDENTIALS;

export const BANNED_USER_ACCOUNTS = BANNED_USER_ACCOUNT_CREDENTIALS.map(
  (account) => account.username
);

/* =========================================================
   유저 계정 테스트 데이터
   - 현재 유저단은 SNS 로그인(ap 연동 카카오/네이버)만 사용
   - 별도의 아이디/비밀번호 테스트 계정은 사용하지 않음
   ========================================================= */

/**
 * 관리자 로그인/차단 테스트 계정 정보 (아이디 기반)
 *
 * - 기존 TEST_USER_ACCOUNTS 이름을 유지하면서
 *   "관리자" 계정만 관리
 */
export const TEST_USER_ACCOUNTS = [...ADMIN_LOGIN_ACCOUNTS];

/**
 * 관리자 이용 제한(차단) 계정 정보
 *
 * - 기존 BLOCKED_USER_ACCOUNTS 이름 유지
 */
export const BLOCKED_USER_ACCOUNTS = [...ADMIN_BLOCKED_USER_ACCOUNTS];
