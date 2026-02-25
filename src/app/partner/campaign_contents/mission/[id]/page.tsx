/* ========================================
🎯 미션형 콘텐츠 내역 페이지
======================================== */

/**
 * 미션형 콘텐츠 내역 페이지
 *
 * 목적: 미션형 캠페인의 콘텐츠 관리
 *
 * 사용 페이지:
 * - /partner/campaign_contents/mission/[id]
 */

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import { createMissionCardRenderer } from "@/components/partner/campaign_contents/card_renderers/renderMissionCard";
import { extractDeadlineDate } from "@/utils/formatting/date";
import {
  getMissionContentsById,
  missionCampaignsExtended,
} from "@/data/campaign/mission/missionCampaigns";
import { getCampaignById, type ContentByTab } from "@/data/partner/sharedCampaigns";

export default function MissionContentsDetailPage() {
  const {
    campaignInfo,
    activeTab,
    setActiveTab,
    waitingCount,
    reviewCount,
    completedCount,
    sortOrder,
    setSortOrder,
    sortOptions,
    contents,
    handleApprove,
    handleReject,
    rejectReasons,
    handleReport,
    reportedDates,
    formatDateTime,
  } = useCampaignContents((campaignId) => {
    const shared = getCampaignById(campaignId);
    const sharedWithContents = shared as unknown as { contents?: ContentByTab };
    if (shared && sharedWithContents.contents) {
      return sharedWithContents.contents;
    }
    return getMissionContentsById(campaignId);
  });

  const params_url = useParams();
  const campaignId = params_url.id as string;

  const params = React.useMemo(() => {
    if (!campaignId)
      return { contentType: "link" as "link" | "image" | "both", deadlineDate: undefined };

    const campaignData = missionCampaignsExtended.find((c) => c.id === campaignId);
    const contentType = (campaignData?.contentType || "link") as "link" | "image" | "both";

    let deadlineDate: string | undefined;
    if (campaignData?.detailedSchedule?.registrationPeriod) {
      deadlineDate = extractDeadlineDate(campaignData.detailedSchedule.registrationPeriod);
    }

    return { contentType, deadlineDate };
  }, [campaignId]);

  const handleExtend = (_applicantId: string) => {
    // TODO: 실제 연장 로직 구현
  };

  const renderCardComponent = createMissionCardRenderer({
    activeTab,
    campaignBrandName: campaignInfo?.brandName,
    rejectReasons,
    reportedDates,
    formatDateTime,
    handleApprove,
    handleReject,
    handleReport,
    handleExtend,
    contentType: params.contentType,
    deadlineDate: params.deadlineDate,
  });

  const handleBatchExtension = () => {
    // TODO: 일괄 기한 연장 기능 구현
  };

  return (
    <CampaignContentsLayout
      campaignInfo={campaignInfo}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      waitingCount={waitingCount}
      reviewCount={reviewCount}
      completedCount={completedCount}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      sortOptions={sortOptions}
      contents={contents}
      renderCard={renderCardComponent}
      onBatchExtension={handleBatchExtension}
    />
  );
}
