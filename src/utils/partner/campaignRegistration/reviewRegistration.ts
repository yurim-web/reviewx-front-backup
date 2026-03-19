/* ========================================
   구매평 캠페인 등록 헬퍼
   ======================================== */

/**
 * 구매평 캠페인 등록 헬퍼
 *
 * 목적: 구매평 캠페인의 등록 처리 로직을 분리
 *
 * 사용처:
 * - /partner/campaign/create/review
 */

import { CampaignFormData } from "@/types/domain/user";
import { addReviewCampaign } from "@/data/campaign/review/reviewCampaigns";
import { registerCampaignBase } from "./registerCampaignBase";

/** 구매평 캠페인 등록 처리 */
export async function registerReviewCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  return registerCampaignBase(formData, isUrgent, userId, {
    addCampaignFn: addReviewCampaign,
    imageUrl: "/images/main/campaign_img/eximg_5.png",
    storageKey: "reviewCampaigns",
    getExtraFields: (fd) => ({
      purchasePeriod: fd.purchasePeriod || "",
      purchaseLink: fd.promotionLink || "",
      purchaseInfo: {
        purchaseLink: fd.promotionLink || "",
        purchasePoint: Number(fd.purchasePoints ?? 0),
      },
    }),
  });
}
