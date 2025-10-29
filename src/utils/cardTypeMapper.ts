/* ========================================
   🎯 카드 유형 매핑 유틸리티
   ======================================== */

/**
 * 카드 유형 매핑 유틸리티
 *
 * 목적: brandName에 따라 적절한 카드 컴포넌트 경로를 반환하는 유틸리티입니다.
 *
 * 📌 동적 컴포넌트 로딩:
 * - brandName에 따라 다른 카드 유형의 컴포넌트 사용
 * - 코드 중복 방지 및 유지보수성 향상
 * - 확장 가능한 구조
 */

/**
 * 지원되는 카드 유형 목록
 */
export const SUPPORTED_CARD_TYPES = [
  "commoncard",
  "insta",
  "naverblog",
  "naverclip",
  "youtube",
] as const;

/**
 * 지원되는 브랜드 이름 목록
 */
export const SUPPORTED_BRAND_NAMES = [
  "인스타그램",
  "네이버블로그",
  "네이버클립",
  "유튜브",
  "기본",
] as const;
