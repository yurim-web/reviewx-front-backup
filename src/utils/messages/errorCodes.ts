/* ========================================
   📋 에러 메시지 코드 상수 정의
   ======================================== */

/**
 * 모듈 목적
 *
 * - 기능명세서에 정의된 모든 에러 메시지 코드를 상수로 관리
 * - 백엔드 API 응답과 프론트엔드 에러 처리를 연결
 * - 메시지 코드와 메시지 텍스트를 매핑
 *
 * 📌 사용 방법:
 * - API 응답에서 에러 코드를 받으면 이 상수를 사용하여 처리
 * - 에러 메시지를 표시할 때 코드와 함께 로깅
 * - 백엔드 개발자와 코드 공유 시 이 파일을 참조
 *
 * 📍 사용 위치:
 * - API 에러 처리 함수
 * - 폼 유효성 검증
 * - 모달/알림 표시
 */

/**
 * ========================================
 * 입력 오류 메시지 코드 (Input Error)
 * ========================================
 *
 * I_E: Input Error의 약자
 * 회원가입, 로그인, 비밀번호 재설정 등 입력 관련 에러
 */
export const INPUT_ERROR_CODES = {
  /** 휴대폰 중복 */
  PHONE_DUPLICATE: "I_E1",
  /** 닉네임 중복 */
  NICKNAME_DUPLICATE: "I_E2",
  /** 비밀번호 형식 오류 */
  PASSWORD_FORMAT: "I_E3",
  /** 비밀번호 확인 불일치 */
  PASSWORD_MISMATCH: "I_E4",
  /** 인증번호 불일치 */
  VERIFICATION_CODE_MISMATCH: "I_E5",
  /** 인증번호 안내 (헬프 메시지) */
  VERIFICATION_CODE_HELP: "I_E6",
  /** 아이디/비밀번호 불일치 */
  ID_PASSWORD_MISMATCH: "I_E7",
  /** 비밀번호 재설정 오류 (기존 비밀번호 사용 불가) */
  PASSWORD_RESET_SAME: "I_E8",
  /** 주민등록번호 오류 */
  RESIDENT_NUMBER_ERROR: "I_E9",
  /** 인증번호 시간 초과 */
  VERIFICATION_CODE_TIMEOUT: "I_E10",
  /** 정지/탈퇴된 계정 */
  ACCOUNT_BLOCKED: "I_E11",
  /** 계정 정보 불일치 */
  ACCOUNT_NOT_FOUND: "I_E12",
  /** 아이디 중복 */
  ID_DUPLICATE: "I_E13",
  /** 인증번호 5회 초과 */
  VERIFICATION_CODE_LIMIT_EXCEEDED: "I_E14",
  /** 카테고리 중복 불가 */
  CATEGORY_DUPLICATE: "I_E15",
} as const;

/**
 * ========================================
 * 채널 연동 오류 메시지 코드 (Channel Error)
 * ========================================
 *
 * C_E: Channel Error의 약자
 * SNS 채널 연동 관련 에러
 */
export const CHANNEL_ERROR_CODES = {
  /** 채널 확인 불가 */
  CHANNEL_NOT_FOUND: "C_E1",
  /** 중복 채널 */
  CHANNEL_DUPLICATE: "C_E2",
  /** 검증 실패 */
  CHANNEL_VERIFICATION_FAILED: "C_E3",
  /** 링크 입력 오류 (일반 SNS) */
  CHANNEL_LINK_INPUT_ERROR: "C_E4",
  /** 유튜브 링크 입력 오류 */
  YOUTUBE_LINK_INPUT_ERROR: "C_E5",
} as const;

/**
 * ========================================
 * 출금 신청 오류 메시지 코드 (Withdrawal Error)
 * ========================================
 *
 * W_E: Withdrawal Error의 약자
 * 포인트 출금 관련 에러
 */
export const WITHDRAWAL_ERROR_CODES = {
  /** 출금 최소 금액 오류 */
  WITHDRAWAL_MIN_AMOUNT: "W_E1",
  /** 출금 최대 금액 오류 */
  WITHDRAWAL_MAX_AMOUNT: "W_E2",
  /** 출금 보유 포인트 초과 */
  WITHDRAWAL_INSUFFICIENT_POINTS: "W_E3",
} as const;

/**
 * ========================================
 * 포인트 오류 메시지 코드 (Point Error)
 * ========================================
 *
 * P_E: Point Error의 약자
 * 포인트 관련 에러
 */
export const POINT_ERROR_CODES = {
  /** 보유 포인트 부족 */
  INSUFFICIENT_POINTS: "P_E3",
} as const;

/**
 * ========================================
 * 캠페인 관련 메시지 코드 (Campaign Response)
 * ========================================
 *
 * A_R: Application Response의 약자
 * 캠페인 신청/수정 관련 안내 메시지
 */
export const CAMPAIGN_RESPONSE_CODES = {
  /** 캠페인 선정 */
  CAMPAIGN_SELECTED: "A_R1",
  /** 캠페인 수정 */
  CAMPAIGN_MODIFIED: "A_R2",
} as const;

/**
 * ========================================
 * 모든 에러 코드 타입 정의
 * ========================================
 */
export type InputErrorCode =
  (typeof INPUT_ERROR_CODES)[keyof typeof INPUT_ERROR_CODES];
export type ChannelErrorCode =
  (typeof CHANNEL_ERROR_CODES)[keyof typeof CHANNEL_ERROR_CODES];
export type WithdrawalErrorCode =
  (typeof WITHDRAWAL_ERROR_CODES)[keyof typeof WITHDRAWAL_ERROR_CODES];
export type PointErrorCode =
  (typeof POINT_ERROR_CODES)[keyof typeof POINT_ERROR_CODES];
