/* ========================================
   🧪 통합 계정 목업 데이터
   ======================================== */

/**
 * 로그인, 회원가입, 아이디/비밀번호 찾기에서 공통으로 사용하는
 * 통합 계정 목업 데이터입니다.
 *
 * ⚠️ 실제 API 연결 시 이 파일 전체를 삭제하세요
 *
 * 사용 페이지:
 * - 로그인 페이지: /manager/login, /partner/login
 * - 회원가입 페이지: /user/signup, /partner/signup
 * - 아이디/비밀번호 찾기: /find-account, /partner/find-account, /user/find-account
 *
 * 데이터 구조:
 * - userType: 계정 타입 ("admin_sa" | "admin_ga" | "user" | "partner")
 * - email: 이메일 (관리자/파트너 로그인용, 유저는 SNS 로그인만 가능)
 * - password: 비밀번호 (관리자/파트너만 사용, 유저는 SNS 로그인만 가능)
 * - phone: 전화번호 (아이디/비밀번호 찾기용)
 * - signupDate: 가입일자
 * - isBlocked: 이용 제한(차단) 계정 여부
 * - isBanned: 탈퇴/이용정지 회원 여부
 * - snsType: SNS 타입 (유저의 경우만: "kakao" | "naver")
 * - redirectUrl: 로그인 성공 후 리다이렉트 URL
 */

/**
 * 계정 타입 정의
 */
export type AccountType = "admin_sa" | "admin_ga" | "user" | "partner";

/**
 * SNS 타입 정의
 */
export type SNSType = "kakao" | "naver";

/**
 * 통합 계정 데이터 인터페이스
 */
export interface UnifiedAccount {
  /** 계정 ID */
  id: string;
  /** 계정 타입 */
  userType: AccountType;
  /** 사용자 역할 (인증 시스템용) */
  role: 'user' | 'partner' | 'manager_ga' | 'manager_sa';
  /** 이름 */
  name: string;
  /** 이메일 (관리자/파트너 로그인용) */
  email: string;
  /** 비밀번호 (관리자/파트너만 사용) */
  password?: string;
  /** 전화번호 (아이디/비밀번호 찾기용) */
  phone: string;
  /** 가입일자 */
  signupDate: string;
  /** 이용 제한(차단) 계정 여부 */
  isBlocked: boolean;
  /** 탈퇴/이용정지 회원 여부 */
  isBanned: boolean;
  /** SNS 타입 (유저의 경우만) */
  snsType?: SNSType;
  /** 로그인 성공 후 리다이렉트 URL */
  redirectUrl: string;

  // 리뷰어 전용 필드
  grade?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  channels?: Array<{
    platform: string;
    url: string;
    followers: number;
  }>;

  // 파트너 전용 필드
  business_name?: string;
  business_number?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';

  // 관리자 전용 필드
  admin_level?: 'GA' | 'SA';
  permissions?: string[];
}

/**
 * 통합 계정 목업 데이터
 *
 * 테스트 케이스 설명:
 * - 관리자 SA: manager_sa@test.com → /manager_sa로 이동
 * - 관리자 GA: manager_ga@test.com → /manager_ga로 이동
 * - 파트너: test@test.com → /partner/campaign_management로 이동 (또는 /partner)
 * - 유저 (카카오): 전화번호 010-1111-1111 → SNS 로그인만 가능
 * - 유저 (네이버): 전화번호 010-0000-0000 → SNS 로그인만 가능
 */
