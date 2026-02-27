/* ========================================
   미션형 캠페인 등록 헬퍼
   ======================================== */

/**
 * 미션형 캠페인 등록 헬퍼
 *
 * 목적: 미션형 캠페인의 등록 처리 로직을 분리
 *
 * 사용처:
 * - /partner/campaign/create/mission
 */

import { CampaignFormData } from "@/types/domain/user";
import { addMissionCampaign } from "@/data/campaign/mission/missionCampaigns";
import { registerCampaignBase } from "./registerCampaignBase";

/** 미션형 캠페인 등록 처리 */
export async function registerMissionCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  return registerCampaignBase(formData, isUrgent, userId, {
    addCampaignFn: addMissionCampaign,
    imageUrl: "/images/main/campaign_img/eximg_3.png",
    storageKey: "missionCampaigns",
    getExtraFields: (fd) => ({
      promotionLink: fd.promotionLink || "",
    }),
  });
}
