// 캠페인 관리 관련 타입 정의

/**
 * 캠페인 신청/관리 정보 타입
 */
export interface CampaignApplication {
  id: string; // 고유 ID
  title: string; // 캠페인 제목
  category: string; // 카테고리 (네이버블로그, 쿠팡 등)
  categoryIcon: string; // 카테고리 아이콘 경로
  image: string; // 캠페인 대표 이미지
  status: "신청" | "선정" | "완료" | "취소/반려"; // 캠페인 진행 상태
  remainingDays: number; // 남은 일수
  type: "배송형" | "방문형"; // 캠페인 타입
  isUrgent: boolean; // 마감 임박 여부

  // 추가 상태 정보 (옵셔널)
  subStatus?:
    | "content_not_registered" // 콘텐츠 미등록 (선정 후 아직 등록 안함)
    | "content_registered" // 콘텐츠 등록 완료
    | "content_rejected" // 콘텐츠 반려됨 (수정 필요)
    | "penalty"; // 패널티 부과됨

  hasContent?: boolean; // 콘텐츠 보유 여부
  isPenalty?: boolean; // 패널티 여부
}

/**
 * 캠페인 통계 정보
 */
export interface CampaignStats {
  신청: number;
  선정: number;
  완료: number;
  "취소/반려": number;
  패널티: number;
}

/**
 * 탭 타입 정의
 */
export type MainTab = "campaign" | "point" | "account";
export type StatTab = "신청" | "선정" | "완료" | "취소/반려" | "패널티";
