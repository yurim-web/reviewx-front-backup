/* ========================================
   🛠️ 타이머 유틸리티 함수 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 시간 포맷팅 로직 관리
 * - 초 단위 시간을 MM:SS 형식으로 변환
 *
 * 📌 위치 설명:
 * - 이 파일은 사용자와 파트너 회원가입 모두에서 공통으로 사용되는 유틸리티입니다.
 * - /utils/signup/ 폴더에 위치하여 user와 partner 모두에서 접근 가능합니다.
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/components/user/signup/PhoneVerification.tsx
 *   (사용자 회원가입 페이지의 휴대폰 인증 컴포넌트에서 타이머 표시에 사용)
 */

/**
 * 타이머 포맷팅
 * 초 단위 시간을 MM:SS 형식으로 변환
 *
 * @param seconds - 초 단위 시간
 * @returns MM:SS 형식의 문자열
 *
 * @example
 * formatTimer(240) // '4:00'
 * formatTimer(125) // '2:05'
 * formatTimer(5) // '0:05'
 */
export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
