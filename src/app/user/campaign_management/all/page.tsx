/* ========================================
   캠페인 관리 - 전체 탭 페이지
   ======================================== */

/**
 * AllPage
 *
 * 목적: 신청·선정·완료·취소/반려 상태의 캠페인을 통합하여 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/all (전체 탭)
 */

"use client";

import { useState, useCallback } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useAllCampaigns } from "@/hooks/user/campaign_management/useAllCampaigns";
import Loading from "@/app/loading";

function AllPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);
  const { campaigns, stats, isLoading } = useAllCampaigns();

  const handleFilteredCampaignsChange = useCallback((filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab="전체"
          stats={stats}
        />
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="전체"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

export default withUserAuth(AllPage);
