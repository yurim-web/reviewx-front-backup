/* ========================================
   🛒 구매평 콘텐츠 내역 상세 (id 연동)
   ======================================== */

/**
 * 구매평 캠페인 콘텐츠 내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 구매평 캠페인의 콘텐츠(리뷰) 내역을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_contents/review/[id] (동적 라우팅)
 * - 예: /partner/campaign_contents/review/review_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 대기/확인/완료 탭 네비게이션
 * - 콘텐츠 목록 그리드 표시 (Campaign 카드 사용, 구매평 특화)
 * - 승인/반려 기능
 * - 영수증 모달 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 *
 * 📌 리팩토링:
 * - 공통 로직은 useCampaignContents 훅으로 추출
 * - 공통 UI는 CampaignContentsLayout 컴포넌트로 추출
 * - 이 페이지는 구매평 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
// 공통 훅과 컴포넌트 import
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

// 구매평 전용 카드 컴포넌트들 (Campaign 카드 + 구매평 특화)
import CampaignInspectionCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignInspectionCard";
import CampaignCompletedCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignCompletedCard";
import CampaignPendingCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignPendingCard";
// 구매평 1차 카드 컴포넌트들 (구매 기간용)
import PurchaseFirstPendingCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstPendingCard";
import PurchaseFirstInspectionCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstInspectionCard";
import PurchaseFirstCompletedCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstCompletedCard";
// 구매평 2차 카드 컴포넌트들 (등록 기간용)
import PurchaseSecondPendingCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondPendingCard";
import PurchaseSecondInspectionCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondInspectionCard";
import PurchaseSecondCompletedCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondCompletedCard";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/CampaignTypes";
import { getChannelUrl } from "@/utils/channelUrlHelper";

// 구매평 콘텐츠 데이터 로더 및 확장 데이터
import {
  getPurchaseReviewContentsById,
  reviewCampaignsExtended,
} from "@/data/campaign/review/reviewCampaigns";

/**
 * 구매평 캠페인 콘텐츠 내역 페이지 컴포넌트 (동적)
 *
 * 📌 구매평 캠페인 특징:
 * - Campaign 카드 사용 (구매평/미션형 공용 카드)
 * - 영수증 모달 기능 (구매평 특화)
 * - contentType에 따라 다른 카드 표시
 * - 영수증 흐름(actionType === 1)과 리뷰 흐름 구분
 */
