/* ========================================
📰 기자단 캠페인 등록 헬퍼
======================================== */

/**
 * 기자단 캠페인 등록 헬퍼
 *
 * 목적: 기자단 캠페인의 등록 처리 로직을 분리
 *
 * 사용처:
 * - /partner/campaign/create/reporter
 */

import { CampaignFormData } from "@/types/domain/user";
import { addReporterCampaign } from "@/data/campaign/reporter/reporterCampaigns";
import { getPartnerName } from "@/utils/partner/partnerHelpers";
import { saveCampaignToStorage } from "@/utils/partner/campaignStorage";

/**
 * 기자단 캠페인 등록 처리
 */
export async function registerReporterCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  try {
    // 긴급 상태를 폼 데이터에 추가
    const finalFormData = { ...formData, isUrgent };

    // 기본 이미지 사용
    const imageUrl = "/images/main/campaign_img/eximg_4.png";

    // 폼 데이터를 Campaign 형태로 변환
    const newCampaign = addReporterCampaign(finalFormData, imageUrl);

    // 등록 시간 생성
    const registeredAt = new Date().toISOString();

    // 파트너명 가져오기
    const partnerName = getPartnerName(userId);

    // 상세 페이지에서 필요한 추가 정보를 포함한 확장 데이터 생성
    const extendedCampaign = {
      ...newCampaign,
      // 파트너 정보
      partner_id: userId,
      partnerName,
      // campaignInfo에도 partnerName 추가
      campaignInfo: {
        ...newCampaign.campaignInfo,
        partnerName,
      },
      // 긴급 캠페인 여부
      isUrgent: isUrgent === true,
      // 등록 시간
      registeredAt,
      // 채널 정보
      channel: finalFormData.platform || "",
      // 상세 정보
      description: finalFormData.providedItems || "",
      promotionLink: finalFormData.promotionLink || "",
      keywords: finalFormData.keywords || "",
      guidelines: finalFormData.guidelines || "",
      // Requirements 생성용 필드들
      minTextLength: formData.minTextLength,
      minImageCount: formData.minImageCount,
      videoCount: formData.videoCount,
      videoDuration: formData.videoDuration,
      requireLinkAttachment: formData.requireLinkAttachment,
      requireKeywordAttachment: formData.requireKeywordAttachment,
      // Points 계산용
      additionalPoints: formData.additionalPoints,
    };

    // localStorage에 저장
    const saved = saveCampaignToStorage(
      extendedCampaign as Record<string, unknown>,
      "reporterCampaigns"
    );

    return saved;
  } catch (_error) {
    return false;
  }
}
