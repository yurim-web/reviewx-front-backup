/* ========================================
   ✅ 유효성 검증 관련 상수
   ======================================== */

/**
 * 정규 표현식 패턴
 *
 * 용도:
 * - 이메일, 비밀번호, 휴대폰 등 유효성 검증
 * - 재사용 가능한 정규식 패턴 중앙 관리
 */
export const REGEX_PATTERNS = {
  /** 이메일 형식: example@domain.com */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** 휴대폰 번호 형식: 010-XXXX-XXXX */
  PHONE: /^010-\d{4}-\d{4}$/,

  /** 인증번호 형식: 6자리 숫자 */
  VERIFICATION_CODE: /^\d{6}$/,

  /** 비밀번호 특수문자 검증 */
  SPECIAL_CHARS: /[!@#$%^&*()\-_=+]/,

  /** 영문자 포함 여부 */
  HAS_LETTER: /[a-zA-Z]/,

  /** 숫자 포함 여부 */
  HAS_NUMBER: /[0-9]/,

  /** 숫자만 (쉼표 등 제거용) */
  NUMBERS_ONLY: /[^0-9]/g,
} as const;

/**
 * 비밀번호 제약 조건
 */
export const PASSWORD_CONSTRAINTS = {
  /** 최소 길이 */
  MIN_LENGTH: 8,

  /** 최대 길이 */
  MAX_LENGTH: 16,

  /** 필수 포함 조건 설명 */
  REQUIREMENTS: "영문, 숫자, 특수문자(!@#$%^&*()-_=+) 포함",
} as const;

/**
 * 금액 제약 조건
 */
export const AMOUNT_CONSTRAINTS = {
  /** 최소 출금/충전 금액 */
  MIN_AMOUNT: 10000,

  /** 최대 출금/충전 금액 */
  MAX_AMOUNT: 1000000,
} as const;

/**
 * 인증 타이머 설정
 */
export const VERIFICATION_TIMER = {
  /** 인증번호 유효 시간 (초) */
  DURATION_SECONDS: 240, // 4분

  /** 인증번호 재발송 대기 시간 (초) */
  RESEND_DELAY_SECONDS: 60, // 1분
} as const;
