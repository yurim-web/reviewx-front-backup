/* ========================================
   캠페인 등록 공통 베이스 함수
   ======================================== */

/**
 * registerCampaignBase
 *
 * 목적: 5개 캠페인 유형(배송/방문/구매평/미션/기자단)의 공통 등록 로직을 통합
 *
 * 사용처:
 * - deliveryRegistration.ts
 * - visitRegistration.ts
 * - reviewRegistration.ts
 * - missionRegistration.ts
 * - reporterRegistration.ts
 */

import { CampaignFormData } from "@/types/domain/user";
import { getPartnerName } from "@/utils/partner/partnerHelpers";
import { saveCampaignToStorage } from "@/utils/partner/campaignStorage";
import { postPartnerCampaign } from "@/lib/api/partner";
import { postCampaignCreate } from "@/lib/api/partnerCampaign";
import type { CreateCampaignRequest } from "@/types/api/partnerCampaign";

/** 캠페인 유형별 설정 */
export interface CampaignRegistrationConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCampaignFn: (formData: any, imageUrl: string) => any;
  /** 기본 이미지 URL */
  imageUrl: string;
  /** localStorage 저장 키 */
  storageKey: string;
  /** formData 전처리 (방문형: 지역명 정규화 등) */
  preprocessFormData?: (
    formData: CampaignFormData & { isUrgent: boolean }
  ) => CampaignFormData & { isUrgent: boolean };
  /** 유형별 추가 필드 (구매평: purchaseLink 등) */
  getExtraFields?: (
    finalFormData: CampaignFormData & { isUrgent: boolean }
  ) => Record<string, unknown>;
}

// ----------------------------------------
// 한글 → API 타입 매핑
// ----------------------------------------
const CAMPAIGN_TYPE_TO_API: Record<string, string> = {
  배송형: "DELIVERY",
  방문형: "VISIT",
  구매평: "PURCHASE",
  기자단: "REPORTER",
  미션형: "MISSION",
};

const PLATFORM_TO_API: Record<string, string> = {
  "네이버 블로그": "NAVER_BLOG",
  "네이버 클립": "NAVER_CLIP",
  인스타그램: "INSTAGRAM",
  릴스: "REELS",
  유튜브: "YOUTUBE",
  쇼츠: "YOUTUBE_SHORTS",
  숏츠: "YOUTUBE_SHORTS",
};

// ----------------------------------------
// partner_id 매핑 (mock 전용): userId 숫자 추출 → 없으면 1
// ----------------------------------------
function getPartnerId(userId: string): number {
  const n = parseInt(userId.replace(/\D/g, ""), 10);
  return n > 0 ? n : 1;
}

// ----------------------------------------
// "2026-01-01 ~ 2026-02-01" → { start, end } ISO
// ----------------------------------------
function parsePeriod(period: string): { start: string; end: string } {
  const parts = period.split("~").map((s) => s.trim());
  const toIso = (d: string) => (d ? `${d}T00:00:00+09:00` : "");
  return { start: toIso(parts[0] || ""), end: toIso(parts[1] || parts[0] || "") };
}

/**
 * formData → mock DB 호환 payload 생성
 * usePartnerCampaigns의 adaptToCampaign이 기대하는 스키마에 맞춤
 */
