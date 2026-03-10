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

import React, { useState } from "react";
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import { createReviewCardRenderer } from "@/components/partner/campaign_contents/card_renderers/renderReviewCard";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";

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
  } = useCampaignContents();

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);

  const params = React.useMemo(() => {
    // contentType: API에 별도 필드 없으므로 기본값 "link"
    const contentType = "link" as "link" | "image" | "both";

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
      checkRegistrationPeriodEnded(campaignInfo?.registrationPeriod);

    // registrationPeriod를 구매 기간으로 간주
    const registrationPeriod = campaignInfo?.registrationPeriod;
    let isPurchasePeriod = false;
    let isRegistrationPeriod = false;
    let deadlineDate: string | undefined;

    if (registrationPeriod) {
      const match = registrationPeriod.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
      if (match) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(match[1]);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(match[2]);
        endDate.setHours(0, 0, 0, 0);

        isPurchasePeriod = !isCampaignClosed && today >= startDate && today <= endDate;
        isRegistrationPeriod = isPurchasePeriod;
        deadlineDate = match[2];
      }
    }

    return {
      contentType,
      deadlineDate,
      isPurchasePeriod,
      isRegistrationPeriod,
      purchasePeriod: registrationPeriod,
      isCampaignClosed,
    };
  }, [campaignInfo]);

  const openReceiptModal = (images: string[] | undefined) => {
    setReceiptImages(images && images.length > 0 ? images : []);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptImages([]);
  };

  const checkIsInPurchasePeriod = React.useCallback((): boolean => {
    const registrationPeriod = campaignInfo?.registrationPeriod;
    if (!registrationPeriod) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const periodMatch = registrationPeriod.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
    if (periodMatch) {
      const startDate = new Date(periodMatch[1]);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(periodMatch[2]);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    }
    return false;
  }, [campaignInfo]);

  const handleExtend = (_applicantId: string) => {
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
