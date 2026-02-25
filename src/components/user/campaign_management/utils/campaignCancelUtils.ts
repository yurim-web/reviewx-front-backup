/* ========================================
   캠페인 신청 취소 유틸리티
   ======================================== */

/**
 * campaignCancelUtils.ts
 *
 * 목적: 캠페인 신청 취소 처리 로직(localStorage 조작)을 캡슐화합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 취소)
 */

import {
  CampaignTypeEn,
  CAMPAIGN_TYPE_ID_PREFIX,
  CAMPAIGN_TYPE_STORAGE_KEY,
} from "@/lib/campaign/campaignTypeUtils";

interface StoredCampaignRecord {
  campaignId: string;
  status?: string;
  campaignType?: string;
}

interface StoredApplicant {
  id?: string | number;
  userId?: string | number;
}

interface StoredCampaignData {
  id?: string | number;
  campaignInfo?: { id?: string | number };
  applicantData?: {
    applicants: StoredApplicant[];
    selectedApplicants: StoredApplicant[];
  };
}

interface StoredUserCampaigns {
  userId: string | number;
  campaigns: StoredCampaignRecord[];
}

export type CancelResult =
  | { success: true }
  | { success: false; reason: "already_cancelled" | "not_found" | "error" };

/**
 * 캠페인 ID 접두사로 캠페인 타입 판단
 *
 * @param campaignId - 캠페인 ID (예: "delivery_001")
 * @param storedType - localStorage에 저장된 타입 (우선 사용)
 */
export function getCampaignTypeFromId(campaignId: string, storedType?: string): CampaignTypeEn {
  if (storedType && storedType in CAMPAIGN_TYPE_STORAGE_KEY) {
    return storedType as CampaignTypeEn;
  }
  const found = (Object.entries(CAMPAIGN_TYPE_ID_PREFIX) as [CampaignTypeEn, string][]).find(
    ([, prefix]) => campaignId.startsWith(prefix)
  );
  return found ? found[0] : "delivery";
}

/**
 * 신청한 캠페인 취소 처리
 *
 * @param userId - 현재 로그인한 유저 ID
 * @param campaignId - 취소할 캠페인 ID
 */
export function cancelAppliedCampaign(userId: string | number, campaignId: string): CancelResult {
  if (typeof window === "undefined") {
    return { success: false, reason: "error" };
  }

  const userAppliedCampaigns = localStorage.getItem("user_applied_campaigns");
  if (!userAppliedCampaigns) {
    return { success: false, reason: "not_found" };
  }

  const allAppliedCampaigns: StoredUserCampaigns[] = JSON.parse(userAppliedCampaigns);
  const userCampaignsIndex = allAppliedCampaigns.findIndex((uc) => uc.userId === userId);

  if (userCampaignsIndex === -1) {
    return { success: false, reason: "not_found" };
  }

  const userCampaigns = allAppliedCampaigns[userCampaignsIndex];
  const campaignIndex = userCampaigns.campaigns.findIndex((c) => c.campaignId === campaignId);

  if (campaignIndex === -1) {
    return { success: false, reason: "not_found" };
  }

  const targetCampaign = userCampaigns.campaigns[campaignIndex];

  if (targetCampaign.status === "취소") {
    return { success: false, reason: "already_cancelled" };
  }

  // user_applied_campaigns에서 완전히 제거
  userCampaigns.campaigns = userCampaigns.campaigns.filter((c) => c.campaignId !== campaignId);
  allAppliedCampaigns[userCampaignsIndex] = userCampaigns;
  localStorage.setItem("user_applied_campaigns", JSON.stringify(allAppliedCampaigns));

  // 캠페인 타입별 storage에서 신청자 제거
  const campaignType = getCampaignTypeFromId(campaignId, targetCampaign.campaignType);
  const storageKey = CAMPAIGN_TYPE_STORAGE_KEY[campaignType];

  try {
    const storedCampaignsRaw = localStorage.getItem(storageKey);
    if (storedCampaignsRaw) {
      const campaigns: StoredCampaignData[] = JSON.parse(storedCampaignsRaw);
      const idx = campaigns.findIndex(
        (c) => c.campaignInfo?.id === campaignId || c.id === campaignId
      );
      if (idx !== -1) {
        const target = campaigns[idx];
        if (target.applicantData?.applicants) {
          target.applicantData.applicants = target.applicantData.applicants.filter(
            (a) => a.id !== userId && a.userId !== userId
          );
        }
        if (target.applicantData?.selectedApplicants) {
          target.applicantData.selectedApplicants = target.applicantData.selectedApplicants.filter(
            (a) => a.id !== userId && a.userId !== userId
          );
        }
        campaigns[idx] = target;
        localStorage.setItem(storageKey, JSON.stringify(campaigns));
      }
    }
  } catch (_error) {
    // applicants 제거 실패해도 취소 자체는 성공
  }

  return { success: true };
}
