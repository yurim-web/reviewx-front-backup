/* ========================================
   📝 캠페인 관련 타입 정의
   ======================================== */

/**
 * 캠페인 관련 공통 타입들을 정의합니다.
 *
 * 목적: 모든 캠페인 컴포넌트에서 공통으로 사용되는 타입들을 중앙 관리
 *
 * 사용 컴포넌트:
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 컴포넌트들
 */

// 캠페인 유형 타입 정의
export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

// 플랫폼 타입 정의
export type PlatformType =
  | "네이버 블로그"
  | "네이버 클립"
  | "인스타그램"
  | "릴스"
  | "유튜브"
  | "쇼츠";

// 폼 데이터 타입 정의
export interface CampaignFormData {
  // 기본 정보
  campaignType: CampaignType;
  platform: PlatformType;
  title: string;
  category: string;
  region?: string; // 방문형에만 필요
  thumbnailImage?: File;
  detailImages?: File[];

  // 상세 정보
  brandName: string;
  providedItems: string;
  promotionLink?: string;
  visitLink?: string; // 방문형에만 필요
  visitAddress?: string; // 방문형에만 필요
  addressDetail?: string; // 방문형에만 필요
  currentPoints: number;
  additionalPoints: number;
  recruitmentCount: number;
  recruitmentPeriod: string;
  announcementDate: string;
  registrationPeriod: string;
  keywords: string;

  // 참여/제출 옵션
  adultOnly: boolean;
  allowReParticipation: boolean;
  allowLateSubmission: boolean;
  minTextLength: number;
  minImageCount: number;
  videoCount?: number;
  videoDuration?: number;
  requireLinkAttachment: boolean;
  requireKeywordAttachment: boolean;

  // 안내 사항
  guidelines: string;

  // 긴급 여부
  isUrgent: boolean;
}

// 캠페인 생성 폼 베이스 Props 인터페이스
export interface CampaignCreateFormBaseProps {
  campaignType: CampaignType;
  onSubmit: (data: CampaignFormData) => void;
  isSubmitting: boolean;
}
