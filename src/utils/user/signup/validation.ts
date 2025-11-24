/* ========================================
   🛠️ 회원가입 유효성 검증 함수 모음
   ======================================== */

/**
 * 모듈 목적
 *
 * - 회원가입 폼의 유효성 검증 로직을 재사용 가능한 순수 함수로 분리
 * - 컴포넌트 코드를 간결하게 유지하고 테스트 가능한 구조 제공
 */

/* ========================================
   📧 이메일 검증
   ======================================== */

/**
 * 이메일 형식 검증
 * @param email - 검증할 이메일 주소
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* ========================================
   🔒 비밀번호 검증
   ======================================== */

/**
 * 비밀번호 형식 검증
 * @param password - 검증할 비밀번호
 * @returns 유효한 비밀번호 형식이면 true, 아니면 false
 */
export function validatePassword(password: string): boolean {
  // 길이 검증 (8~16자)
  if (password.length < 8 || password.length > 16) {
    return false;
  }

  // 특수문자 포함 여부 확인
  const specialChars = /[!@#$%^&*()\-_=+]/;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = specialChars.test(password);

  return hasLetter && hasNumber && hasSpecial;
}

/**
 * 비밀번호 일치 확인
 * @param password - 원본 비밀번호
 * @param passwordConfirm - 확인용 비밀번호
 * @returns 일치하면 true, 아니면 false
 */
export function validatePasswordMatch(
  password: string,
  passwordConfirm: string,
): boolean {
  return password === passwordConfirm;
}

/* ========================================
   📱 휴대폰 번호 검증
   ======================================== */

/**
 * 휴대폰 번호 형식 검증
 * @param phone - 검증할 휴대폰 번호 (010-XXXX-XXXX 형식)
 * @returns 유효한 형식이면 true, 아니면 false
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
}

/* ========================================
   🔢 인증번호 검증
   ======================================== */

/**
 * 인증번호 형식 검증
 * @param code - 검증할 인증번호
 * @returns 6자리 숫자이면 true, 아니면 false
 */
export function validateVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

