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
  NAVER_CLIP: "네이버 클립",
  INSTAGRAM: "인스타그램",
  INSTAGRAM_REELS: "릴스",
  REELS: "릴스",
  YOUTUBE: "유튜브",
  YOUTUBE_SHORTS: "쇼츠",
  TIKTOK: "릴스",
  COUPANG: "네이버 블로그",
};

// 한글 플랫폼명 → 영문 channelName 역매핑 (PATCH용)
const REVERSE_PLATFORM_MAP: Record<string, string> = {
  "네이버 블로그": "NAVER_BLOG",
  "네이버 클립": "NAVER_CLIP",
  인스타그램: "INSTAGRAM",
  릴스: "INSTAGRAM_REELS",
  유튜브: "YOUTUBE",
  쇼츠: "YOUTUBE_SHORTS",
};

export function platformToChannelName(platform: string): string {
  return REVERSE_PLATFORM_MAP[platform] ?? platform;
}

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
    minVideoCount?: number;
    minVideoDuration?: number;
    requireBodyLink?: boolean;
  };
  notification?: string;
  isEmergency?: boolean;
  contact_phone?: string;
  // 배송형·기자단·미션형 홍보 링크
  promotionLink?: string;
  productLink?: string;
  // 방문형
  visitLink?: string;
  visitAddress?: string;
  region?: string;
  visitZipCode?: string;
  visitBaseAddress?: string;
  visitDetailAddress?: string;
  addressDetail?: string;
  addressGuide?: string; // DB에서 오시는길 안내 필드명
  // 구매평
  purchaseLink?: string;
  purchasePeriod?: string;
  purchaseInfo?: {
    purchaseLink?: string;
    purchasePoint?: number;
  };
  // 미션형
  requireContentLink?: boolean;
  requireContentImage?: boolean;
  // 상세 이미지
  detailImages?: string[];
}

export function apiCampaignToFormData(item: PartnerCampaignApiItem): CampaignFormData {
  const ext = item as DbCampaignExtra;

  // 구매평 구매 링크: purchaseInfo.purchaseLink > root purchaseLink > promotionLink 순
  const purchaseLink =
    ext.purchaseInfo?.purchaseLink ?? ext.purchaseLink ?? ext.promotionLink ?? "";

  // 구매평 구매 포인트: purchaseInfo.purchasePoint > reward.paymentRewardPoint 순
  const purchasePoints = ext.purchaseInfo?.purchasePoint ?? item.reward?.paymentRewardPoint ?? 0;

  // 배송형·기자단·미션형 홍보 링크: promotionLink > productLink 순
  const promotionLink =
    item.type === "PURCHASE_REVIEW" || item.type === "PURCHASE"
      ? purchaseLink
      : (ext.promotionLink ?? ext.productLink ?? "");

  // 방문형 region 분리: "서울 > 강남구" → region="서울", subRegion="강남구"
  let region = "";
  let subRegion = "";
  if (ext.region) {
    const parts = ext.region.split(">").map((s) => s.trim());
    region = parts[0] ?? "";
    subRegion = parts[1] ?? "";
  }

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
    purchasePoints,
    recruitmentCount: item.recruitLimit ?? item.recruit?.recruitLimit ?? 0,
    recruitmentPeriod: formatPeriod(
      item.recruitStartAt ?? item.recruit?.recruitStartAt ?? "",
      item.recruitEndAt ?? item.recruit?.recruitEndAt ?? ""
    ),
    announcementDate: formatDate(item.content?.contentStartAt ?? ""),
    registrationPeriod: formatPeriod(
      item.content?.contentStartAt ?? "",
      item.content?.contentEndAt ?? ""
    ),
    keywords: ext.keywordPolicy?.keyword ?? "",
    adultOnly: item.adultOnly ?? false,
    allowReParticipation: item.allowReParticipation ?? false,
    allowLateSubmission: item.allowLateSubmission ?? false,
    minTextLength: ext.keywordPolicy?.minTextLength ?? 500,
    minImageCount: ext.keywordPolicy?.minPhotoCount ?? 3,
    videoCount: ext.keywordPolicy?.minVideoCount ?? 0,
    videoDuration: ext.keywordPolicy?.minVideoDuration ?? 0,
    requireLinkAttachment: ext.keywordPolicy?.requireBodyLink ?? false,
    requireKeywordAttachment: true,
    guidelines: ext.notification ?? "",
    contactPhone: ext.contact_phone ?? "",
    isUrgent: ext.isEmergency ?? false,
    // 수정 모드에서는 기 등록 시 이미 동의한 것으로 간주 → 체크박스 자동 체크
    fairTradeAgreement: true,
    // 홍보·구매 링크
    promotionLink,
    // 방문형
    visitLink: ext.visitLink ?? "",
    region,
    subRegion,
    visitZipCode: ext.visitZipCode ?? "",
    visitBaseAddress: ext.visitBaseAddress ?? ext.visitAddress ?? "",
    visitDetailAddress: ext.visitDetailAddress ?? "",
    addressDetail: ext.addressDetail ?? ext.addressGuide ?? "",
    // 구매평
    purchasePeriod: ext.purchasePeriod ?? "",
    // 미션형
    requireContentLink: ext.requireContentLink ?? false,
    requireContentImage: ext.requireContentImage ?? false,
    detailImagePreviews:
      ext.detailImages && ext.detailImages.length > 0
        ? ext.detailImages
        : item.thumbnailUrl
          ? [item.thumbnailUrl]
          : [],
  };
}
