/* ========================================
   캠페인 관리 - 완료 탭 페이지
   ======================================== */

/**
 * CompletedPage
 *
 * 목적: 완료 상태의 캠페인 목록을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/completed (완료 탭)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import { useWindowFocus } from "@/hooks/common/useWindowFocus";
import { getCampaignsByTab } from "@/data/user/campaign_management/campaignManagementData";

export default function CompletedPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab] = useState<"완료">("완료");
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>(() =>
    getCampaignsByTab("완료")
  );

  const getCompletedCampaignIds = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const completed = localStorage.getItem("completedCampaignIds");
      return completed ? JSON.parse(completed) : [];
    } catch {
      return [];
    }
  };

  const loadCampaigns = useCallback(() => {
    setCampaigns(getCampaignsByTab("완료", getCompletedCampaignIds()));
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useWindowFocus(loadCampaigns);

  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
        />
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="완료"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}
