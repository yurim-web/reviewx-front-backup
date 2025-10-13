/**
 * 공통 캠페인 데이터 인터페이스
 */
export interface Campaign {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  image: string;
  subcategory: string;
  points: number;
  description: string;
  recruitment: {
    current: number;
    total: number;
  };
  schedule: string;
  dayCount: string;
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
    announcement: string;
    purchasePeriod: string;
  };
  campaign_detail_image: string;
  channel: string;
}

/**
 * 캠페인 타입별 설정
 */
export interface CampaignTypeConfig {
  // 캠페인 타입 (배송형, 방문형, 구매평, 체험단, 기자단)
  type: "delivery" | "visit" | "review" | "experience" | "reporter";

  // 네 번째 정보 항목의 라벨 (구매 기간, 방문 기간, 체험 기간, 활동 기간)
  periodLabel: string;

  // 이미지 alt 텍스트
  imageAlt: string;

  // 요구사항 정보
  requirements: {
    text: string;
    photos: string;
    video: string;
    linkLabel: string;
  };

  // 안내 사항 텍스트들
  guidelines: {
    intro: string;
    mainNotice: string;
    detailedInfo: string[];
    campaignType: string;
    warnings: string;
  };

  // 추가 안내 사항 커스텀 텍스트
  additionalGuidelines?: {
    addressChangeText?: string;
    contentTypeText?: string;
  };

  // ApplicationModal 표시 여부
  showApplicationModal?: boolean;
}
