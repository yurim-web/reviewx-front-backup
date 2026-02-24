/* ========================================
🛒 구매평 콘텐츠 내역 페이지
======================================== */

/**
 * 구매평 콘텐츠 내역 페이지
 *
 * 목적: 구매평 캠페인의 콘텐츠 관리 (구매/등록 기간 분기)
 *
 * 사용 페이지:
 * - /partner/campaign_contents/review/[id]
 */

"use client";

import React, { useState, useParams } from "react";
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import { createReviewCardRenderer } from "@/components/partner/campaign_contents/card_renderers/renderReviewCard";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";
import {
  getPurchaseReviewContentsById,
  reviewCampaignsExtended,
} from "@/data/campaign/review/reviewCampaigns";

export default function PurchaseReviewContentsDetailPage() {
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
  } = useCampaignContents(getPurchaseReviewContentsById);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);

  const params_url = useParams();
  const campaignId = params_url.id as string;

  const params = React.useMemo(() => {
    if (!campaignId)
      return {
        contentType: "link" as "link" | "image" | "both",
        deadlineDate: undefined,
        isPurchasePeriod: false,
        isRegistrationPeriod: false,
        purchasePeriod: undefined,
        isCampaignClosed: false,
      };

    const campaignData = reviewCampaignsExtended.find((c) => c.id === campaignId);
    const contentType = (campaignData?.contentType || "link") as "link" | "image" | "both";

    const checkRegistrationPeriodEnded = (registrationPeriod?: string): boolean => {
      if (!registrationPeriod) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const period = registrationPeriod.split(" ~ ");
      if (period.length === 2) {
        const endDate = new Date(period[1].trim());
        endDate.setHours(0, 0, 0, 0);
        return today > endDate;
      }
      return false;
    };

    const isCampaignClosed =
      campaignInfo?.status === "마감" ||
      campaignInfo?.statusText?.includes("마감") === true ||
      checkRegistrationPeriodEnded(campaignInfo?.registrationPeriod);

    const purchasePeriod = campaignData?.detailedSchedule?.purchasePeriod;
    let isPurchasePeriod = false;
    let deadlineDate: string | undefined;

    if (purchasePeriod) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const periodMatch = purchasePeriod.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
      if (periodMatch) {
        const startDate = new Date(periodMatch[1]);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(periodMatch[2]);
        endDate.setHours(0, 0, 0, 0);

        isPurchasePeriod = !isCampaignClosed && today >= startDate && today <= endDate;

        if (isPurchasePeriod) {
          deadlineDate = periodMatch[2];
        }
      }
    }

    let isRegistrationPeriod = false;
    if (!isPurchasePeriod && campaignData?.detailedSchedule?.registrationPeriod) {
      const period = campaignData.detailedSchedule.registrationPeriod;
      const match = period.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(match[1]);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(match[2]);
        endDate.setHours(0, 0, 0, 0);

        isRegistrationPeriod = today >= startDate && today <= endDate;
        deadlineDate = match[2];
      } else {
        const simpleMatch = period.match(/~\s*(\d{4}-\d{2}-\d{2})/);
        deadlineDate = simpleMatch ? simpleMatch[1] : undefined;
      }
    }

    return {
      contentType,
      deadlineDate,
      isPurchasePeriod,
      isRegistrationPeriod,
      purchasePeriod,
      isCampaignClosed,
    };
  }, [campaignId, campaignInfo]);

  const openReceiptModal = (images: string[] | undefined) => {
    setReceiptImages(images && images.length > 0 ? images : []);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptImages([]);
  };

  const checkIsInPurchasePeriod = React.useCallback((): boolean => {
    if (!campaignId) return false;
    const campaignData = reviewCampaignsExtended.find((c) => c.id === campaignId);
    const purchasePeriod = campaignData?.detailedSchedule?.purchasePeriod;
    if (!purchasePeriod) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const periodMatch = purchasePeriod.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
    if (periodMatch) {
      const startDate = new Date(periodMatch[1]);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(periodMatch[2]);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    }
    return false;
  }, [campaignId]);

  const handleExtend = (applicantId: string) => {
    // TODO: 연장 기능 구현
  };

  const renderCardComponent = createReviewCardRenderer({
    activeTab,
    campaignBrandName: campaignInfo?.brandName,
    rejectReasons,
    reportedDates,
    formatDateTime,
    handleApprove,
    handleReject,
    handleReport,
    handleExtend,
    openReceiptModal,
    checkIsInPurchasePeriod,
    params,
  });

  const handleBatchExtension = () => {
    // TODO: 일괄 기한 연장 기능 구현
  };

  return (
    <>
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
      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        images={receiptImages}
        onClose={closeReceiptModal}
      />
    </>
  );
}
