/* ========================================
   📋 캠페인 편집 관련 타입 정의
   ======================================== */

/**
 * 목적: 캠페인 데이터 변환 관련 타입 정의
 *
 * 사용 위치:
 * - src/utils/partner/campaignEdit/campaignToFormData.ts
 * - src/app/partner/campaign/edit/{타입}/[id]/page.tsx
 */

import type { CampaignType } from "@/types/domain/user";

/**
 * 캠페인 변환 옵션
 *
 * 일부 캠페인 타입에서만 필요한 추가 데이터를 제공합니다.
 */
export interface CampaignConversionOptions {
  /** 사용자 비즈니스 이름 (배송형에서만 사용) */
  userBusinessName?: string;
  /** 현재 포인트 (배송형에서만 동적으로 사용) */
  currentPoints?: number;
}

/**
 * 타입별 기본 플랫폼 맵
 *
 * 각 캠페인 타입별로 기본으로 사용되는 플랫폼을 정의합니다.
 */
export const DEFAULT_PLATFORMS: Record<CampaignType, string> = {
  배송형: "네이버 블로그",
  방문형: "네이버 블로그",
  구매평: "네이버 블로그",
  기자단: "인스타그램",
  미션형: "", // 미션형은 플랫폼이 없음
};

/**
 * 플랫폼 이름 정규화 맵
 *
 * 저장된 브랜드명을 표준 플랫폼 이름으로 변환합니다.
 * (예: "네이버블로그" → "네이버 블로그")
 */
export const BRAND_NAME_TO_PLATFORM: Record<string, string> = {
  네이버블로그: "네이버 블로그",
  네이버클립: "네이버 클립",
  인스타그램: "인스타그램",
  릴스: "릴스",
  유튜브: "유튜브",
  쇼츠: "쇼츠",
};

/**
 * 지역 매핑 (방문형 전용)
 *
 * 시/도 약칭을 전체 이름으로 변환합니다.
 */
export const REGION_FULL_NAMES: Record<string, string> = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};
