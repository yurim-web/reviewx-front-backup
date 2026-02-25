/* ========================================
   캠페인 관리 - 신청 탭 페이지
   ======================================== */

/**
 * AppliedPage
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 */

"use client";

import { useState } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab, CampaignApplication } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useAppliedCampaigns } from "@/hooks/user/campaign_management/useAppliedCampaigns";

function AppliedPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab] = useState<"신청">("신청");
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);

  const { campaigns, setCampaigns, displayStats, statsReady } = useAppliedCampaigns();

  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  const handleCancelSuccess = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    setFilteredCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          stats={statsReady ? displayStats : undefined}
        />
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="신청"
          onCancelSuccess={handleCancelSuccess}
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

export default withUserAuth(AppliedPage);
