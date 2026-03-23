/* ========================================
   Review 카드 렌더러
   ======================================== */

/**
 * renderReviewCard
 *
 * 목적: review 캠페인의 Purchase/Campaign 카드 렌더링 로직
 *
 * 사용 페이지:
 * - /partner/campaign_contents/review/[id]
 */

import React from "react";
import type { ContentItem } from "@/data/partner/sharedCampaigns";
import CampaignInspectionCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignInspectionCard";
import CampaignCompletedCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignCompletedCard";
import CampaignPendingCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignPendingCard";
import PurchaseFirstPendingCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstPendingCard";
import PurchaseFirstInspectionCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstInspectionCard";
import PurchaseFirstCompletedCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_first_card/PurchaseFirstCompletedCard";
import PurchaseSecondPendingCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondPendingCard";
import PurchaseSecondInspectionCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondInspectionCard";
import PurchaseSecondCompletedCard from "@/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondCompletedCard";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/campaignTypes";
import { openChannelUrl } from "@/utils/helpers/url";

interface ContentItemExtended extends ContentItem {
  isLateSubmission?: boolean;
}

interface RenderReviewCardParams {
  activeTab: string;
  campaignBrandName?: string;
  rejectReasons: Map<string, string>;
  reportedDates: Map<string, string>;
  formatDateTime: (date: string | Date) => string;
  handleApprove: (id: string) => void;
  handleReject: (id: string, reason: string) => void;
  handleReport: (id: string, reportOption?: string, otherReason?: string) => void;
  handleExtend: (id: string) => void;
  handleComplete: (id: string) => void;
  openReceiptModal: (images: string[]) => void;
  checkIsInPurchasePeriod: () => boolean;
  params: {
    contentType: "link" | "image" | "both";
    deadlineDate?: string;
    isPurchasePeriod: boolean;
    isRegistrationPeriod: boolean;
    isCampaignClosed: boolean;
  };
}

/**
 * Review 카드 렌더링 함수 생성
 */
