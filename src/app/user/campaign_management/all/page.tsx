/* ========================================
   📋 전체 탭 전용 페이지 (선정+완료+취소/반려 통합)
   ======================================== */

/**
 * 전체 탭 전용 페이지
 *
 * 목적: 신청·선정·완료·취소/반려 상태의 캠페인을 한 목록에 모아 보여줍니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/all
 *
 * 주요 기능:
 * - 신청·선정·완료·취소/반려 캠페인 통합 목록 표시
 * - 카드별 해당 탭 규칙 적용 (n일 전 등 각 탭 규칙 따름)
 */

"use client";

import { useState, useEffect } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";

import {
  getCampaignsByTab,
  getClientCampaignStats,
} from "@/data/user/campaign_management/campaignManagementData";

function AllPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab, setActiveStatTab] = useState<"전체">("전체");
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>(() =>
    getCampaignsByTab("전체")
  );
  const [stats, setStats] = useState(() => getClientCampaignStats());

  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  useEffect(() => {
    const getCompletedCampaignIds = (): string[] => {
      if (typeof window === "undefined") return [];
      try {
        const completed = localStorage.getItem("completedCampaignIds");
        return completed ? JSON.parse(completed) : [];
      } catch {
        return [];
      }
    };
    const completedCampaignIds = getCompletedCampaignIds();
    setCampaigns(getCampaignsByTab("전체", completedCampaignIds));
    setStats(getClientCampaignStats());
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      const getCompletedCampaignIds = (): string[] => {
        try {
          const completed = localStorage.getItem("completedCampaignIds");
          return completed ? JSON.parse(completed) : [];
        } catch {
          return [];
        }
      };
      setCampaigns(getCampaignsByTab("전체", getCompletedCampaignIds()));
      setStats(getClientCampaignStats());
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
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
