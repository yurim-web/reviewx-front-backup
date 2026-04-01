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

import { useState, useEffect, useRef } from "react";
import PartnerCampaignManagementHeader from "@/components/partner/campaign_management/PartnerCampaignManagementHeader";
import CampaignList from "@/components/partner/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import Loading from "@/app/loading";
import type { PartnerMainTab, PartnerStatTab, PartnerCampaign } from "@/types/domain/partner";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import { usePartnerCampaigns } from "@/hooks/partner/campaign_management/usePartnerCampaigns";

interface CampaignManagementTabPageProps {
  statTab: PartnerStatTab;
}

/**
 * 캠페인 관리 탭 페이지 공통 컴포넌트
 */
export default function CampaignManagementTabPage({ statTab }: CampaignManagementTabPageProps) {
  const [activeTab, setActiveTab] = useState<PartnerMainTab>("campaign");
  const [activeStatTab] = useState<PartnerStatTab>(statTab);
  const [filteredCampaigns, setFilteredCampaigns] = useState<PartnerCampaign[]>([]);

  const {
    campaigns,
    stats,
    isLoading: isApiLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePartnerCampaigns(activeStatTab);

  // 무한 스크롤 sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleFilteredCampaignsChange = (filtered: PartnerCampaign[]) => {
    setFilteredCampaigns(filtered);
  };

  if (isApiLoading) {
    return <Loading />;
  }

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <PartnerCampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          apiStats={stats}
        />

        <CampaignFilterBar
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          isPartner={true}
        />

        <CampaignList campaigns={filteredCampaigns} activeStatTab={activeStatTab} />

        {/* 무한 스크롤 sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }} />

        {/* 추가 로딩 스피너 */}
        {isFetchingNextPage && <Loading />}
      </div>
    </div>
  );
}
