/* ========================================
   💬 사용자 메시지 상수
   ======================================== */

/**
 * 에러 메시지
 *
 * 용도:
 * - 일관된 에러 메시지 제공
 * - 메시지 수정 시 한 곳에서 관리
 */
export const ERROR_MESSAGES = {
  // 이메일 관련
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  EMAIL_REQUIRED: '이메일을 입력해주세요.',

  // 비밀번호 관련
  INVALID_PASSWORD: '비밀번호는 8~16자, 영문/숫자/특수문자를 포함해야 합니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',

  // 휴대폰 관련
  INVALID_PHONE: '올바른 휴대폰 번호 형식이 아닙니다. (010-XXXX-XXXX)',
  PHONE_REQUIRED: '휴대폰 번호를 입력해주세요.',

  // 인증번호 관련
  INVALID_VERIFICATION_CODE: '인증번호는 6자리 숫자여야 합니다.',
  VERIFICATION_CODE_REQUIRED: '인증번호를 입력해주세요.',
  VERIFICATION_EXPIRED: '인증 시간이 만료되었습니다. 다시 요청해주세요.',

  // 금액 관련
  AMOUNT_TOO_LOW: (min: number) => `최소 ${min.toLocaleString()}원부터 입력할 수 있습니다.`,
  AMOUNT_TOO_HIGH: (max: number) => `최대 ${max.toLocaleString()}원까지 입력할 수 있습니다.`,
  AMOUNT_EXCEEDS_AVAILABLE: '보유 포인트 이내에서만 입력할 수 있습니다.',

  // 공통
  REQUIRED_FIELD: (fieldName: string) => `${fieldName}을(를) 입력해주세요.`,
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
} as const;

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  VERIFICATION_SENT: '인증번호가 발송되었습니다.',
  VERIFICATION_SUCCESS: '인증이 완료되었습니다.',
  SIGNUP_SUCCESS: '회원가입이 완료되었습니다.',
  SAVE_SUCCESS: '저장되었습니다.',
  DELETE_SUCCESS: '삭제되었습니다.',
} as const;

/**
 * 확인 메시지
 */
export const CONFIRM_MESSAGES = {
  DELETE_CONFIRM: '정말 삭제하시겠습니까?',
  CANCEL_CONFIRM: '작성 중인 내용이 사라집니다. 취소하시겠습니까?',
  LOGOUT_CONFIRM: '로그아웃 하시겠습니까?',
} as const;

/**
 * 정보성 메시지
 */
export const INFO_MESSAGES = {
  NO_DATA: '데이터가 없습니다.',
  LOADING: '로딩 중...',
  PLEASE_WAIT: '잠시만 기다려주세요.',
} as const;
