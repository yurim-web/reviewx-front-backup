/* ========================================
   파트너 캠페인 등록/수정/임시저장 API 타입
   ======================================== */

/**
 * 파트너 캠페인 등록/수정 관련 API 타입 정의
 *
 * API:
 * - 09번: GET /partner/campaign/create (등록페이지 조회)
 * - 10번: POST /partner/campaign/create (캠페인 등록)
 * - 11번: POST /partner/campaign/draft (임시저장)
 * - 12번: GET /partner/campaign/draft/{campaignId} (임시저장 불러오기)
 * - 15번: GET /partner/campaign/edit/{campaignId} (수정페이지 조회)
 * - 16번: POST /partner/campaign/edit/{campaignId} (캠페인 수정)
 *
 * 사용 위치:
 * - src/lib/api/partnerCampaign.ts
 * - src/hooks/partner/campaign_create_form/useCampaignCreatePage.ts
 * - src/utils/partner/campaignRegistration/registerCampaignBase.ts
 * - src/app/partner/campaign/edit/
 */

// ── 캠페인 유형 ──

export type CampaignType = "DELIVERY" | "VISIT" | "PURCHASE" | "REPORTER" | "MISSION";

// ── GET /partner/campaign/create 응답 ──

export interface CampaignCreatePageResponse {
  result: "OK";
  generatedAt: string;
  partner: {
    partnerId: number;
    businessName: string;
    currentPoint: number;
  };
  categories: Array<{
    categoryId: number;
    categoryName: string;
  }>;
  channels: Array<{
    channelId: number;
    channelName: string;
  }>;
  regions: Array<{
    regionId: number;
    name: string;
    level: number;
    parentId: number | null;
  }>;
}

// ── POST /partner/campaign/create 공통 Request 필드 ──

export interface CreateCampaignRequest {
  type: CampaignType;
  categoryId: number;
  requiredPlatformId?: number;
  title: string;
  description: string;
  thumbnailImage: File;
  detailImages: File[];
  recruitLimit: number;
  recruitStartAt: string;
  recruitEndAt: string;
  selectedAt: string;
  contentStartAt: string;
  contentEndAt: string;
  extraRewardPoint?: number;
  paymentRewardPoint?: number;
  promotionUrl?: string;
  keyword?: string;
  notification?: string;
  regionId?: number;
  visitAddress?: string;
  // 프론트엔드 전용 필드 (백엔드 미구현)
  is_urgent: boolean;
  contact_phone: string;
  ftc_agreement: boolean;
}

// ── 유형별 Request 타입 ──

export interface DeliveryCampaignRequest extends Omit<
  CreateCampaignRequest,
  "type" | "requiredPlatformId"
> {
  type: "DELIVERY";
  requiredPlatformId: number;
}

export interface VisitCampaignRequest extends Omit<
  CreateCampaignRequest,
  "type" | "requiredPlatformId" | "regionId" | "visitAddress"
> {
  type: "VISIT";
  requiredPlatformId: number;
  regionId: number;
  visitAddress: string;
}

export interface PurchaseCampaignRequest extends Omit<CreateCampaignRequest, "type"> {
  type: "PURCHASE";
}

export interface ReporterCampaignRequest extends Omit<
  CreateCampaignRequest,
  "type" | "requiredPlatformId"
> {
  type: "REPORTER";
  requiredPlatformId: number;
}

export type MissionSubmitOption = "link" | "image" | "both";

export interface MissionCampaignRequest extends Omit<
  CreateCampaignRequest,
  "type" | "requiredPlatformId"
> {
  type: "MISSION";
  requiredPlatformId: number;
  submit_option: MissionSubmitOption;
}

// ── POST /partner/campaign/create 응답 ──

export interface CampaignCreateResponse {
  result: "OK";
  campaign: {
    campaignId: number;
    partnerId: number;
    type: CampaignType;
    status: string;
    title: string;
    category: { categoryId: number; categoryName: string };
    requiredPlatform?: { channelId: number; channelName: string };
    region?: { regionId: number; name: string; level: number; parentId: number | null };
    recruit: {
      recruitLimit: number;
      recruitStartAt: string;
      recruitEndAt: string;
      selectedAt: string;
      contentStartAt: string;
      contentEndAt: string;
    };
    reward: {
      extraRewardPoint: number;
      paymentRewardPoint: number;
    };
    regAt: string;
  };
  partner: { partnerId: number; currentPoint: number };
  next: { action: string; redirectPath: string };
}

