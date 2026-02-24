/* ========================================
📰 기자단 캠페인 신청내역 페이지
======================================== */

/**
 * 기자단 캠페인 신청내역 페이지
 *
 * 목적: 기자단 캠페인의 신청자/선정자 관리
 *
 * 사용 페이지:
 * - /partner/campaign_application/reporter/[id]
 */

"use client";

import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/partner/campaign_application/CampaignApplicationLayout";
import { renderChannelBrandCard } from "@/components/partner/campaign_application/card_renderers/renderChannelBrandCard";

export default function ReporterCampaignApplicationPage() {
  const hookValues = useCampaignApplication();

  return (
    <CampaignApplicationLayout
      {...hookValues}
      renderCard={renderChannelBrandCard(hookValues.handleSelectApplicant, hookValues.handleCancelApplicant, hookValues.campaignData)}
    />
  );
}
