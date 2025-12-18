/* ========================================
   🧪 회원가입/계정찾기 인증번호 테스트 데이터
   ======================================== */

/**
 * 회원가입 및 계정찾기에서 공통으로 사용하는
 * 휴대폰 인증 테스트용 임시 데이터입니다.
 *
 * ⚠️ 실제 API 연결 시 이 파일 전체를 삭제하세요
 *
 * 사용 방법:
 * - 각 테스트 케이스에 해당하는 휴대폰 번호와 인증번호로 테스트
 * - 각 케이스별로 다른 동작이 발생합니다
 *
 * ========================================
 * 사용처 (어디에서 이 데이터를 쓰는가?)
 * ========================================
 *
 * 1) 사용자 회원가입 페이지
 *    - 파일: src/app/user/signup/page.tsx
 *    - import:
 *      - TEST_PHONE_NUMBERS
 *      - checkTestVerificationCode
 *      - checkTestPhoneNumber
 *    - 역할:
 *      - 특정 테스트 번호(카카오/네이버/중복/일반)에 따라
 *        회원가입 흐름에서 다른 모달/동작을 트리거합니다.
 *
 * 2) 휴대폰 인증 공통 훅
 *    - 파일: src/hooks/common/signup/usePhoneVerification.ts
 *    - import:
 *      - checkTestVerificationCode
 *    - 역할:
 *      - 입력된 인증번호가 테스트용 성공 코드인지 확인하여
 *        실제 API 없이도 인증 성공/실패 흐름을 테스트할 수 있게 합니다.
 *
 * 3) 계정 찾기 로직 훅
 *    - 파일: src/components/common/find_account/hooks/useFindAccount.ts
 *    - import:
 *      - TEST_PHONE_NUMBERS
 *    - 역할:
 *      - 휴대폰 번호별 계정 상태(found / sns_only / blocked 등)를
 *        테스트 번호에 매핑해서,
 *        계정찾기 페이지에서 아이디 조회 / SNS 로그인 유도 /
 *        정지/탈퇴 계정 모달 등을 목업 데이터로 확인할 수 있게 합니다.
 *
 * 이처럼 한 곳에서 테스트용 번호/코드를 정의하고,
 * 여러 페이지와 훅에서 공통으로 사용하여
 * 시나리오별 동작을 쉽게 검증할 수 있습니다.
 */

/**
 * ========================================
 * 테스트 인증번호
 * ========================================
 *
 * 인증번호 입력 시 사용할 테스트 코드
 */
export const TEST_VERIFICATION_CODES = {
  /** 인증 성공 코드 */
  SUCCESS: "000000",
  /** 인증 실패 코드 (일반) */
  FAIL: "123456",
  /** 인증 실패 코드 (형식 오류) */
  INVALID_FORMAT: "12345", // 5자리 (6자리 아님)
} as const;

/**
 * ========================================
 * 테스트 휴대폰 번호
 * ========================================
 *
 * 특정 동작을 테스트하기 위한 휴대폰 번호
 */
export const TEST_PHONE_NUMBERS = {
  /** 일반 인증 성공 */
  NORMAL: "010-1234-5678",
  /** 기존 계정 존재 (카카오) */
  EXISTING_KAKAO: "010-1111-1111",
  /** 기존 계정 존재 (네이버) */
  EXISTING_NAVER: "010-0000-0000",
  /** 중복된 휴대폰 번호 */
  DUPLICATE: "010-9999-9999",
} as const;

/**
 * ========================================
 * 인증번호 테스트 함수
 * ========================================
 *
 * 입력된 인증번호가 테스트용 인증번호인지 확인
 *
 * @param code - 입력된 인증번호
 * @returns 인증 성공 여부
 *
 * @example
 * ```typescript
 * if (checkTestVerificationCode("000000")) {
 *   // 인증 성공
 * }
 * ```
 */
export function checkTestVerificationCode(code: string): boolean {
  return code === TEST_VERIFICATION_CODES.SUCCESS;
}

/**
 * ========================================
 * 휴대폰 번호 테스트 확인 함수
 * ========================================
 *
 * 입력된 휴대폰 번호가 테스트용 번호인지 확인
 *
 * @param phone - 입력된 휴대폰 번호
 * @returns 테스트 번호 정보 (없으면 null)
 */
export function checkTestPhoneNumber(phone: string): {
  type: "existing_kakao" | "existing_naver" | "duplicate" | "normal";
  phone: string;
} | null {
  if (phone === TEST_PHONE_NUMBERS.EXISTING_KAKAO) {
    return { type: "existing_kakao", phone };
  }
  if (phone === TEST_PHONE_NUMBERS.EXISTING_NAVER) {
    return { type: "existing_naver", phone };
  }
  if (phone === TEST_PHONE_NUMBERS.DUPLICATE) {
    return { type: "duplicate", phone };
  }
  if (phone === TEST_PHONE_NUMBERS.NORMAL) {
    return { type: "normal", phone };
  }
  return null;
}
