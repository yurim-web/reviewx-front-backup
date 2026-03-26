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
import type { CampaignEditPageResponse } from "@/types/api/partnerCampaign";
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

/**
 * CampaignFormData → POST /partner/campaign/edit 요청 body 변환
 * 모든 수정 가능한 필드를 포함
 */
export function formDataToEditRequest(
  formData: CampaignFormData,
  isUrgent: boolean
): Record<string, unknown> {
  const [recruitStart, recruitEnd] = (formData.recruitmentPeriod ?? "")
    .split("~")
    .map((s) => s.trim());
  const [contentStart, contentEnd] = (formData.registrationPeriod ?? "")
    .split("~")
    .map((s) => s.trim());

  const recruitStartAt = recruitStart ? `${recruitStart}T00:00:00` : undefined;
  const recruitEndAt = recruitEnd ? `${recruitEnd}T00:00:00` : undefined;
  const contentStartAt = contentStart ? `${contentStart}T00:00:00` : undefined;
  const contentEndAt = contentEnd ? `${contentEnd}T00:00:00` : undefined;

  return {
    title: formData.title,
    description: formData.providedItems,
    recruitLimit: Number(formData.recruitmentCount) || undefined,
    extraRewardPoint: Number(formData.additionalPoints ?? 0),
    paymentRewardPoint: Number(formData.purchasePoints ?? 0),
    // 날짜 필드 (flat + nested 모두 저장 — 관리/상세 페이지 호환)
    recruitStartAt,
    recruitEndAt,
    contentStartAt,
    contentEndAt,
    recruit: {
      recruitLimit: Number(formData.recruitmentCount) || undefined,
      recruitStartAt,
      recruitEndAt,
    },
    content: {
      contentStartAt,
      contentEndAt,
    },
    promotionUrl: formData.promotionLink,
    promotionLink: formData.promotionLink,
    keyword: formData.keywords,
    notification: formData.guidelines,
    is_urgent: isUrgent,
    contact_phone: formData.contactPhone,
    // 플랫폼 (한글 → 영문 변환)
    requiredPlatform: formData.platform
      ? { channelName: platformToChannelName(formData.platform) }
      : undefined,
    // 카테고리
    category: formData.category ? { categoryName: formData.category } : undefined,
    // 이미지 (mock 환경: preview URL 저장)
    thumbnailUrl: formData.thumbnailImageUrl || undefined,
    thumbnail: formData.thumbnailImageUrl ? { url: formData.thumbnailImageUrl } : undefined,
    detailImages: formData.detailImagePreviews?.length ? formData.detailImagePreviews : undefined,
    // 기본 미션 설정
    keywordPolicy: {
      keyword: formData.keywords || "",
      minTextLength: Number(formData.minTextLength ?? 0),
      minPhotoCount: Number(formData.minImageCount ?? 0),
      minVideoCount: Number(formData.videoCount ?? 0),
      minVideoDuration: Number(formData.videoDuration ?? 0),
      requireBodyLink: Boolean(formData.requireLinkAttachment),
      requireKeywordAttachment: Boolean(formData.requireKeywordAttachment),
    },
    // 리워드 (관리 카드용)
    reward: {
      extraRewardPoint: Number(formData.additionalPoints ?? 0),
      paymentRewardPoint: Number(formData.purchasePoints ?? 0),
    },
    // 체크박스 옵션
    adultOnly: formData.adultOnly,
    allowReParticipation: formData.allowReParticipation,
    allowLateSubmission: formData.allowLateSubmission,
    isEmergency: isUrgent,
    // 방문형 전용
    visitAddress: formData.visitBaseAddress || undefined,
    visitBaseAddress: formData.visitBaseAddress || undefined,
    visitZipCode: formData.visitZipCode || undefined,
    visitDetailAddress: formData.visitDetailAddress || undefined,
    addressGuide: formData.addressDetail || undefined,
    visitLink: formData.visitLink || undefined,
    // 미션형 전용
    requireContentLink: formData.requireContentLink,
    requireContentImage: formData.requireContentImage,
  };
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

/**
 * 수정 API 응답 (GET /partner/campaign/edit/{id}) → CampaignFormData 변환
 * 15번 API 응답 구조에 맞춤
 */
// 단축형 → 전체 시/도 이름 매핑 (드롭다운 옵션과 일치시키기 위해)
const REGION_FULL_NAME: Record<string, string> = {
  서울: "서울특별시",
  인천: "인천광역시",
  경기: "경기도",
  강원: "강원특별자치도",
  대전: "대전광역시",
  세종: "세종특별자치시",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전라북도",
  전남: "전라남도",
  광주: "광주광역시",
  대구: "대구광역시",
  경북: "경상북도",
  경남: "경상남도",
  부산: "부산광역시",
  울산: "울산광역시",
  제주: "제주특별자치도",
};

export function editApiResponseToFormData(response: CampaignEditPageResponse): CampaignFormData {
  const c = response.campaign;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = c as any;
  const kp = c.keywordPolicy;

  // 방문형 region 분리
  let region = "";
  let subRegion = "";
  if (c.region) {
    const name = c.region.name || "";
    // "서울/성수" 또는 "서울 > 강남구" 형태 모두 처리
    const parts = name.includes("/")
      ? name.split("/").map((s) => s.trim())
      : name.split(">").map((s) => s.trim());
    if (parts.length >= 2) {
      region = parts[0];
      subRegion = parts[1];
    } else {
      region = name;
    }
    // 단축형 → 전체 이름 변환 (드롭다운 매칭용)
    region = REGION_FULL_NAME[region] || region;
  }

  // 구매평 구매 링크/포인트
  const isPurchase = c.type === "PURCHASE";
  const purchaseLink = ext.purchaseInfo?.purchaseLink ?? c.promotionUrl ?? "";
  const purchasePoints = ext.purchaseInfo?.purchasePoint ?? c.reward?.paymentRewardPoint ?? 0;

  return {
    campaignType: TYPE_MAP[c.type] ?? "배송형",
    platform: c.requiredPlatform ? (PLATFORM_MAP[c.requiredPlatform.channelName] ?? "") : "",
    title: c.title,
    category: c.category?.categoryName ?? "",
    thumbnailImageUrl: c.thumbnail?.url ?? "",
    brandName: response.partner?.businessName ?? "",
    providedItems: c.description ?? "",
    additionalPoints: c.reward?.extraRewardPoint ?? 0,
    currentPoints: response.partner?.currentPoint ?? 0,
    purchasePoints,
    recruitmentCount: c.recruit?.recruitLimit ?? 0,
    recruitmentPeriod:
      c.recruit?.recruitStartAt && c.recruit?.recruitEndAt
        ? formatPeriod(c.recruit.recruitStartAt, c.recruit.recruitEndAt)
        : "",
    announcementDate: c.recruit?.selectedAt ? formatDate(c.recruit.selectedAt) : "",
    registrationPeriod:
      c.recruit?.contentStartAt && c.recruit?.contentEndAt
        ? formatPeriod(c.recruit.contentStartAt, c.recruit.contentEndAt)
        : "",
    keywords: kp?.keyword ?? "",
    adultOnly: ext.adultOnly ?? false,
    allowReParticipation: ext.allowReParticipation ?? false,
    allowLateSubmission: ext.allowLateSubmission ?? false,
    minTextLength: kp?.minTextLength ?? 0,
    minImageCount: kp?.minPhotoCount ?? 0,
    videoCount: kp?.minVideoCount ?? 0,
    videoDuration: kp?.minVideoDuration ?? 0,
    requireLinkAttachment: kp?.requireBodyLink ?? false,
    requireKeywordAttachment: kp?.requireKeywordAttachment ?? false,
    guidelines: c.notification ?? "",
    contactPhone: ext.contact_phone ?? "",
    isUrgent: ext.isEmergency ?? false,
    fairTradeAgreement: true,
    promotionLink: isPurchase ? purchaseLink : (c.promotionUrl ?? ""),
    // 방문형
    visitLink: c.type === "VISIT" ? (c.promotionUrl ?? "") : "",
    region,
    subRegion,
    visitZipCode: ext.visitZipCode ?? "",
    visitBaseAddress: c.visitAddress ?? "",
    visitDetailAddress: ext.visitDetailAddress ?? "",
    addressDetail: ext.addressGuide ?? "",
    // 구매평
    purchasePeriod: ext.purchasePeriod ?? "",
    // 미션형
    requireContentLink: ext.requireContentLink ?? false,
    requireContentImage: ext.requireContentImage ?? false,
    detailImagePreviews: c.detailImages?.map((img) => img.url) ?? [],
  };
}
