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
    if (!newCampaign) return false;

    const registeredAt = new Date().toISOString();
    const partnerName = getPartnerName(userId);

    // 확장 데이터 생성 (localStorage 저장용)
    const extendedCampaign = {
      ...newCampaign,
      partner_id: getPartnerId(userId),
      partnerName,
      campaignInfo: {
        ...newCampaign.campaignInfo,
        partnerName,
      },
      isUrgent: isUrgent === true,
      isEmergency: isUrgent === true,
      registeredAt,
      channel: processedFormData.platform || "",
      description: processedFormData.providedItems || "",
      keywords: processedFormData.keywords || "",
      guidelines: processedFormData.guidelines || "",
      minTextLength: Number(processedFormData.minTextLength) || 0,
      minImageCount: Number(processedFormData.minImageCount) || 0,
      videoCount: Number(processedFormData.videoCount) || 0,
      videoDuration: Number(processedFormData.videoDuration) || 0,
      requireLinkAttachment: processedFormData.requireLinkAttachment,
      requireKeywordAttachment: processedFormData.requireKeywordAttachment,
      additionalPoints: Number(processedFormData.additionalPoints) || 0,
      ...config.getExtraFields?.(processedFormData),
    };

    const saved = saveCampaignToStorage(
      extendedCampaign as Record<string, unknown>,
      config.storageKey
    );

    if (!saved) return false;

    // mock DB에 캠페인 저장 (DB 스키마 호환 payload)
    // 타임아웃 3초: json-server 미실행/지연 시 빠르게 실패 처리
    const extraFields = config.getExtraFields?.(processedFormData) ?? {};
    const dbPayload = {
      ...buildDbPayload(processedFormData, config.imageUrl, userId),
      ...extraFields,
    };
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      );
      await Promise.race([postPartnerCampaign(dbPayload), timeoutPromise]);
    } catch (apiError) {
      // mock 서버 미실행/타임아웃 시에도 localStorage 저장은 완료됐으므로 성공 처리
      console.warn("[registerCampaign] mock DB 저장 실패 (localStorage는 저장됨):", apiError);
    }

    return true;
  } catch (_error) {
    return false;
  }
}
