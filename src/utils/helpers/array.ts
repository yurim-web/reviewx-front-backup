/* ========================================
   📚 배열 관련 헬퍼 함수
   ======================================== */

/**
 * 배열 조작 및 변환 유틸리티
 */

/**
 * 배열을 특정 크기로 분할 (chunk)
 *
 * @param array - 원본 배열
 * @param size - 청크 크기
 * @returns 분할된 2차원 배열
 *
 * 예시:
 * - chunk([1,2,3,4,5], 2) → [[1,2], [3,4], [5]]
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * 배열에서 중복 제거
 *
 * @param array - 원본 배열
 * @returns 중복이 제거된 배열
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * 배열을 무작위로 섞기
 *
 * @param array - 원본 배열
 * @returns 섞인 배열 (원본 배열은 변경되지 않음)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 배열이 비어있는지 확인
 *
 * @param array - 검사할 배열
 * @returns 비어있으면 true
 */
export const isArrayEmpty = <T>(array: T[] | null | undefined): boolean => {
  return !array || array.length === 0;
};

/**
 * 배열의 마지막 요소 가져오기
 *
 * @param array - 배열
 * @returns 마지막 요소 (배열이 비어있으면 undefined)
 */
export const last = <T>(array: T[]): T | undefined => {
  return array[array.length - 1];
};

/**
 * 배열의 첫 요소 가져오기
 *
 * @param array - 배열
 * @returns 첫 요소 (배열이 비어있으면 undefined)
 */
export const first = <T>(array: T[]): T | undefined => {
  return array[0];
};

/**
 * 배열을 특정 키로 그룹화
 *
 * @param array - 원본 배열
 * @param key - 그룹화할 키
 * @returns 그룹화된 객체
 *
 * 예시:
 * ```ts
 * const users = [
 *   { name: 'John', role: 'admin' },
 *   { name: 'Jane', role: 'user' },
 *   { name: 'Bob', role: 'admin' }
 * ];
 * groupBy(users, 'role')
 * // {
 * //   admin: [{ name: 'John', role: 'admin' }, { name: 'Bob', role: 'admin' }],
 * //   user: [{ name: 'Jane', role: 'user' }]
 * // }
 * ```
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
};
