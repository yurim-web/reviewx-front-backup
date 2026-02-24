/* ========================================
   📋 캠페인 관리 탭 페이지 (공통 컴포넌트)
   ======================================== */

/**
 * 캠페인 관리 탭 페이지 공통 컴포넌트
 *
 * 목적: 6개의 캠페인 관리 탭 페이지 (신청/예정/진행/종료/취소/연장 요청)를 단일 컴포넌트로 통합
 *
 * 사용 페이지:
 * - /partner/campaign_management/applied
 * - /partner/campaign_management/scheduled
 * - /partner/campaign_management/progress
 * - /partner/campaign_management/completed
 * - /partner/campaign_management/cancelled
 * - /partner/campaign_management/extension-request
 */

"use client";

import { useState, useEffect } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import CampaignList from "@/components/partner/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import Loading from "@/app/loading";
import type { PartnerMainTab, PartnerStatTab, PartnerCampaign } from "@/types/domain/partner";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import { getCampaignsByTab } from "@/data/partner/sharedCampaigns";

interface CampaignManagementTabPageProps {
  statTab: PartnerStatTab;
}

/**
 * 캠페인 관리 탭 페이지 공통 컴포넌트
 */
export default function CampaignManagementTabPage({
  statTab,
}: CampaignManagementTabPageProps) {
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
  const [activeStatTab] = useState<PartnerStatTab>(statTab);
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const campaigns = getCampaignsByTab(activeStatTab);

  const handleFilteredCampaignsChange = (filtered: PartnerCampaign[]) => {
    setFilteredCampaigns(filtered);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    setIsLoading(true);

    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(safetyTimer);
  }, [activeStatTab]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
        />

        <CampaignFilterBar
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          isPartner={true}
        />

        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab={activeStatTab}
        />
      </div>
    </div>
  );
}
