/* ========================================
   Experience 카드 렌더러
   ======================================== */

/**
 * renderExperienceCard
 *
 * 목적: delivery·visit·reporter 캠페인의 Experience 카드 렌더링 로직
 *
 * 사용 페이지:
 * - /partner/campaign_contents/delivery/[id]
 * - /partner/campaign_contents/visit/[id]
 * - /partner/campaign_contents/reporter/[id]
 */

import React from "react";
import type { ContentItem } from "@/data/partner/sharedCampaigns";
import ExperiencePendingCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperiencePendingCard";
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/experienceTypes";
import { openChannelUrl } from "@/utils/helpers/url";

interface ContentItemExtended extends ContentItem {
  extension_request_reason?: string;
  isExtensionApproved?: boolean;
  extendedDeadline?: string;
  isLateSubmission?: boolean;
}

interface RenderExperienceCardParams {
  activeTab: string;
  rejectReasons: Map<string, string>;
  reportedDates: Map<string, string>;
  formatDateTime: (date: string | Date) => string;
  handleApprove: (id: string) => void;
  handleReject: (id: string, reason: string) => void;
  handleReport: (id: string) => void;
  deadlineDate?: string;
  enableExtensionRequest?: boolean; // visit에서만 true
}

/**
 * Experience 카드 렌더링 함수 생성 (delivery, visit, reporter 공용)
 */
export function createExperienceCardRenderer(params: RenderExperienceCardParams) {
  // eslint-disable-next-line react/display-name
  return (item: ContentItem, _index: number): React.ReactNode => {
    const applicant: ExperienceApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: item.channel || "",
      channelId: item.channelId || "",
      registrationDate: params.formatDateTime(item.createdAt),
      updatedAt: item.updatedAt ? params.formatDateTime(item.updatedAt) : undefined,
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = (item as ContentItemExtended).isLateSubmission
      ? "지각 등록"
      : item.updatedAt
        ? "수정"
        : "등록";

    // 대기 탭
    if (params.activeTab === "대기") {
      let pendingState: "content_not_registered" | "extension_requested" | "rejected" | "reported" =
        "content_not_registered";
      let isExtensionApproved = false;
      let extendedDeadline: string | undefined;
      let localDeadlineDate = params.deadlineDate;

      const extItem = item as ContentItemExtended;

      if (item.isReported) {
        pendingState = "reported";
      } else if (item.isRejected || params.rejectReasons.has(item.id)) {
        pendingState = "rejected";
      } else if (params.enableExtensionRequest && extItem.extension_request_reason) {
        pendingState = "extension_requested";
      }

      // visit 페이지 데모 데이터 하드코딩 (visit에서만 적용)
      if (params.enableExtensionRequest && item.id === "content_visit_9_waiting_003") {
        localDeadlineDate = "2026-01-10";
        extendedDeadline = "2026-01-13";
        isExtensionApproved = true;
      }

      const reportedDateValue = params.reportedDates.get(item.id) || item.reportedDate;
      const formattedReportedDate = reportedDateValue
        ? params.formatDateTime(reportedDateValue)
        : undefined;

      return (
        <ExperiencePendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={isExtensionApproved}
          extendedDeadline={extendedDeadline}
          deadlineDate={localDeadlineDate}
          reject_reason={params.rejectReasons.get(item.id) || ""}
          reportedDate={formattedReportedDate}
          onReport={params.handleReport}
          onContentCheck={() => openChannelUrl(applicant.channel, applicant.channelId)}
          dateLabel={dateLabel}
        />
      );
    }

    // 확인 탭
    if (params.activeTab === "확인") {
      return (
        <ExperienceInspectionCard
          key={item.id}
          applicant={applicant}
          onContentCheck={() => openChannelUrl(applicant.channel, applicant.channelId)}
          onApprove={params.handleApprove}
          onReject={params.handleReject}
          onReport={params.handleReport}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭
    return (
      <ExperienceCompletedCard
        key={item.id}
        applicant={applicant}
        onContentCheck={() => openChannelUrl(applicant.channel, applicant.channelId)}
        onReport={params.handleReport}
        dateLabel={dateLabel}
      />
    );
  };
}