export function createReviewCardRenderer(renderParams: RenderReviewCardParams) {
  // eslint-disable-next-line react/display-name
  return (item: ContentItem, _index: number): React.ReactNode => {
    const brandChannel = renderParams.campaignBrandName ?? item.channel;
    const isReceiptFlow = item.actionType === 1;
    const applicant: CampaignApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: brandChannel || "",
      channelId: item.channelId || "",
      registrationDate: renderParams.formatDateTime(item.createdAt),
      campaignType: "review",
      reviewType: 1,
      receiptImages: item.receiptImages || [],
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = (item as ContentItemExtended).isLateSubmission
      ? "지각 등록"
      : item.updatedAt
        ? "수정"
        : "등록";

    // 대기 탭
    if (renderParams.activeTab === "대기") {
      // 구매 기간인 경우 구매평 1차 카드 사용
      if (renderParams.checkIsInPurchasePeriod()) {
        let pendingState: "receipt_not_registered" | "rejected" | "reported" =
          "receipt_not_registered";

        if (item.isReported) {
          pendingState = "reported";
        } else if (item.isRejected) {
          pendingState = "rejected";
        }

        const reportedDateValue = renderParams.reportedDates.get(item.id) || item.reportedDate;
        const formattedReportedDate = reportedDateValue
          ? renderParams.formatDateTime(reportedDateValue)
          : undefined;

        return (
          <PurchaseFirstPendingCard
            key={item.id}
            applicant={applicant}
            pendingState={pendingState}
            deadlineDate={renderParams.params.deadlineDate}
            reject_reason={renderParams.rejectReasons.get(item.id) || item.reject_reason}
            reportedDate={formattedReportedDate}
            onCheckReceipt={() => renderParams.openReceiptModal(item.receiptImages || [])}
            onExtend={renderParams.handleExtend}
          />
        );
      }

      // 구매 기간이 아닌 경우: 구매평 2차 카드 사용
      let pendingState: "content_not_registered" | "extension_requested" | "rejected" | "reported" =
        "content_not_registered";
      const isExtensionApproved = false;
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

      const reviewImagesForPending =
        item.receiptImages && item.receiptImages.length > 0
          ? item.receiptImages
          : item.thumbnailSrc
            ? [item.thumbnailSrc]
            : [];

      const reportedDateValue = renderParams.reportedDates.get(item.id) || item.reportedDate;
      const formattedReportedDate = reportedDateValue
        ? renderParams.formatDateTime(reportedDateValue)
        : undefined;

      return (
        <PurchaseSecondPendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={isExtensionApproved}
          extendedDeadline={extendedDeadline}
          deadlineDate={renderParams.params.deadlineDate}
          reject_reason={renderParams.rejectReasons.get(item.id) || item.reject_reason}
          extension_request_reason={item.extension_request_reason}
          reportedDate={formattedReportedDate}
          reviewImages={reviewImagesForPending}
          onCheckReview={() => renderParams.openReceiptModal(reviewImagesForPending)}
          onExtend={renderParams.handleExtend}
          onReport={renderParams.handleReport}
        />
      );
    }

    // 확인 탭
    if (renderParams.activeTab === "확인") {
      // 구매 기간인 경우 구매평 1차 카드 사용
      if (renderParams.checkIsInPurchasePeriod()) {
        return (
          <PurchaseFirstInspectionCard
            key={item.id}
            applicant={applicant}
            onCheckReceipt={() => renderParams.openReceiptModal(item.receiptImages || [])}
            onApprove={renderParams.handleApprove}
            onReject={(id, reason) => renderParams.handleReject(id, reason ?? "")}
            onExtend={renderParams.handleExtend}
            onReport={renderParams.handleReport}
            dateLabel={dateLabel}
            registrationDate={renderParams.formatDateTime(item.updatedAt || item.createdAt)}
          />
        );
      }

      // 등록 기간인 경우 구매평 2차 카드 사용
      if (renderParams.params.isRegistrationPeriod) {
        const reviewImages =
          item.receiptImages && item.receiptImages.length > 0
            ? item.receiptImages
            : item.thumbnailSrc
              ? [item.thumbnailSrc]
              : [];

        return (
          <PurchaseSecondInspectionCard
            key={item.id}
            applicant={applicant}
            onCheckReview={() => renderParams.openReceiptModal(reviewImages)}
            onApprove={renderParams.handleApprove}
            onReject={(id, reason) => renderParams.handleReject(id, reason ?? "")}
            onExtend={renderParams.handleExtend}
            onReport={renderParams.handleReport}
            dateLabel={dateLabel}
            registrationDate={renderParams.formatDateTime(item.updatedAt || item.createdAt)}
            reviewImages={reviewImages}
          />
        );
      }

      // 리뷰 대기 중 (영수증 완료 후 리뷰 대기)
      if (isReceiptFlow && (item as ContentItemExtended).isLateSubmission) {
        return (
          <CampaignPendingCard
            key={item.id}
            applicant={{ ...applicant, reviewType: 4 }}
            onCheckReceipt={() => renderParams.openReceiptModal(item.receiptImages ?? [])}
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
            onCheckReceipt={() => renderParams.openReceiptModal(item.receiptImages ?? [])}
            onApprove={renderParams.handleApprove}
            onReject={() => {}}
            contentType={renderParams.params.contentType}
            dateLabel={dateLabel}
          />
        );
      }

      return (
        <CampaignInspectionCard
          key={item.id}
          applicant={{ ...applicant, reviewType: 1 }}
          onCheckReview={() =>
            renderParams.openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
          }
          onCheckImage={
            renderParams.params.contentType === "image"
              ? () => renderParams.openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
              : undefined
          }
          onCheckLink={() => openChannelUrl(applicant.channel, applicant.channelId)}
          onApprove={renderParams.handleApprove}
          onReject={() => {}}
          onExtend={renderParams.handleExtend}
          contentType={renderParams.params.contentType}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭
    // 구매 기간인 경우 구매평 1차 카드 사용
    if (renderParams.checkIsInPurchasePeriod()) {
      return (
        <PurchaseFirstCompletedCard
          key={item.id}
          applicant={applicant}
          onCheckReceipt={() => renderParams.openReceiptModal(item.receiptImages || [])}
          onReport={renderParams.handleReport}
          registrationDate={renderParams.formatDateTime(item.updatedAt || item.createdAt)}
        />
      );
    }

    // 등록 기간인 경우 구매평 2차 카드 사용
    if (renderParams.params.isRegistrationPeriod) {
      const reviewImagesForCompleted =
        item.receiptImages && item.receiptImages.length > 0
          ? item.receiptImages
          : item.thumbnailSrc
            ? [item.thumbnailSrc]
            : [];

      return (
        <PurchaseSecondCompletedCard
          key={item.id}
          applicant={applicant}
          onCheckReview={() => renderParams.openReceiptModal(reviewImagesForCompleted)}
          onReport={renderParams.handleReport}
          registrationDate={renderParams.formatDateTime(item.updatedAt || item.createdAt)}
          reviewImages={reviewImagesForCompleted}
        />
      );
    }

    // 완료 탭: 영수증 흐름이면 영수증 확인, 아니면 리뷰 확인
    const shouldShowReceiptCheck = isReceiptFlow && !renderParams.params.isCampaignClosed;

    return (
      <CampaignCompletedCard
        key={item.id}
        applicant={{
          ...applicant,
          reviewType: shouldShowReceiptCheck ? 2 : 3,
        }}
        onCheckReceipt={
          shouldShowReceiptCheck
            ? () => renderParams.openReceiptModal(item.receiptImages ?? [])
            : undefined
        }
        onCheckReview={
          !shouldShowReceiptCheck
            ? () => renderParams.openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
            : undefined
        }
        onCheckImage={
          renderParams.params.contentType === "both" || renderParams.params.contentType === "image"
            ? () => renderParams.openReceiptModal(item.thumbnailSrc ? [item.thumbnailSrc] : [])
            : undefined
        }
        onCheckLink={
          renderParams.params.contentType === "both"
            ? () => openChannelUrl(applicant.channel, applicant.channelId)
            : undefined
        }
        onComplete={renderParams.handleComplete}
        contentType={renderParams.params.contentType}
        dateLabel={dateLabel}
      />
    );
  };
}
