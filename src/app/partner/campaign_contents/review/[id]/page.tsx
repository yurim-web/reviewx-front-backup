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
import ReviewRejectedReviewCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReviewCard";
import ReviewRejectedReceiptCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReceiptCard";
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

  // 캠페인의 contentType 및 등록 기간 가져오기
  // 📌 특화 로직:
  // - 구매평 캠페인만의 특별한 데이터 처리가 필요한 경우 여기에 작성
  const params = React.useMemo(() => {
    if (!campaignId) return { contentType: "link", deadlineDate: undefined };
    
    const campaignData = reviewCampaignsExtended.find((c) => c.id === campaignId);
    const contentType = campaignData?.contentType || "link";
    
    // 등록 기간에서 기한 날짜 추출
    let deadlineDate: string | undefined;
    if (campaignData?.detailedSchedule?.registrationPeriod) {
      const period = campaignData.detailedSchedule.registrationPeriod;
      const match = period.match(/~\s*(\d{4}-\d{2}-\d{2})/);
      deadlineDate = match ? match[1] : undefined;
    }
    
    return { contentType, deadlineDate };
  }, [campaignId]);

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
   * 구매평 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 구매평 특화 카드 렌더링:
   * - 영수증 흐름(actionType === 1)과 리뷰 흐름 구분
   * - 반려된 경우 ReviewRejectedReviewCard 또는 ReviewRejectedReceiptCard 사용
   * - 대기 탭: CampaignPendingCard
   * - 확인 탭: CampaignInspectionCard 또는 CampaignPendingCard (반려)
   * - 완료 탭: CampaignCompletedCard
   */
  const renderCardComponent = (
    item: ContentItem,
    index: number
  ): React.ReactNode => {
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

    // 대기 탭: 4가지 상태 유형에 따른 카드 표시
    if (activeTab === "대기") {
      const hasReceipt =
        item.receiptImages && item.receiptImages.length > 0;
      const hasContent = item.thumbnailSrc || item.createdAt;

      // 상태 결정 로직
      let pendingState:
        | "receipt_not_registered"
        | "content_not_registered"
        | "extension_requested"
        | "rejected" = "content_not_registered";
      let isExtensionApproved = false;
      let extendedDeadline: string | undefined;

      if (item.isRejected) {
        pendingState = "rejected";
      } else if (isReceiptFlow && !hasReceipt) {
        pendingState = "receipt_not_registered";
      } else {
        pendingState = "content_not_registered";
      }

      if (isReceiptFlow) {
        return (
          <CampaignPendingCard
            key={item.id}
            applicant={{ ...applicant, reviewType: 4 }}
            pendingState={pendingState}
            isExtensionApproved={isExtensionApproved}
            extendedDeadline={extendedDeadline}
            deadlineDate={params.deadlineDate}
            onCheckReceipt={() =>
              openReceiptModal(item.receiptImages || [])
            }
            dateLabel={dateLabel}
          />
        );
      }
      return (
        <CampaignPendingCard
          key={item.id}
          applicant={{ ...applicant, reviewType: 1 }}
          pendingState={pendingState}
          isExtensionApproved={isExtensionApproved}
          extendedDeadline={extendedDeadline}
          deadlineDate={params.deadlineDate}
          onCheckReview={() =>
            openReceiptModal(
              item.thumbnailSrc ? [item.thumbnailSrc] : []
            )
          }
          dateLabel={dateLabel}
        />
      );
    }

    // 확인 탭
    if (activeTab === "확인") {
      // 반려 케이스
      if (item.isRejected) {
        if (isReceiptFlow) {
          return (
            <ReviewRejectedReceiptCard
              key={item.id}
              applicant={{ ...applicant, reviewType: 6 }}
              onCheckReceipt={() =>
                openReceiptModal(item.receiptImages)
              }
              onHandleReject={() => {}}
              dateLabel={dateLabel}
            />
          );
        }
        return (
          <ReviewRejectedReviewCard
            key={item.id}
            applicant={{ ...applicant, reviewType: 5 }}
            onCheckReview={() =>
              openReceiptModal(
                item.thumbnailSrc ? [item.thumbnailSrc] : []
              )
            }
            onHandleReject={() => {}}
            dateLabel={dateLabel}
          />
        );
      }

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
            openReceiptModal(
              item.thumbnailSrc ? [item.thumbnailSrc] : []
            )
          }
          onCheckImage={
            params.contentType === "image"
              ? () =>
                  openReceiptModal(
                    item.thumbnailSrc ? [item.thumbnailSrc] : []
                  )
              : undefined
          }
          onCheckLink={() => {
            // 📌 링크 확인 핸들러:
            // - getChannelUrl 유틸리티 함수를 사용하여 채널 URL을 생성합니다
            // - channelId와 channel 정보를 사용하여 올바른 URL을 만듭니다
            // - 새 창에서 링크를 엽니다 (target="_blank")
            const linkUrl = getChannelUrl(applicant.channel, applicant.channelId);
            if (linkUrl && linkUrl !== "#") {
              window.open(linkUrl, "_blank", "noopener,noreferrer");
            } else {
              console.warn("유효하지 않은 링크 URL:", linkUrl);
            }
          }}
          onApprove={handleApprove}
          onReject={() => {}}
          contentType={params.contentType}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭: 영수증 흐름이면 영수증 확인 라벨/핸들러, 아니면 리뷰 확인
    return (
      <CampaignCompletedCard
        key={item.id}
        applicant={{
          ...applicant,
          reviewType: isReceiptFlow ? 2 : 3,
        }}
        onCheckReceipt={
          isReceiptFlow
            ? () => openReceiptModal(item.receiptImages)
            : undefined
        }
        onCheckReview={
          !isReceiptFlow
            ? () =>
                openReceiptModal(
                  item.thumbnailSrc ? [item.thumbnailSrc] : []
                )
            : undefined
        }
        onCheckImage={
          params.contentType === "both" ||
          params.contentType === "image"
            ? () =>
                openReceiptModal(
                  item.thumbnailSrc ? [item.thumbnailSrc] : []
                )
            : undefined
        }
        onCheckLink={
          params.contentType === "both"
            ? () => {
                // 📌 링크 확인 핸들러:
                // - getChannelUrl 유틸리티 함수를 사용하여 채널 URL을 생성합니다
                // - channelId와 channel 정보를 사용하여 올바른 URL을 만듭니다
                // - 새 창에서 링크를 엽니다 (target="_blank")
                const linkUrl = getChannelUrl(applicant.channel, applicant.channelId);
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
