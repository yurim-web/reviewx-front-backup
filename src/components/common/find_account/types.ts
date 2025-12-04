/* ========================================
   🔍 아이디/비밀번호 찾기 관련 타입 정의
   ======================================== */

/**
 * 아이디 찾기 결과 데이터 타입
 */
export interface AccountInfo {
  email: string;
  signupDate: string;
}

/**
 * 계정 조회 결과 타입
 */
export type AccountStatus = 'found' | 'not_found' | 'blocked' | 'sns_only';