function buildDbPayload(
  formData: CampaignFormData & { isUrgent: boolean },
  imageUrl: string,
  userId: string
): Record<string, unknown> {
  const recruit = parsePeriod(formData.recruitmentPeriod);
  const content = parsePeriod(formData.registrationPeriod);
  const recruitLimit = Number(formData.recruitmentCount) || 10;
  const extraReward = Number(formData.additionalPoints) || 0;
  const purchaseReward = Number(formData.purchasePoints) || 0;

  // 썸네일/상세: 사용자 업로드 이미지 preview Data URL 사용 (server.js에서 body-parser 50MB 허용)
  const fd = formData as unknown as Record<string, unknown>;
  const userThumbnailUrl = fd.thumbnailImageUrl as string | undefined;
  const thumbnailUrl = userThumbnailUrl || imageUrl;
  const detailPreviews = (fd.detailImagePreviews as string[]) || [];

  return {
    type: CAMPAIGN_TYPE_TO_API[formData.campaignType] || "DELIVERY",
    status: "REGISTERING",
    isEmergency: formData.isUrgent === true,
    title: formData.title,
    thumbnailUrl,
    thumbnail: { url: thumbnailUrl },
    detailImages: detailPreviews.length > 0 ? detailPreviews : [],
    category: {
      categoryId: 0,
      categoryName: formData.category || "",
    },
    requiredPlatform: {
      channelId: 0,
      channelName: PLATFORM_TO_API[formData.platform || ""] || "NAVER_BLOG",
    },
    recruitLimit,
    appliedCount: 0,
    recruitStartAt: recruit.start,
    recruitEndAt: recruit.end,
    recruit: {
      recruitLimit,
      recruitStartAt: recruit.start,
      recruitEndAt: recruit.end,
    },
    content: {
      contentStartAt: content.start,
      contentEndAt: content.end,
    },
    reward: {
      extraRewardPoint: extraReward,
      paymentRewardPoint: purchaseReward,
    },
    keywordPolicy: {
      keyword: formData.keywords || "",
      minTextLength: Number(formData.minTextLength) || 0,
      minPhotoCount: Number(formData.minImageCount) || 0,
      minVideoCount: Number(formData.videoCount) || 0,
      minVideoDuration: Number(formData.videoDuration) || 0,
      requireBodyLink: formData.requireLinkAttachment === true,
      requireKeywordAttachment: formData.requireKeywordAttachment === true,
    },
    description: formData.providedItems || "",
    notification: formData.guidelines || "",
    // 방문형 주소 통합 (상세 페이지에서 전체 주소 표시)
    visitAddress:
      [formData.visitBaseAddress, formData.visitDetailAddress].filter(Boolean).join(" ") ||
      undefined,
    visitZipCode: formData.visitZipCode || undefined,
    visitBaseAddress: formData.visitBaseAddress || undefined,
    visitDetailAddress: formData.visitDetailAddress || undefined,
    addressGuide: formData.addressDetail || undefined,
    // 공통 필드
    contact_phone: formData.contactPhone || undefined,
    promotionLink: formData.promotionLink || undefined,
    visitLink: formData.visitLink || undefined,
    adultOnly: formData.adultOnly || false,
    allowReParticipation: formData.allowReParticipation || false,
    allowLateSubmission: formData.allowLateSubmission || false,
    // 미션형 전용
    requireContentLink: formData.requireContentLink || false,
    requireContentImage: formData.requireContentImage || false,
    metrics: {
      appliedCount: 0,
      selectedCount: 0,
      applicationRate: 0,
    },
    partner_id: getPartnerId(userId),
    additionalPoint: extraReward,
    selectedCount: 0,
  };
}

/**
 * formData → CreateCampaignRequest 변환
 */
function buildApiRequest(
  formData: CampaignFormData & { isUrgent: boolean },
  fd: Record<string, unknown>
): CreateCampaignRequest {
  const recruit = parsePeriod(formData.recruitmentPeriod);
  const content = parsePeriod(formData.registrationPeriod);
  const selectedAt = parsePeriod(formData.announcementDate).start;

  return {
    type: (CAMPAIGN_TYPE_TO_API[formData.campaignType] ||
      "DELIVERY") as CreateCampaignRequest["type"],
    categoryId: Number(fd._categoryId) || 0,
    requiredPlatformId: fd._channelId != null ? Number(fd._channelId) : undefined,
    title: formData.title,
    description: formData.providedItems || "",
    thumbnailImage:
      (fd.thumbnailImage as File) || new File([], "placeholder.jpg", { type: "image/jpeg" }),
    detailImages: (fd.detailImages as File[]) || [],
    recruitLimit: Number(formData.recruitmentCount) || 1,
    recruitStartAt: recruit.start,
    recruitEndAt: recruit.end,
    selectedAt,
    contentStartAt: content.start,
    contentEndAt: content.end,
    extraRewardPoint: Number(String(formData.additionalPoints).replace(/,/g, "")) || undefined,
    paymentRewardPoint: Number(String(formData.purchasePoints).replace(/,/g, "")) || undefined,
    promotionUrl: formData.promotionLink || undefined,
    keyword: formData.keywords || undefined,
    notification: formData.guidelines || undefined,
    regionId: fd._regionId != null ? Number(fd._regionId) : undefined,
    visitAddress:
      formData.visitAddress ||
      [formData.visitBaseAddress, formData.visitDetailAddress].filter(Boolean).join(" ") ||
      undefined,
    is_urgent: formData.isUrgent === true,
    contact_phone: formData.contactPhone || "",
    ftc_agreement: formData.fairTradeAgreement || false,
  };
}

