/* ========================================
🛒 구매평 캠페인 신청내역 페이지
======================================== */

/**
 * 구매평 캠페인 신청내역 페이지
 *
 * 목적: 구매평 캠페인의 신청자/선정자 관리
 *
 * 사용 페이지:
 * - /partner/campaign_application/review/[id]
 */

"use client";

import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/partner/campaign_application/CampaignApplicationLayout";
import { renderBasicCard } from "@/components/partner/campaign_application/card_renderers/renderBasicCard";

export default function ReviewCampaignApplicationPage() {
  const hookValues = useCampaignApplication();

  return (
    <CampaignApplicationLayout
      {...hookValues}
      renderCard={renderBasicCard(hookValues.handleSelectApplicant, hookValues.handleCancelApplicant)}
    />
  );
}