export default function PurchaseReviewContentsDetailPage() {
  // 📌 커스텀 훅 사용:
  // - 모든 공통 로직(상태 관리, 데이터 로딩, 핸들러 등)을 훅에서 가져옵니다
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

  // 영수증 모달 상태 관리 (구매평 특화)
  // 📌 React 상태 관리:
  // - useState 훅을 사용하여 모달의 열림/닫힘 상태를 관리합니다
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);

  // URL 파라미터에서 캠페인 ID 가져오기
  const params_url = useParams();
  const campaignId = params_url.id as string;

  // 캠페인의 contentType, 등록 기간, 구매 기간 가져오기
  // 📌 특화 로직:
  // - 구매평 캠페인만의 특별한 데이터 처리가 필요한 경우 여기에 작성
  const params = React.useMemo(() => {
    if (!campaignId)
      return {
        contentType: "link",
        deadlineDate: undefined,
        isPurchasePeriod: false,
        isRegistrationPeriod: false,
        purchasePeriod: undefined,
        isCampaignClosed: false,
      };

    const campaignData = reviewCampaignsExtended.find(
      (c) => c.id === campaignId
    );
    const contentType = campaignData?.contentType || "link";

    // 캠페인 마감 여부 확인
    // 📌 캠페인 마감 체크:
    // - campaignInfo의 status가 "마감"인지 확인
    // - statusText에 "마감"이 포함되어 있는지 확인
    // - 등록 기간이 종료되었는지 확인
    const checkRegistrationPeriodEnded = (
      registrationPeriod?: string
    ): boolean => {
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

    // 구매 기간 확인 및 기한 날짜 추출
    const purchasePeriod = campaignData?.detailedSchedule?.purchasePeriod;
    let isPurchasePeriod = false;
    let deadlineDate: string | undefined;

    if (purchasePeriod) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const periodMatch = purchasePeriod.match(
        /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/
      );
      if (periodMatch) {
        const startDate = new Date(periodMatch[1]);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(periodMatch[2]);
        endDate.setHours(0, 0, 0, 0);

        // 오늘이 구매 기간 내에 있는지 확인
        // 📌 중요: 캠페인이 마감되었으면 구매 기간이어도 false로 처리
        // - 구매 영수증 확인 카드는 구매 기간에만 표시되어야 하므로
        // - 캠페인이 마감되면 더 이상 구매 기간 카드를 표시하지 않습니다
        isPurchasePeriod =
          !isCampaignClosed && today >= startDate && today <= endDate;

        // 구매 기간이면 구매 기간의 마지막 날짜를 기한으로 사용
        if (isPurchasePeriod) {
          deadlineDate = periodMatch[2];
        }
      }
    }

    // 등록 기간 확인
    let isRegistrationPeriod = false;
    if (
      !isPurchasePeriod &&
      campaignData?.detailedSchedule?.registrationPeriod
    ) {
      const period = campaignData.detailedSchedule.registrationPeriod;
      const match = period.match(
        /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/
      );
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
        // 형식이 다른 경우 (예: "~ 2025-12-25")
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

  // 영수증 모달 핸들러 (구매평 특화)
  const openReceiptModal = (images: string[] | undefined) => {
    setReceiptImages(images && images.length > 0 ? images : []);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptImages([]);
  };

  /**
   * 구매 기간인지 확인하는 함수
   * 📌 구매 기간 체크: purchasePeriod 날짜를 직접 확인하여 구매 기간인지 판단합니다
   * - 마감 여부와 관계없이 구매 기간 날짜만 확인합니다
   * - 카드 렌더링 시 구매 기간이면 무조건 구매평 1차 카드를 사용하기 위해 필요합니다
   */
  const checkIsInPurchasePeriod = React.useCallback((): boolean => {
    if (!campaignId) return false;
    const campaignData = reviewCampaignsExtended.find(
      (c) => c.id === campaignId
    );
    const purchasePeriod = campaignData?.detailedSchedule?.purchasePeriod;
    if (!purchasePeriod) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const periodMatch = purchasePeriod.match(
      /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/
    );
    if (periodMatch) {
      const startDate = new Date(periodMatch[1]);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(periodMatch[2]);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    }
    return false;
  }, [campaignId]);

  /**
   * 구매평 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 구매평 특화 카드 렌더링:
   * - 구매 기간이면 구매평 1차 카드 사용
   * - 구매 기간이 아니면 일반 카드 사용
   * - 영수증 흐름(actionType === 1)과 리뷰 흐름 구분
   * - 반려된 경우 PurchaseFirstInspectionCard 또는 PurchaseSecondInspectionCard에서 처리
   * - 대기 탭: CampaignPendingCard 또는 PurchaseFirstPendingCard
   * - 확인 탭: CampaignInspectionCard 또는 PurchaseFirstInspectionCard
   * - 완료 탭: CampaignCompletedCard 또는 PurchaseFirstCompletedCard
   */
  const renderCardComponent = (
    item: ContentItem,
    index: number
  ): React.ReactNode => {
    // 디버깅: 확인 탭 데이터 확인
    if (activeTab === "확인") {
      console.log("[renderCardComponent] 확인 탭 아이템:", {
        id: item.id,
        isPurchasePeriod: params.isPurchasePeriod,
        isReceiptFlow: item.actionType === 1,
        isRejected: item.isRejected,
        isLate: item.isLate,
      });
    }
    const brandChannel = campaignInfo?.brandName ?? item.channel;
    const isReceiptFlow = item.actionType === 1; // actionType 1 = 영수증 흐름
    const applicant: CampaignApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: brandChannel || "",
      channelId: item.channelId || "",
      registrationDate: formatDateTime(item.createdAt),
      campaignType: "review",
      reviewType: 1,
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
      ? "지각 등록"
      : item.updatedAt
      ? "수정"
      : "등록";

    // 대기 탭: 구매 기간이면 구매평 1차 카드, 그 외(등록 단계/마감 포함)는 구매평 2차 카드
    if (activeTab === "대기") {
      // 구매 기간인 경우 구매평 1차 카드 사용
      if (checkIsInPurchasePeriod()) {
        // 구매 기간에서는 영수증 흐름만 있음
        let pendingState: "receipt_not_registered" | "rejected" | "reported" =
          "receipt_not_registered";

        if (item.isReported) {
          pendingState = "reported";
        } else if (item.isRejected) {
          pendingState = "rejected";
        }

        return (
          <PurchaseFirstPendingCard
            key={item.id}
            applicant={applicant}
            pendingState={pendingState}
            deadlineDate={params.deadlineDate}
            reject_reason={rejectReasons.get(item.id) || item.reject_reason}
            reportedDate={reportedDates.get(item.id) || item.reportedDate}
            onCheckReceipt={() => openReceiptModal(item.receiptImages || [])}
            onExtend={handleExtend}
          />
        );
      }

      // 구매 기간이 아닌 경우: 등록 기간이거나 등록 기간 이후(마감 포함) → 항상 구매평 2차 카드 사용
      {
        let pendingState:
          | "content_not_registered"
          | "extension_requested"
          | "rejected"
          | "reported" = "content_not_registered";
        let isExtensionApproved = false;
        let extendedDeadline: string | undefined;

        if (item.isReported) {
          pendingState = "reported";
        } else if (item.isRejected) {
          pendingState = "rejected";
        } else if (item.extension_request_reason) {
          pendingState = "extension_requested";
        } else {
          pendingState = "content_not_registered";
        }

        // 📌 여러 이미지 지원:
        // - receiptImages가 있으면 우선 사용 (페이지네이션 테스트용)
        // - 없으면 thumbnailSrc를 배열로 변환하여 사용
        const reviewImagesForPending = item.receiptImages && item.receiptImages.length > 0
          ? item.receiptImages
          : item.thumbnailSrc
          ? [item.thumbnailSrc]
          : [];
        
        return (
          <PurchaseSecondPendingCard
            key={item.id}
            applicant={applicant}
            pendingState={pendingState}
            isExtensionApproved={isExtensionApproved}
            extendedDeadline={extendedDeadline}
            deadlineDate={params.deadlineDate}
            reject_reason={rejectReasons.get(item.id) || item.reject_reason}
            extension_request_reason={item.extension_request_reason}
            reportedDate={reportedDates.get(item.id) || item.reportedDate}
            reviewImages={reviewImagesForPending}
            onCheckReview={() => openReceiptModal(reviewImagesForPending)}
            onExtend={handleExtend}
            onReport={handleReport}
          />
        );
      }
    }

    // 확인 탭: 구매 기간이면 구매평 1차 카드, 등록 기간이면 구매평 2차 카드, 아니면 일반 카드
    if (activeTab === "확인") {
      // 구매 기간인 경우 구매평 1차 카드 사용
      if (checkIsInPurchasePeriod()) {
        return (
          <PurchaseFirstInspectionCard
            key={item.id}
            applicant={applicant}
            onCheckReceipt={() => openReceiptModal(item.receiptImages || [])}
            onApprove={handleApprove}
            onReject={handleReject}
            onExtend={handleExtend}
            onReport={handleReport}
            dateLabel={dateLabel}
            registrationDate={formatDateTime(item.updatedAt || item.createdAt)}
          />
        );
      }

      // 등록 기간인 경우 구매평 2차 카드 사용
      if (params.isRegistrationPeriod) {
        // 📌 여러 이미지 지원:
        // - receiptImages가 있으면 우선 사용 (페이지네이션 테스트용)
        // - 없으면 thumbnailSrc를 배열로 변환하여 사용
        const reviewImages = item.receiptImages && item.receiptImages.length > 0
          ? item.receiptImages
          : item.thumbnailSrc
          ? [item.thumbnailSrc]
          : [];
        
        return (
          <PurchaseSecondInspectionCard
            key={item.id}
            applicant={applicant}
            onCheckReview={() => openReceiptModal(reviewImages)}
            onApprove={handleApprove}
            onReject={handleReject}
            onExtend={handleExtend}
            onReport={handleReport}
            dateLabel={dateLabel}
            registrationDate={formatDateTime(item.updatedAt || item.createdAt)}
            reviewImages={reviewImages}
          />
        );
      }

      // 구매 기간이 아닌 경우 기존 로직
      // 반려 케이스는 PurchaseFirstInspectionCard 또는 PurchaseSecondInspectionCard에서 처리

      // 리뷰 대기 중 (영수증 완료 후 리뷰 대기)
      if (isReceiptFlow && item.isLate) {
        return (
          <CampaignPendingCard
            key={item.id}
            applicant={{ ...applicant, reviewType: 4 }}
            onCheckReceipt={() => openReceiptModal(item.receiptImages)}
            dateLabel={dateLabel}
          />
        );
      }

      // 일반 검수 카드
      if (isReceiptFlow) {
        return (
          <CampaignInspectionCard
            key={item.id}
            applicant={{ ...applicant, reviewType: 2 }}
            onCheckReceipt={() => openReceiptModal(item.receiptImages)}
            onApprove={handleApprove}
            onReject={() => {}}
            contentType={params.contentType}
            dateLabel={dateLabel}
          />
        );
      }
      return (
        <CampaignInspectionCard
          key={item.id}
          applicant={{ ...applicant, reviewType: 1 }}
          onCheckReview={() =>
            openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
          }
          onCheckImage={
            params.contentType === "image"
              ? () =>
                  openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
              : undefined
          }
          onCheckLink={() => {
            // 📌 링크 확인 핸들러:
            // - getChannelUrl 유틸리티 함수를 사용하여 채널 URL을 생성합니다
            // - channelId와 channel 정보를 사용하여 올바른 URL을 만듭니다
            // - 새 창에서 링크를 엽니다 (target="_blank")
            const linkUrl = getChannelUrl(
              applicant.channel,
              applicant.channelId
            );
            if (linkUrl && linkUrl !== "#") {
              window.open(linkUrl, "_blank", "noopener,noreferrer");
            } else {
              console.warn("유효하지 않은 링크 URL:", linkUrl);
            }
          }}
          onApprove={handleApprove}
          onReject={() => {}}
          onExtend={handleExtend}
          contentType={params.contentType}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭: 구매 기간이면 구매평 1차 카드, 등록 기간이면 구매평 2차 카드, 아니면 일반 카드
    // 📌 중요: 구매 기간이면 무조건 구매평 1차 카드를 사용합니다
    // - 구매 기간에는 "구매 영수증 확인" 버튼이 있는 PurchaseFirstCompletedCard를 사용합니다
    // - 마감 여부와 관계없이 구매 기간이면 구매평 1차 카드를 사용합니다
    
    // 구매 기간인 경우 구매평 1차 카드 사용
    if (checkIsInPurchasePeriod()) {
      return (
        <PurchaseFirstCompletedCard
          key={item.id}
          applicant={applicant}
          onCheckReceipt={() => openReceiptModal(item.receiptImages || [])}
          onReport={handleReport}
          registrationDate={formatDateTime(item.updatedAt || item.createdAt)}
        />
      );
    }

    // 등록 기간인 경우 구매평 2차 카드 사용 (리뷰 확인)
    if (params.isRegistrationPeriod) {
      // 📌 여러 이미지 지원:
      // - receiptImages가 있으면 우선 사용 (페이지네이션 테스트용)
      // - 없으면 thumbnailSrc를 배열로 변환하여 사용
      const reviewImagesForCompleted = item.receiptImages && item.receiptImages.length > 0
        ? item.receiptImages
        : item.thumbnailSrc
        ? [item.thumbnailSrc]
        : [];
      
      return (
        <PurchaseSecondCompletedCard
          key={item.id}
          applicant={applicant}
          onCheckReview={() => openReceiptModal(reviewImagesForCompleted)}
          onReport={handleReport}
          registrationDate={formatDateTime(item.updatedAt || item.createdAt)}
          reviewImages={reviewImagesForCompleted}
        />
      );
    }

    // 완료 탭: 영수증 흐름이면 영수증 확인 라벨/핸들러, 아니면 리뷰 확인
    // 📌 중요: 캠페인이 마감되었으면 구매 영수증 확인 대신 리뷰 확인을 사용합니다
    // - 구매 영수증 확인은 구매 기간에만 가능하므로, 마감 후에는 리뷰 확인을 표시합니다
    const shouldShowReceiptCheck = isReceiptFlow && !params.isCampaignClosed;
    
    return (
      <CampaignCompletedCard
        key={item.id}
        applicant={{
          ...applicant,
          // 캠페인이 마감되었으면 reviewType을 3으로 설정하여 리뷰 확인 버튼 표시
          reviewType: shouldShowReceiptCheck ? 2 : 3,
        }}
        onCheckReceipt={
          shouldShowReceiptCheck ? () => openReceiptModal(item.receiptImages) : undefined
        }
        onCheckReview={
          !shouldShowReceiptCheck
            ? () =>
                openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
            : undefined
        }
        onCheckImage={
          params.contentType === "both" || params.contentType === "image"
            ? () =>
                openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
            : undefined
        }
        onCheckLink={
          params.contentType === "both"
            ? () => {
                // 📌 링크 확인 핸들러:
                // - getChannelUrl 유틸리티 함수를 사용하여 채널 URL을 생성합니다
                // - channelId와 channel 정보를 사용하여 올바른 URL을 만듭니다
                // - 새 창에서 링크를 엽니다 (target="_blank")
                const linkUrl = getChannelUrl(
                  applicant.channel,
                  applicant.channelId
                );
                if (linkUrl && linkUrl !== "#") {
                  window.open(linkUrl, "_blank", "noopener,noreferrer");
                } else {
                  console.warn("유효하지 않은 링크 URL:", linkUrl);
                }
              }
            : undefined
        }
        contentType={params.contentType}
        dateLabel={dateLabel}
      />
    );
  };

  // 연장 핸들러 (확인 탭에서 연장 완료 후 대기 탭으로 이동)
  const handleExtend = (applicantId: string) => {
    // TODO: 연장 기능 구현
    // 연장 완료 후 대기 탭으로 이동하는 로직
    console.log("연장 완료:", applicantId);
  };

  const handleBatchExtension = () => {
    console.log("일괄 기한 연장 클릭");
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
      {/* 영수증 모달 (구매평 특화) */}
      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        images={receiptImages}
        onClose={closeReceiptModal}
      />
    </>
  );
}
