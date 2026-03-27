/* ========================================
   리뷰어 대시보드 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 리뷰어 대시보드 메인페이지 API 응답 타입 정의 (20번: GET /user)
 *
 * 사용 위치:
 * - src/lib/api/userDashboard.ts
 * - src/hooks/user/useUserDashboard.ts
 */

/** 대시보드 API 단건 캠페인 아이템 */
export interface UserDashboardCampaignItem {
  campaignId: number;
  type: "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION";
  status:
    | "REGISTERING"
    | "RECRUITING"
    | "CLOSED"
    | "SELECTING"
    | "PURCHASING"
    | "EMERGENCY"
    | "DRAFT";
  title: string;
  thumbnail: { attachmentId?: number; fileId?: number; url: string };
  category: { categoryId: number; categoryName: string };
  requiredPlatform: { channelId: number; channelName: string };
  region: { regionId: number; name: string; parentId: number | null } | null;
  recruit: {
    recruitLimit: number;
    recruitStartAt: string;
    recruitEndAt: string;
  };
  metrics: {
    appliedCount: number;
    selectedCount: number;
    applicationRate: number;
  };
  reward: {
    extraRewardPoint: number;
    paymentRewardPoint: number;
  };
}

/** 대시보드 배너 아이템 */
export interface UserDashboardBannerItem {
  bannerId: number;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
}

/** GET /user 대시보드 응답 */
export interface UserDashboardResponse {
  result: "OK";
  generatedAt: string;
  banners?: UserDashboardBannerItem[];
  sections: {
    highSelectionProbability: UserDashboardCampaignItem[];
    popularNow: UserDashboardCampaignItem[];
    similar?: UserDashboardCampaignItem[];
    ongoing: UserDashboardCampaignItem[];
  };
}
