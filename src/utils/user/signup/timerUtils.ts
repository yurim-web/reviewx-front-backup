/* ========================================
   🛠️ 타이머 유틸리티 함수
   ======================================== */

/**
 * 모듈 목적
 *
 * - 시간 포맷팅 로직 관리
 * - 초 단위 시간을 MM:SS 형식으로 변환
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