export type CampaignResponseCode =
  (typeof CAMPAIGN_RESPONSE_CODES)[keyof typeof CAMPAIGN_RESPONSE_CODES];

export type ErrorCode =
  | InputErrorCode
  | ChannelErrorCode
  | WithdrawalErrorCode
  | PointErrorCode
  | CampaignResponseCode;

/**
 * ========================================
 * 에러 코드와 메시지 텍스트 매핑
 * ========================================
 *
 * 백엔드에서 에러 코드를 받으면 이 매핑을 통해 메시지를 표시
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // 입력 오류 메시지
  [INPUT_ERROR_CODES.PHONE_DUPLICATE]: "이미 가입된 휴대폰 번호입니다.",
  [INPUT_ERROR_CODES.NICKNAME_DUPLICATE]: "이미 사용 중인 닉네임입니다.",
  [INPUT_ERROR_CODES.PASSWORD_FORMAT]:
    "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.",
  [INPUT_ERROR_CODES.PASSWORD_MISMATCH]: "비밀번호가 일치하지 않습니다.",
  [INPUT_ERROR_CODES.VERIFICATION_CODE_MISMATCH]:
    "인증번호가 일치하지 않습니다.",
  [INPUT_ERROR_CODES.VERIFICATION_CODE_HELP]: "인증번호를 받지 못 하셨나요?",
  [INPUT_ERROR_CODES.ID_PASSWORD_MISMATCH]:
    "아이디 또는 비밀번호가 일치하지 않습니다.",
  [INPUT_ERROR_CODES.PASSWORD_RESET_SAME]:
    "기존 비밀번호는 사용할 수 없습니다.",
  [INPUT_ERROR_CODES.RESIDENT_NUMBER_ERROR]:
    "주민등록번호를 정확히 입력해 주세요.",
  [INPUT_ERROR_CODES.VERIFICATION_CODE_TIMEOUT]:
    "인증번호 입력 시간을 초과했습니다.",
  [INPUT_ERROR_CODES.ACCOUNT_BLOCKED]: "정지되었거나 탈퇴된 계정입니다.",
  [INPUT_ERROR_CODES.ACCOUNT_NOT_FOUND]:
    "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
  [INPUT_ERROR_CODES.ID_DUPLICATE]: "이미 사용 중인 아이디입니다.",
  [INPUT_ERROR_CODES.VERIFICATION_CODE_LIMIT_EXCEEDED]:
    "인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요.",
  [INPUT_ERROR_CODES.CATEGORY_DUPLICATE]: "이미 사용 중인 카테고리명입니다.",

  // 채널 연동 오류 메시지
  [CHANNEL_ERROR_CODES.CHANNEL_NOT_FOUND]: "채널을 찾을 수 없습니다.",
  [CHANNEL_ERROR_CODES.CHANNEL_DUPLICATE]: "이미 등록된 채널입니다.",
  [CHANNEL_ERROR_CODES.CHANNEL_VERIFICATION_FAILED]:
    "채널 정보를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  [CHANNEL_ERROR_CODES.CHANNEL_LINK_INPUT_ERROR]:
    "{SNS이름} 아이디만 입력해 주세요.",
  [CHANNEL_ERROR_CODES.YOUTUBE_LINK_INPUT_ERROR]:
    "{SNS이름} 핸들(아이디)만 입력해 주세요.",

  // 출금 신청 오류 메시지
  [WITHDRAWAL_ERROR_CODES.WITHDRAWAL_MIN_AMOUNT]:
    "출금은 최소 10,000원부터 신청할 수 있습니다.",
  [WITHDRAWAL_ERROR_CODES.WITHDRAWAL_MAX_AMOUNT]:
    "출금은 최대 500,000원까지 신청할 수 있습니다.",
  [WITHDRAWAL_ERROR_CODES.WITHDRAWAL_INSUFFICIENT_POINTS]:
    "출금은 보유 포인트 이내에서만 신청할 수 있습니다.",

  // 포인트 오류 메시지
  [POINT_ERROR_CODES.INSUFFICIENT_POINTS]:
    "보유 포인트가 부족합니다. 포인트를 충전한 후 다시 시도해 주세요.",

  // 캠페인 관련 메시지
  [CAMPAIGN_RESPONSE_CODES.CAMPAIGN_SELECTED]:
    "축하드립니다! 캠페인에 선정되셨습니다.",
  [CAMPAIGN_RESPONSE_CODES.CAMPAIGN_MODIFIED]:
    "참여 중인 캠페인 정보가 수정되었습니다.",
};

/**
 * ========================================
 * 에러 코드로 메시지 가져오기
 * ========================================
 *
 * @param code - 에러 코드 (예: 'I_E1')
 * @param replaceValues - 메시지 내 변수 치환 값 (예: {SNS이름: '인스타그램'})
 * @returns 에러 메시지 텍스트
 *
 * @example
 * ```typescript
 * getErrorMessage('I_E1'); // '이미 가입된 휴대폰 번호입니다.'
 * getErrorMessage('C_E4', { SNS이름: '인스타그램' }); // '인스타그램 아이디만 입력해 주세요.'
 * ```
 */
export function getErrorMessage(
  code: ErrorCode,
  replaceValues?: Record<string, string>
): string {
  let message = ERROR_MESSAGES[code] || "알 수 없는 오류가 발생했습니다.";

  // 변수 치환 (예: {SNS이름} -> '인스타그램')
  if (replaceValues) {
    Object.entries(replaceValues).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
  }

  return message;
}

/**
 * ========================================
 * 에러 코드 유효성 검증
 * ========================================
 *
 * @param code - 검증할 코드
 * @returns 유효한 에러 코드인지 여부
 */
export function isValidErrorCode(code: string): code is ErrorCode {
  return code in ERROR_MESSAGES;
}
