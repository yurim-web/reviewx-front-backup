/* ========================================
   기자단 캠페인 등록 헬퍼
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
import { registerCampaignBase } from "./registerCampaignBase";

/** 기자단 캠페인 등록 처리 */
export async function registerReporterCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  return registerCampaignBase(formData, isUrgent, userId, {
    addCampaignFn: addReporterCampaign,
    imageUrl: "/images/main/campaign_img/eximg_4.png",
    storageKey: "reporterCampaigns",
    getExtraFields: (fd) => ({
      promotionLink: fd.promotionLink || "",
    }),
  });
}
