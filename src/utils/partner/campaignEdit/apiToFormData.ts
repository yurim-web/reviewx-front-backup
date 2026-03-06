/* ========================================
   API 캠페인 → CampaignFormData 변환
   ======================================== */

/**
 * apiToFormData
 *
 * 목적: DB(json-server)의 캠페인 데이터를 CampaignFormData로 변환
 *       edit 페이지에서 getCampaignById가 null일 때 API fallback으로 사용
 *
 * 사용 페이지:
 * - /partner/campaign/edit/[type]/[id] (5개 캠페인 수정 페이지)
 */

import type { PartnerCampaignApiItem } from "@/types/api/partner";
import type { CampaignFormData, CampaignType, PlatformType } from "@/types/domain/user";

const TYPE_MAP: Record<string, CampaignType> = {
  DELIVERY: "배송형",
  VISIT: "방문형",
  PURCHASE: "구매평",
  PURCHASE_REVIEW: "구매평",
  REPORTER: "기자단",
  MISSION: "미션형",
};

const PLATFORM_MAP: Record<string, PlatformType> = {
  NAVER_BLOG: "네이버 블로그",
  INSTAGRAM: "인스타그램",
  YOUTUBE: "유튜브",
  TIKTOK: "릴스",
  COUPANG: "네이버 블로그",
};

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

function formatPeriod(startIso: string, endIso: string): string {
  return `${formatDate(startIso)} ~ ${formatDate(endIso)}`;
}

// DB 캠페인에는 keywordPolicy, notification, isEmergency 등 추가 필드가 있을 수 있음
interface DbCampaignExtra extends PartnerCampaignApiItem {
  keywordPolicy?: {
    keyword?: string;
    minTextLength?: number;
    minPhotoCount?: number;
    requireBodyLink?: boolean;
  };
  notification?: string;
  isEmergency?: boolean;
}

export function apiCampaignToFormData(item: PartnerCampaignApiItem): CampaignFormData {
  const ext = item as DbCampaignExtra;

  return {
    campaignType: TYPE_MAP[item.type] ?? "배송형",
    platform: PLATFORM_MAP[item.requiredPlatform?.channelName] ?? "",
    title: item.title,
    category: typeof item.category?.categoryName === "string" ? item.category.categoryName : "",
    thumbnailImageUrl: item.thumbnailUrl,
    brandName: "",
    providedItems: item.description ?? "",
    additionalPoints: item.reward?.extraRewardPoint ?? 0,
    currentPoints: 0,
    purchasePoints: item.reward?.paymentRewardPoint ?? 0,
    recruitmentCount: item.recruitLimit,
    recruitmentPeriod: formatPeriod(item.recruitStartAt, item.recruitEndAt),
    announcementDate: formatDate(item.content.contentStartAt),
    registrationPeriod: formatPeriod(item.content.contentStartAt, item.content.contentEndAt),
    keywords: ext.keywordPolicy?.keyword ?? "",
    adultOnly: item.adultOnly ?? false,
    allowReParticipation: item.allowReParticipation ?? false,
    allowLateSubmission: item.allowLateSubmission ?? false,
    minTextLength: ext.keywordPolicy?.minTextLength ?? 500,
    minImageCount: ext.keywordPolicy?.minPhotoCount ?? 3,
    requireLinkAttachment: ext.keywordPolicy?.requireBodyLink ?? false,
    requireKeywordAttachment: true,
    guidelines: ext.notification ?? "",
    isUrgent: ext.isEmergency ?? false,
  };
}