/**
 * 캠페인 등록 공통 처리 함수
 *
 * 5개 캠페인 유형의 공통 흐름:
 * 1. formData에 isUrgent 추가
 * 2. (선택) formData 전처리
 * 3. POST /partner/campaign/create (API 10) 호출
 * 4. localStorage에도 저장 (캠페인 관리 페이지 표시용 fallback)
 */
export async function registerCampaignBase(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string,
  config: CampaignRegistrationConfig
): Promise<boolean> {
  try {
    const finalFormData = { ...formData, isUrgent };

    // 유형별 전처리 (방문형: 지역명 정규화 등)
    const processedFormData = config.preprocessFormData
      ? config.preprocessFormData(finalFormData)
      : finalFormData;

    // CampaignFormBase.handleSubmit이 추가한 ID 필드 추출
    const fd = formData as unknown as Record<string, unknown>;

    // API 10: POST /partner/campaign/create 호출
    const apiRequest = buildApiRequest(processedFormData, fd);
    const apiResponse = await postCampaignCreate(apiRequest);

    // 등록 성공 → localStorage에도 저장 (캠페인 관리 페이지 fallback)
    const partnerName = getPartnerName(userId);
    const registeredAt = new Date().toISOString();
    const newCampaign = config.addCampaignFn(processedFormData, config.imageUrl);
    if (newCampaign) {
      const extraFields = config.getExtraFields?.(processedFormData) ?? {};
      const extendedCampaign = {
        ...newCampaign,
        id: apiResponse.campaign.campaignId,
        campaignId: apiResponse.campaign.campaignId,
        partner_id: getPartnerId(userId),
        partnerName,
        isUrgent: isUrgent === true,
        isEmergency: isUrgent === true,
        registeredAt,
        ...extraFields,
      };
      saveCampaignToStorage(extendedCampaign as Record<string, unknown>, config.storageKey);
    }

    return true;
  } catch (apiError) {
    // API 실패 시 구버전 mock 방식으로 fallback (개발 환경 호환)
    console.warn("[registerCampaign] API 호출 실패, mock fallback 시도:", apiError);
    try {
      const finalFormData = { ...formData, isUrgent };
      const processedFormData = config.preprocessFormData
        ? config.preprocessFormData(finalFormData)
        : finalFormData;
      const newCampaign = config.addCampaignFn(processedFormData, config.imageUrl);
      if (!newCampaign) return false;

      const partnerName = getPartnerName(userId);
      const extendedCampaign = {
        ...newCampaign,
        partner_id: getPartnerId(userId),
        partnerName,
        isUrgent: isUrgent === true,
        isEmergency: isUrgent === true,
        registeredAt: new Date().toISOString(),
        ...config.getExtraFields?.(processedFormData),
      };
      const saved = saveCampaignToStorage(
        extendedCampaign as Record<string, unknown>,
        config.storageKey
      );
      if (!saved) return false;

      const fd = formData as unknown as Record<string, unknown>;
      const dbPayload = {
        ...buildDbPayload(processedFormData, config.imageUrl, userId),
        ...config.getExtraFields?.(processedFormData),
      };
      try {
        await Promise.race([
          postPartnerCampaign(dbPayload),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
        ]);
      } catch {
        /* ignore */
      }
      void fd;
      return true;
    } catch (_fallbackError) {
      return false;
    }
  }
}
