// 파트너 캠페인 타입 정의
export interface PartnerCampaign {
  id: string;
  title: string;
  type: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  status: "예정" | "신청" | "진행" | "종료" | "취소";
  deadline: string;
  remainingDays: number; // 남은 일수 (동적 계산된 값)
  statusMessage: string; // 상태별 메시지 (데이터에서 제공)
  applicants: number;
  recruits: number;
  submissions?: number;
  selected?: number;
  brand?: string; // 브랜드명 (쿠팡, 네이버쇼핑 등)
  brandLogo?: string; // 브랜드 로고 URL
  subStatus?: string; // 서브 상태 (버튼 종류 결정용)
  image?: string; // 카드 썸네일 이미지 URL
}

// 파트너 캠페인 통계 정보
export interface PartnerCampaignStats {
  전체: number;
  예정: number;
  신청: number;
  진행: number;
  종료: number;
  취소: number;
  패널티: number;
}

// 파트너 통계 탭 타입 정의
export type PartnerStatTab =
  | "전체"
  | "예정"
  | "신청"
  | "진행"
  | "종료"
  | "취소"
  | "패널티";

// 파트너 패널티 관련 타입 정의
export type PartnerPenaltyStatus =
  | "활동 가능"
  | "경고 조치"
  | "이용 정지 7일"
  | "이용 정지 15일"
  | "이용 정지 30일"
  | "영구 정지";

export type PartnerPenaltyType = "경고" | "주의" | "정지" | "제재";

export interface PartnerPenaltyHistoryItem {
  id: string;
  type: PartnerPenaltyType;
  reason: string;
  date: string;
  status: string;
}

export interface PartnerPenaltyStatusConfig {
  currentStatus: PartnerPenaltyStatus;
  className: string;
  stage: number; // 0: 활동가능, 1: 경고, 2: 주의, 3: 정지
  progress: number; // 진행률 (0-100)
}
