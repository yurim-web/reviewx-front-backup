/* ========================================
   배송형 캠페인 등록 헬퍼
   ======================================== */

/**
 * 배송형 캠페인 등록 헬퍼
 *
 * 목적: 배송형 캠페인의 등록 처리 로직을 분리
 *
 * 사용처:
 * - /partner/campaign/create/delivery
 */

import { CampaignFormData } from "@/types/domain/user";
import { addDeliveryCampaign } from "@/data/campaign/delivery/deliveryCampaigns";
import { registerCampaignBase } from "./registerCampaignBase";

/** 배송형 캠페인 등록 처리 */
export async function registerDeliveryCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  return registerCampaignBase(formData, isUrgent, userId, {
    addCampaignFn: addDeliveryCampaign,
    imageUrl: "/images/main/campaign_img/eximg_1.png",
    storageKey: "deliveryCampaigns",
    getExtraFields: (fd) => ({
      promotionLink: fd.promotionLink || "",
    }),
  });
}
