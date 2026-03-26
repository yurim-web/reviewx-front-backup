/* ========================================
📦 배송형 콘텐츠 내역 페이지
======================================== */

/**
 * 배송형 콘텐츠 내역 페이지
 *
 * 목적: 배송형 캠페인의 콘텐츠 관리
 *
 * 사용 페이지:
 * - /partner/campaign_contents/delivery/[id]
 */

"use client";

import React from "react";
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import { createExperienceCardRenderer } from "@/components/partner/campaign_contents/card_renderers/renderExperienceCard";
import { extractDeadlineDate } from "@/utils/formatting/date";

export default function DeliveryContentsDetailPage() {
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
    rejectReasons,
    handleApprove,
    handleReject,
    handleExtend,
    handleReport,
    handleComplete,
    reportedDates,
    formatDateTime,
  } = useCampaignContents();

  const deadlineDate = extractDeadlineDate(campaignInfo?.registrationPeriod);

  const renderCardComponent = createExperienceCardRenderer({
    activeTab,
    rejectReasons,
    reportedDates,
    formatDateTime,
    handleApprove,
    handleReject,
    handleExtend,
    handleReport,
    handleComplete,
    deadlineDate,
    enableExtensionRequest: false,
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