const UNIFIED_ACCOUNTS_DATA: UnifiedAccount[] = [
  // =========================================================
  // 관리자 SA 계정
  // =========================================================
  {
    id: "manager_sa_001",
    userType: "admin_sa",
    role: "manager_sa",
    name: "최고관리자",
    email: "manager_sa@test.com",
    password: "cjdaud1!",
    phone: "010-7777-7777",
    signupDate: "2024. 01. 01",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/manager_sa",
  },
  // 관리자 SA - 차단 계정
  {
    userType: "admin_sa",
    email: "blocked_sa@test.com",
    password: "cjdaud1!",
    phone: "010-7776-7776",
    signupDate: "2024. 01. 15",
    isBlocked: true,
    isBanned: false,
    redirectUrl: "/manager_sa",
  },
  // 관리자 SA - 정지/탈퇴 계정
  {
    userType: "admin_sa",
    email: "banned_sa@test.com",
    password: "cjdaud1!",
    phone: "010-7775-7775",
    signupDate: "2024. 01. 10",
    isBlocked: false,
    isBanned: true,
    redirectUrl: "/manager_sa",
  },

  // =========================================================
  // 관리자 GA 계정
  // =========================================================
  {
    id: "manager_ga_001",
    userType: "admin_ga",
    role: "manager_ga",
    name: "일반관리자",
    email: "manager_ga@test.com",
    password: "cjdaud1!",
    phone: "010-6666-6666",
    signupDate: "2024. 02. 01",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/manager_ga",
  },
  // 관리자 GA - 차단 계정
  {
    userType: "admin_ga",
    email: "blocked_ga@test.com",
    password: "cjdaud1!",
    phone: "010-6665-6665",
    signupDate: "2024. 02. 15",
    isBlocked: true,
    isBanned: false,
    redirectUrl: "/manager_ga",
  },
  // 관리자 GA - 정지/탈퇴 계정
  {
    userType: "admin_ga",
    email: "banned_ga@test.com",
    password: "cjdaud1!",
    phone: "010-6664-6664",
    signupDate: "2024. 02. 10",
    isBlocked: false,
    isBanned: true,
    redirectUrl: "/manager_ga",
  },

  // =========================================================
  // 파트너 계정
  // =========================================================
  {
    id: "partner_test_001",
    userType: "partner",
    role: "partner",
    email: "test@test.com",
    password: "cjdaud1!",
    name: "테스트파트너",
    phone: "010-5555-5555",
    business_name: "테스트 주식회사",
    business_number: "123-45-67890",
    approval_status: "approved",
    signupDate: "2024. 03. 01",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/partner/campaign_management",
  },
  {
    userType: "partner",
    email: "test@cmcm.co.kr",
    password: "cjdaud1!",
    phone: "010-5554-5554",
    signupDate: "2024. 03. 15",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/partner/campaign_management",
  },
  // 파트너 - 차단 계정
  {
    userType: "partner",
    email: "blocked@test.com",
    password: "cjdaud1!",
    phone: "010-5553-5553",
    signupDate: "2024. 03. 10",
    isBlocked: true,
    isBanned: false,
    redirectUrl: "/partner/campaign_management",
  },
  {
    userType: "partner",
    email: "blocked_partner@test.com",
    password: "cjdaud1!",
    phone: "010-5552-5552",
    signupDate: "2024. 03. 20",
    isBlocked: true,
    isBanned: false,
    redirectUrl: "/partner/campaign_management",
  },
  // 파트너 - 정지/탈퇴 계정
  {
    userType: "partner",
    email: "banned@test.com",
    password: "cjdaud1!",
    phone: "010-5551-5551",
    signupDate: "2024. 03. 05",
    isBlocked: false,
    isBanned: true,
    redirectUrl: "/partner/campaign_management",
  },
  {
    userType: "partner",
    email: "deleted@test.com",
    password: "cjdaud1!",
    phone: "010-5550-5550",
    signupDate: "2024. 03. 12",
    isBlocked: false,
    isBanned: true,
    redirectUrl: "/partner/campaign_management",
  },
  {
    userType: "partner",
    email: "fail@test.com",
    password: "cjdaud1!",
    phone: "010-5549-5549",
    signupDate: "2024. 03. 18",
    isBlocked: false,
    isBanned: true,
    redirectUrl: "/partner/campaign_management",
  },

  // =========================================================
  // 유저 계정 (SNS 로그인만 가능)
  // =========================================================
  // 유저 - 카카오 로그인 (SNS 로그인 유도 모달 표시용)
  {
    id: "user_kakao_001",
    userType: "user",
    role: "user",
    name: "카카오유저",
    email: "", // 유저는 이메일/비밀번호 로그인 불가
    phone: "010-1111-1111", // EXISTING_KAKAO
    signupDate: "2024. 04. 01",
    isBlocked: false,
    isBanned: false,
    snsType: "kakao",
    redirectUrl: "/user/campaign_management", // 유저 캠페인 관리 페이지
  },
  // 유저 - 네이버 로그인 (SNS 로그인 유도 모달 표시용)
  {
    id: "user_naver_001",
    userType: "user",
    role: "user",
    name: "네이버유저",
    email: "gdhong@naver.com", // 아이디 찾기 결과 모달에 표시될 이메일 (SNS 모달이므로 실제로는 표시 안 됨)
    phone: "010-0000-0000", // EXISTING_NAVER
    signupDate: "2025. 06. 01",
    isBlocked: false,
    isBanned: false,
    snsType: "naver",
    redirectUrl: "/user/campaign_management", // 유저 캠페인 관리 페이지
  },
  // 유저 - 일반 계정 (아이디 찾기 결과 모달 표시용)
  {
    userType: "user",
    email: "test@example.com", // 아이디 찾기 결과 모달에 표시될 이메일
    phone: "010-1234-5678", // NORMAL
    signupDate: "2024. 12. 15",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/user/campaign_management",
  },
  // 유저 - 추가 테스트 계정들 (아이디 찾기 결과 모달 표시용)
  {
    userType: "user",
    email: "user1@gmail.com",
    phone: "010-2222-2222",
    signupDate: "2024. 03. 20",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/user/campaign_management",
  },
  {
    userType: "user",
    email: "user2@naver.com",
    phone: "010-3333-3333",
    signupDate: "2024. 07. 10",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/user/campaign_management",
  },
  {
    userType: "user",
    email: "user3@daum.net",
    phone: "010-4444-4444",
    signupDate: "2024. 09. 05",
    isBlocked: false,
    isBanned: false,
    redirectUrl: "/user/campaign_management",
  },
  // 유저 - 정지/탈퇴 계정 (네이버)
  {
    userType: "user",
    email: "",
    phone: "010-9999-9999", // DUPLICATE
    signupDate: "2024. 01. 01",
    isBlocked: false,
    isBanned: true,
    snsType: "naver",
    redirectUrl: "/user/campaign_management",
  },
  // 유저 - 정지/탈퇴 계정 (카카오)
  {
    userType: "user",
    email: "",
    phone: "010-8888-8888", // BLOCKED
    signupDate: "2024. 01. 05",
    isBlocked: false,
    isBanned: true,
    snsType: "kakao",
    redirectUrl: "/user/campaign_management",
  },
  // 유저 - 이용 제한 계정 (네이버) - 로그인은 되지만 제한 화면 표시
  {
    userType: "user",
    email: "",
    phone: "010-7777-7777",
    signupDate: "2024. 01. 10",
    isBlocked: true,
    isBanned: false,
    snsType: "naver",
    redirectUrl: "/user/campaign_management",
  },
  // 유저 - 이용 제한 계정 (카카오) - 로그인은 되지만 제한 화면 표시
  {
    userType: "user",
    email: "",
    phone: "010-6666-6666",
    signupDate: "2024. 01. 15",
    isBlocked: true,
    isBanned: false,
    snsType: "kakao",
    redirectUrl: "/user/campaign_management",
  },
];

