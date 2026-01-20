/* ========================================
   🛠️ 선정 탭 헬퍼 함수
   ======================================== */

/**
 * 선정 탭에서 사용하는 유틸리티 함수들
 */

import type { CampaignApplication } from "@/types/domain/user";

/**
 * 상태 텍스트 생성 함수
 *
 * 설명:
 * - 캠페인 타입과 상태에 따라 적절한 상태 텍스트를 반환합니다.
 * - 구매평 구매기간: 구매 영수증 등록 안내
 * - 구매평 등록기간: 콘텐츠 등록 안내
 * - 그 외 캠페인: 콘텐츠 등록 안내
 * - 콘텐츠 등록됨: "콘텐츠를 검수 중입니다."
 */
export function getStatusText(
  campaign: CampaignApplication,
  isContentRegistered: boolean,
  isPurchasePeriod: boolean,
  daysUntilDeadline: number | null
): string {
  // 콘텐츠 등록 완료 상태
  if (isContentRegistered) {
    return "콘텐츠를 검수 중입니다.";
  }

  // 구매평 캠페인: 구매기간인 경우
  if (campaign.type === "구매평" && isPurchasePeriod) {
    if (daysUntilDeadline !== null) {
      if (daysUntilDeadline <= 0) {
        return "구매 기한이 지났습니다. 구매 영수증을 등록해 주세요.";
      }
      return `구매 마감까지 ${daysUntilDeadline}일 남았습니다. 구매 영수증을 등록해 주세요.`;
    }
    return "구매 영수증을 등록해 주세요.";
  }

  // 구매평 등록기간 또는 그 외 캠페인: 콘텐츠 등록 안내
  if (daysUntilDeadline !== null) {
    if (daysUntilDeadline < 0) {
      return "캠페인 마감일이 지났습니다. 콘텐츠를 등록해 주세요.";
    }
    if (daysUntilDeadline === 0) {
      return "캠페인 마감일까지 0일 남았습니다. 미션을 완료하고 콘텐츠를 등록해 주세요.";
    }
    return `캠페인 마감까지 ${daysUntilDeadline}일 남았습니다. 미션을 완료하고 콘텐츠를 등록해 주세요.`;
  }

  return "캠페인에 선정되었습니다. 진행해주세요.";
}

/**
 * 캠페인 타입 판단 함수들
 */
export function isContentTypeCampaign(campaign: CampaignApplication): boolean {
  return ["배송형", "방문형", "기자단"].includes(campaign.type);
}

export function isMissionTypeCampaign(campaign: CampaignApplication): boolean {
  return campaign.type === "미션형";
}

export function isContentRegistered(campaign: CampaignApplication): boolean {
  return campaign.subStatus === "content_registered";
}

export function isContentNotRegistered(campaign: CampaignApplication): boolean {
  return campaign.subStatus === "content_not_registered";
}
