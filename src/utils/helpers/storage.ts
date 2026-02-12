/* ========================================
   💾 로컬 스토리지 헬퍼 함수
   ======================================== */

/**
 * 로컬 스토리지 관련 유틸리티
 *
 * 기존 파일 참고:
 * - src/utils/community/posts/pinnedPostsLocalStorage.ts
 */

/**
 * 로컬 스토리지에 JSON 형태로 저장
 *
 * @param key - 스토리지 키
 * @param value - 저장할 값
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error);
  }
};

/**
 * 로컬 스토리지에서 JSON 형태로 가져오기
 *
 * @param key - 스토리지 키
 * @param defaultValue - 값이 없을 때 반환할 기본값
 * @returns 저장된 값 또는 기본값
 */
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * 로컬 스토리지에서 항목 제거
 *
 * @param key - 스토리지 키
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error);
  }
};

/**
 * 로컬 스토리지 전체 삭제
 */
export const clear = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

/**
 * 특정 키가 로컬 스토리지에 존재하는지 확인
 *
 * @param key - 스토리지 키
 * @returns 존재하면 true
 */
export const hasItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

/**
 * 세션 스토리지에 JSON 형태로 저장
 *
 * @param key - 스토리지 키
 * @param value - 저장할 값
 */
export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to save to sessionStorage (key: ${key}):`, error);
  }
};

/**
 * 세션 스토리지에서 JSON 형태로 가져오기
 *
 * @param key - 스토리지 키
 * @param defaultValue - 값이 없을 때 반환할 기본값
 * @returns 저장된 값 또는 기본값
 */
export const getSessionItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from sessionStorage (key: ${key}):`, error);
    return defaultValue;
  }
};
