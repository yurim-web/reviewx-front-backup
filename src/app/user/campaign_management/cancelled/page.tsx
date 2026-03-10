/* ========================================
   캠페인 관리 - 취소/반려 탭 페이지
   ======================================== */

/**
 * CancelledPage
 *
 * 목적: 취소/반려 상태의 캠페인 목록을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/cancelled (취소/반려 탭)
 */

"use client";

import { useState } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useCancelledCampaigns } from "@/hooks/user/campaign_management/useCancelledCampaigns";

function CancelledPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);
  const { campaigns, stats } = useCancelledCampaigns();

  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab="취소/반려"
          stats={stats}
        />
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="취소/반려"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

export default withUserAuth(CancelledPage);
