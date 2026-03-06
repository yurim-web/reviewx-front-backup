/* ========================================
   대시보드 API Response 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 대시보드 메인페이지 API 응답 타입 정의 (20번: GET /reviewer/dashboard)
 *
 * 📌 사용 위치:
 * - src/lib/api/dashboard.ts
 * - src/hooks/user/useDashboard.ts
 */

/** 대시보드 캠페인 아이템 (sections 배열 내 단건) */
export interface DashboardApiItem {
  campaignId: number;
  type: string; // "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION"
  status: string; // "RECRUITING" | "CLOSED" | "SELECTING" | "EMERGENCY" 등
  title: string;
  thumbnail: {
    attachmentId?: number;
    fileId?: number;
    url: string;
  };
  category: {
    categoryId: number;
    categoryName: string;
  };
  requiredPlatform: {
    channelId: number;
    channelName: string;
  };
  region: {
    regionId: number;
    name: string;
    parentId: number | null;
  } | null;
  recruit: {
    recruitLimit: number;
    recruitStartAt: string; // ISO 8601
    recruitEndAt: string; // ISO 8601
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

/** 대시보드 API 응답 래퍼 */
export interface DashboardApiResponse {
  result: string;
  generatedAt: string;
  sections: {
    highSelectionProbability: DashboardApiItem[];
    popularNow: DashboardApiItem[];
    ongoing: DashboardApiItem[];
    similar?: DashboardApiItem[];
  };
}

/** 검색 API 단건 아이템 (21번: GET /reviewer/search) */
export interface SearchApiItem {
  campaignId: number;
  title: string;
  recruitLimit: number;
  campaignApplicationCount: number;
  imageUrl: string;
  categoryId: number;
  channelId: number;
}

/** 검색 API 응답 래퍼 */
export interface SearchApiResponse {
  result: string;
  items: SearchApiItem[];
}
