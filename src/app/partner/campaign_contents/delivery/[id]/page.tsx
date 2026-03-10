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

import React, { useState, useMemo } from "react";
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import { createExperienceCardRenderer } from "@/components/partner/campaign_contents/card_renderers/renderExperienceCard";
import { extractDeadlineDate } from "@/utils/formatting/date";

export default function DeliveryContentsDetailPage() {
  const {
    campaignInfo,
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    sortOptions,
    contents,
    handleApprove,
    handleReport,
    reportedDates,
    formatDateTime,
  } = useCampaignContents();

  const deadlineDate = extractDeadlineDate(campaignInfo?.registrationPeriod);

  const [rejectReasons, setRejectReasons] = useState<Map<string, string>>(new Map());

  const handleReject = (contentId: string, rejectReason: string) => {
    setRejectReasons((prev) => {
      const newMap = new Map(prev);
      newMap.set(contentId, rejectReason);
      return newMap;
    });

    setActiveTab("대기");

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "대기");
      window.history.pushState({}, "", url.toString());
    }
  };

  const filteredContents = useMemo(() => {
    const reviewing = contents.reviewing || [];
    const waiting = contents.waiting || [];

    const rejectedIds = Array.from(rejectReasons.keys());

    const rejectedItems = reviewing.filter((item) => rejectedIds.includes(item.id));
    const remainingReviewing = reviewing.filter((item) => !rejectedIds.includes(item.id));

    const existingWaitingIds = new Set(waiting.map((item) => item.id));
    const newWaitingItems = rejectedItems.filter((item) => !existingWaitingIds.has(item.id));

    return {
      waiting: [...waiting, ...newWaitingItems],
      reviewing: remainingReviewing,
      completed: contents.completed || [],
    };
  }, [contents, rejectReasons]);

  const filteredWaitingCount = filteredContents.waiting?.length || 0;
  const filteredReviewCount = filteredContents.reviewing?.length || 0;
  const filteredCompletedCount = filteredContents.completed?.length || 0;

  const renderCardComponent = createExperienceCardRenderer({
    activeTab,
    rejectReasons,
    reportedDates,
    formatDateTime,
    handleApprove,
    handleReject,
    handleReport,
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
      waitingCount={filteredWaitingCount}
      reviewCount={filteredReviewCount}
      completedCount={filteredCompletedCount}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      sortOptions={sortOptions}
      contents={filteredContents}
      renderCard={renderCardComponent}
      onBatchExtension={handleBatchExtension}
    />
  );
}