/**
 * 전화번호로 계정 찾기 (아이디/비밀번호 찾기용)
 */
export function findAccountByPhone(phone: string): UnifiedAccount | undefined {
  const normalizedPhone = phone.replace(/-/g, "");
  return UNIFIED_ACCOUNTS_DATA.find(
    (account) => account.phone.replace(/-/g, "") === normalizedPhone
  );
}

/**
 * 이메일로 계정 찾기 (관리자/파트너 로그인용)
 */
export function findAccountByEmail(email: string): UnifiedAccount | undefined {
  return UNIFIED_ACCOUNTS_DATA.find((account) => account.email === email);
}

/**
 * 이메일과 비밀번호로 계정 찾기 (로그인 검증용)
 */
export function findAccountByCredentials(
  email: string,
  password: string
): UnifiedAccount | undefined {
  return UNIFIED_ACCOUNTS_DATA.find(
    (account) => account.email === email && account.password === password
  );
}

/**
 * 계정 타입별로 필터링
 */
export function getAccountsByType(userType: AccountType): UnifiedAccount[] {
  return UNIFIED_ACCOUNTS_DATA.filter((account) => account.userType === userType);
}

/**
 * 이용 제한(차단) 계정만 필터링
 */
export function getBlockedAccounts(): UnifiedAccount[] {
  return UNIFIED_ACCOUNTS_DATA.filter((account) => account.isBlocked);
}

/**
 * 정지/탈퇴 계정만 필터링
 */
export function getBannedAccounts(): UnifiedAccount[] {
  return UNIFIED_ACCOUNTS_DATA.filter((account) => account.isBanned);
}

/**
 * 통합 계정 데이터 export (인증 시스템에서 사용)
 */
export const UNIFIED_ACCOUNTS = UNIFIED_ACCOUNTS_DATA;
export const unifiedAccountData = UNIFIED_ACCOUNTS_DATA;
