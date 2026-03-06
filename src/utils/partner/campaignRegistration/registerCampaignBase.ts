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
};

// ----------------------------------------
// partner_id 매핑 (mock 전용)
// ----------------------------------------
function getPartnerId(userId: string): number {
  if (userId === "partner_test_001") return 1;
  if (userId === "partner_test_002") return 2;
  return 1;
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

  return {
    type: CAMPAIGN_TYPE_TO_API[formData.campaignType] || "DELIVERY",
    status: "SCHEDULED",
    isEmergency: formData.isUrgent === true,
    title: formData.title,
    thumbnailUrl: imageUrl,
    thumbnail: { url: imageUrl },
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
      requireBodyLink: formData.requireLinkAttachment === true,
    },
    description: formData.providedItems || "",
    notification: "",
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
 * 캠페인 등록 공통 처리 함수
 *
 * 5개 캠페인 유형의 공통 흐름:
 * 1. formData에 isUrgent 추가
 * 2. (선택) formData 전처리
 * 3. addCampaignFn으로 캠페인 데이터 생성
 * 4. 파트너 정보·공통 필드·유형별 추가 필드를 합친 확장 데이터 생성
 * 5. localStorage에 저장 + mock DB에 저장
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

    // 캠페인 데이터 생성 (localStorage용)
    const newCampaign = config.addCampaignFn(processedFormData, config.imageUrl);

    const registeredAt = new Date().toISOString();
    const partnerName = getPartnerName(userId);

    // 확장 데이터 생성 (localStorage 저장용)
    const extendedCampaign = {
      ...newCampaign,
      partner_id: userId,
      partnerName,
      campaignInfo: {
        ...newCampaign.campaignInfo,
        partnerName,
      },
      isUrgent: isUrgent === true,
      registeredAt,
      channel: finalFormData.platform || "",
      description: finalFormData.providedItems || "",
      keywords: finalFormData.keywords || "",
      guidelines: finalFormData.guidelines || "",
      minTextLength: finalFormData.minTextLength,
      minImageCount: finalFormData.minImageCount,
      videoCount: finalFormData.videoCount,
      videoDuration: finalFormData.videoDuration,
      requireLinkAttachment: finalFormData.requireLinkAttachment,
      requireKeywordAttachment: finalFormData.requireKeywordAttachment,
      additionalPoints: finalFormData.additionalPoints,
      ...config.getExtraFields?.(finalFormData),
    };

    const saved = saveCampaignToStorage(
      extendedCampaign as Record<string, unknown>,
      config.storageKey
    );

    // mock DB에 캠페인 저장 (DB 스키마 호환 payload)
    if (saved) {
      const dbPayload = buildDbPayload(processedFormData, config.imageUrl, userId);
      postPartnerCampaign(dbPayload).catch(() => {});
    }

    return saved;
  } catch (_error) {
    return false;
  }
}
