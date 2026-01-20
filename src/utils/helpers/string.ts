/* ========================================
   📝 문자열 관련 헬퍼 함수
   ======================================== */

/**
 * 문자열 조작 및 변환 유틸리티
 */

/**
 * 문자열을 특정 길이로 자르고 "..." 추가
 *
 * @param str - 원본 문자열
 * @param maxLength - 최대 길이
 * @returns 잘린 문자열
 *
 * 예시:
 * - truncate("Hello World", 5) → "Hello..."
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * 첫 글자를 대문자로 변환
 *
 * @param str - 원본 문자열
 * @returns 첫 글자가 대문자인 문자열
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * kebab-case를 camelCase로 변환
 *
 * @param str - kebab-case 문자열
 * @returns camelCase 문자열
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * camelCase를 kebab-case로 변환
 *
 * @param str - camelCase 문자열
 * @returns kebab-case 문자열
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * 공백 제거 (양 끝 + 중간 연속 공백)
 *
 * @param str - 원본 문자열
 * @returns 공백이 제거된 문자열
 */
export const removeSpaces = (str: string): string => {
  return str.replace(/\s+/g, '');
};

/**
 * 연속된 공백을 하나로 축소
 *
 * @param str - 원본 문자열
 * @returns 공백이 정규화된 문자열
 */
export const normalizeSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * 문자열이 비어있는지 확인 (공백만 있어도 비어있다고 판단)
 *
 * @param str - 검사할 문자열
 * @returns 비어있으면 true
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 안전한 JSON 파싱 (에러 발생 시 기본값 반환)
 *
 * @param str - JSON 문자열
 * @param defaultValue - 파싱 실패 시 반환할 기본값
 * @returns 파싱된 객체 또는 기본값
 */
export const safeJsonParse = <T>(str: string, defaultValue: T): T => {
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
};
