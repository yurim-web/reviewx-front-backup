/* ========================================
📦 배송형 캠페인 신청내역 페이지
======================================== */

/**
 * 배송형 캠페인 신청내역 페이지
 *
 * 목적: 배송형 캠페인의 신청자/선정자 관리
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery/[id]
 */

"use client";

import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/partner/campaign_application/CampaignApplicationLayout";
import { renderChannelCard } from "@/components/partner/campaign_application/card_renderers/renderChannelCard";

export default function DeliveryCampaignApplicationPage() {
  const hookValues = useCampaignApplication();

  return (
    <CampaignApplicationLayout
      {...hookValues}
      renderCard={renderChannelCard(
        hookValues.handleSelectApplicant,
        hookValues.handleCancelApplicant,
        hookValues.campaignData
      )}
    />
  );
}