// ── POST /partner/campaign/draft 응답 ──

export interface CampaignDraftSaveResponse {
  result: "OK";
  generatedAt: string;
  campaign: {
    campaignId: number;
    partnerId: number;
    type: CampaignType;
    status: "DRAFT";
    title: string;
    category: { categoryId: number; categoryName: string };
    thumbnail?: {
      attachmentId: number;
      fileId: number;
      url: string;
    };
    savedAt: string;
  };
  message: string;
}

// ── GET /partner/campaign/edit/{campaignId} 응답 (15번 API) ──

export interface CampaignEditPageResponse {
  result: "OK";
  generatedAt: string;
  partner: {
    partnerId: number;
    businessName: string;
    currentPoint: number;
  };
  campaign: {
    campaignId: number;
    partnerId: number;
    type: CampaignType;
    status: string;
    title: string;
    description: string;
    category: { categoryId: number; categoryName: string };
    requiredPlatform?: { channelId: number; channelName: string };
    region?: { regionId: number; name: string; level: number; parentId: number | null };
    thumbnail: { attachmentId: number; fileId: number; url: string };
    detailImages: Array<{
      attachmentId: number;
      fileId: number;
      url: string;
      displayOrder: number;
    }>;
    recruit: {
      recruitLimit: number;
      recruitStartAt: string;
      recruitEndAt: string;
      selectedAt: string;
      contentStartAt: string;
      contentEndAt: string;
    };
    reward: {
      extraRewardPoint: number;
      paymentRewardPoint: number;
    };
    promotionUrl?: string;
    keyword?: string;
    notification?: string;
    visitAddress?: string;
    keywordPolicy?: {
      keyword: string;
      minTextLength: number;
      minPhotoCount: number;
      requireBodyLink: boolean;
      requireKeywordAttachment?: boolean;
      minVideoCount?: number;
      minVideoDuration?: number;
    };
    regAt: string;
    updatedAt?: string;
  };
  categories: Array<{ categoryId: number; categoryName: string }>;
  channels: Array<{ channelId: number; channelName: string }>;
  regions: Array<{ regionId: number; name: string; level: number; parentId: number | null }>;
}

// ── POST /partner/campaign/edit/{campaignId} 요청 (16번 API) ──

export type UpdateCampaignRequest = Partial<
  Omit<CreateCampaignRequest, "thumbnailImage" | "detailImages">
> & {
  thumbnailImage?: File;
  detailImages?: File[];
};

// ── POST /partner/campaign/edit/{campaignId} 응답 (16번 API) ──

export interface CampaignEditResponse {
  result: "OK";
  generatedAt: string;
  campaign: {
    campaignId: number;
    partnerId: number;
    type: CampaignType;
    status: string;
    title: string;
    category: { categoryId: number; categoryName: string };
    requiredPlatform?: { channelId: number; channelName: string };
    region?: { regionId: number; name: string; level: number; parentId: number | null };
    recruit: {
      recruitLimit: number;
      recruitStartAt: string;
      recruitEndAt: string;
      selectedAt: string;
      contentStartAt: string;
      contentEndAt: string;
    };
    reward: {
      extraRewardPoint: number;
      paymentRewardPoint: number;
    };
    regAt: string;
    updatedAt: string;
  };
  partner: { partnerId: number; currentPoint: number };
  message: string;
}

// ── GET /partner/campaign/draft/{campaignId} 응답 ──

export interface CampaignDraftLoadResponse {
  result: "OK";
  generatedAt: string;
  campaign: {
    campaignId: number;
    partnerId: number;
    type: CampaignType;
    status: "DRAFT";
    title: string;
    description?: string;
    category?: { categoryId: number; categoryName: string };
    requiredPlatform?: { channelId: number; channelName: string };
    thumbnail?: { attachmentId: number; fileId: number; url: string };
    detailImages?: Array<{
      attachmentId: number;
      fileId: number;
      url: string;
      displayOrder: number;
    }>;
    recruit?: {
      recruitLimit: number;
      recruitStartAt: string;
      recruitEndAt: string;
    };
    reward?: {
      extraRewardPoint: number;
      paymentRewardPoint: number;
    };
    regionId?: number;
    visitAddress?: string;
    promotionUrl?: string;
    keyword?: string;
    notification?: string;
    savedAt: string;
    updatedAt?: string;
  };
}
