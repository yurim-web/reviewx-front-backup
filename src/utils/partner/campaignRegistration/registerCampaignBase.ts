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

/**
 * 캠페인 등록 공통 처리 함수
 *
 * 5개 캠페인 유형의 공통 흐름:
 * 1. formData에 isUrgent 추가
 * 2. (선택) formData 전처리
 * 3. addCampaignFn으로 캠페인 데이터 생성
 * 4. 파트너 정보·공통 필드·유형별 추가 필드를 합친 확장 데이터 생성
 * 5. localStorage에 저장
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

    // 캠페인 데이터 생성
    const newCampaign = config.addCampaignFn(processedFormData, config.imageUrl);

    const registeredAt = new Date().toISOString();
    const partnerName = getPartnerName(userId);

    // 확장 데이터 생성 (공통 필드 + 유형별 추가 필드)
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
      // Requirements 필드
      minTextLength: finalFormData.minTextLength,
      minImageCount: finalFormData.minImageCount,
      videoCount: finalFormData.videoCount,
      videoDuration: finalFormData.videoDuration,
      requireLinkAttachment: finalFormData.requireLinkAttachment,
      requireKeywordAttachment: finalFormData.requireKeywordAttachment,
      additionalPoints: finalFormData.additionalPoints,
      // 유형별 추가 필드 (공통 필드를 덮어쓸 수 있음)
      ...config.getExtraFields?.(finalFormData),
    };

    return saveCampaignToStorage(extendedCampaign as Record<string, unknown>, config.storageKey);
  } catch (_error) {
    return false;
  }
}
