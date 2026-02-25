/* ========================================
🎴 Mission 카드 렌더러
======================================== */

/**
 * Mission 카드 렌더러
 *
 * 목적: mission 캠페인에서 사용하는 Mission 카드 렌더링 로직
 *
 * 사용 페이지:
 * - /partner/campaign_contents/mission/[id]
 */

import React from "react";
import type { ContentItem } from "@/data/partner/sharedCampaigns";
import MissionPendingCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionPendingCard";
import MissionInspectionCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionInspectionCard";
import MissionCompletedCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionCompletedCard";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/campaignTypes";
import { openChannelUrl } from "@/utils/helpers/url";

interface ContentItemExtended extends ContentItem {
  extension_request_reason?: string;
  isExtensionApproved?: boolean;
  extendedDeadline?: string;
}

interface RenderMissionCardParams {
  activeTab: string;
  campaignBrandName?: string;
  rejectReasons: Map<string, string>;
  reportedDates: Map<string, string>;
  formatDateTime: (date: string | Date) => string;
  handleApprove: (id: string) => void;
  handleReject: (id: string, reason: string) => void;
  handleReport: (id: string) => void;
  handleExtend: (id: string) => void;
  contentType: "link" | "image" | "both";
  deadlineDate?: string;
}

/**
 * Mission 카드 렌더링 함수 생성
 */
export function createMissionCardRenderer(params: RenderMissionCardParams) {
  // eslint-disable-next-line react/display-name
  return (item: ContentItem, _index: number): React.ReactNode => {
    const brandChannel = params.campaignBrandName ?? item.channel;
    const applicant: CampaignApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: brandChannel || "",
      channelId: item.channelId || "",
      registrationDate: params.formatDateTime(item.createdAt),
      campaignType: "mission",
      missionType: 1,
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = item.isLateSubmission
      ? "지각 등록"
      : item.updatedAt
        ? "수정"
        : "등록";

    const registrationDate = params.formatDateTime(item.updatedAt || item.createdAt);

    // 대기 탭
    if (params.activeTab === "대기") {
      let pendingState: "content_not_registered" | "extension_requested" | "rejected" | "reported" =
        "content_not_registered";

      const extItem = item as ContentItemExtended;
      if (item.isRejected) {
        pendingState = "rejected";
      } else if (item.isReported) {
        pendingState = "reported";
      } else if (extItem.extension_request_reason) {
        pendingState = "extension_requested";
      }

      const reportedDateValue = params.reportedDates.get(item.id) || item.reportedDate;
      const formattedReportedDate = reportedDateValue
        ? params.formatDateTime(reportedDateValue)
        : undefined;

      return (
        <MissionPendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={extItem.isExtensionApproved}
          extendedDeadline={extItem.extendedDeadline}
          deadlineDate={params.deadlineDate}
          reject_reason={params.rejectReasons.get(item.id) || item.reject_reason}
          extension_request_reason={extItem.extension_request_reason}
          reportedDate={formattedReportedDate}
          onExtend={params.handleExtend}
          onReport={params.handleReport}
        />
      );
    }

    // 확인 탭
    if (params.activeTab === "확인") {
      return (
        <MissionInspectionCard
          key={item.id}
          applicant={applicant}
          onCheckLink={() => openChannelUrl(applicant.channel, applicant.channelId)}
          onCheckImage={() => {
            // TODO: 이미지 확인 모달 구현
          }}
          onApprove={params.handleApprove}
          onReject={(applicantId, rejectReason) => params.handleReject(applicantId, rejectReason)}
          onExtend={params.handleExtend}
          onReport={params.handleReport}
          contentType={params.contentType}
          registrationDate={registrationDate}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭
    return (
      <MissionCompletedCard
        key={item.id}
        applicant={applicant}
        onCheckLink={() => openChannelUrl(applicant.channel, applicant.channelId)}
        onCheckImage={() => {
          // TODO: 이미지 확인 모달 구현
        }}
        onReport={params.handleReport}
        contentType={params.contentType}
        registrationDate={registrationDate}
        dateLabel={dateLabel}
      />
    );
  };
}
