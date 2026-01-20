/* ========================================
   🎯 미션형 콘텐츠 내역 상세 (id 연동)
   ======================================== */

/**
 * 미션형 캠페인 콘텐츠 내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 미션형 캠페인의 콘텐츠(리뷰) 내역을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_contents/mission/[id] (동적 라우팅)
 * - 예: /partner/campaign_contents/mission/mission_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 대기/확인/완료 탭 네비게이션
 * - 콘텐츠 목록 그리드 표시 (Campaign 카드 사용)
 * - 승인/반려 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 *
 * 📌 리팩토링:
 * - 공통 로직은 useCampaignContents 훅으로 추출
 * - 공통 UI는 CampaignContentsLayout 컴포넌트로 추출
 * - 이 페이지는 미션형 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React from "react";
import { useParams } from "next/navigation";
// 공통 훅과 컴포넌트 import
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

// 미션형 전용 카드 컴포넌트들
import MissionPendingCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionPendingCard";
import MissionInspectionCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionInspectionCard";
import MissionCompletedCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionCompletedCard";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/CampaignTypes";
import { getChannelUrl } from "@/utils/helpers/url";

// 미션형 콘텐츠 데이터 로더 및 확장 데이터
import {
  getMissionContentsById,
  missionCampaignsExtended,
} from "@/data/campaign/mission/missionCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";

/**
 * 미션형 캠페인 콘텐츠 내역 페이지 컴포넌트 (동적)
 *
 * 📌 미션형 캠페인 특징:
 * - Campaign 카드 사용 (구매평/미션형 공용 카드)
 * - contentType에 따라 다른 카드 표시
 * - missionType에 따라 다른 카드 타입 사용
 */
export default function MissionContentsDetailPage() {
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
  } = useCampaignContents((campaignId) => {
    // sharedCampaigns에 contents가 있으면 우선 사용
    const shared = getCampaignById(campaignId);
    if (shared && (shared as any).contents) {
      return (shared as any).contents;
    }
    return getMissionContentsById(campaignId);
  });


  // URL 파라미터에서 캠페인 ID 가져오기
  const params_url = useParams();
  const campaignId = params_url.id as string;

  // 캠페인의 contentType 및 등록 기간 가져오기
  // 📌 특화 로직:
  // - 미션형 캠페인만의 특별한 데이터 처리가 필요한 경우 여기에 작성
  const params = React.useMemo(() => {
    if (!campaignId) return { contentType: "link" as "link" | "image" | "both", deadlineDate: undefined };

    const campaignData = missionCampaignsExtended.find((c) => c.id === campaignId);
    const contentType = (campaignData?.contentType || "link") as "link" | "image" | "both";

    // 등록 기간에서 기한 날짜 추출
    let deadlineDate: string | undefined;
    if (campaignData?.detailedSchedule?.registrationPeriod) {
      const period = campaignData.detailedSchedule.registrationPeriod;
      const match = period.match(/~\s*(\d{4}-\d{2}-\d{2})/);
      deadlineDate = match ? match[1] : undefined;
    }

    return { contentType, deadlineDate };
  }, [campaignId]);

  // 연장 핸들러 (placeholder)
  const handleExtend = (applicantId: string) => {
    console.log("연장 처리:", applicantId);
    // TODO: 실제 연장 로직 구현
  };

  /**
   * 미션형 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 미션형 카드 렌더링:
   * - 대기 탭: MissionPendingCard
   * - 확인 탭: MissionInspectionCard
   * - 완료 탭: MissionCompletedCard
   */
  const renderCardComponent = (
    item: ContentItem,
    index: number
  ): React.ReactNode => {
    const brandChannel = campaignInfo?.brandName ?? item.channel;
    const applicant: CampaignApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: brandChannel || "",
      channelId: item.channelId || "",
      registrationDate: formatDateTime(item.createdAt),
      campaignType: "mission",
      missionType: 1, // 미션형 카드에서는 missionType을 사용하지 않음
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
      ? "지각 등록"
      : item.updatedAt
      ? "수정"
      : "등록";

    const registrationDate = formatDateTime(item.updatedAt || item.createdAt);

    // 대기 탭: 콘텐츠 미등록 상태 카드 표시
    if (activeTab === "대기") {
      let pendingState:
        | "content_not_registered"
        | "extension_requested"
        | "rejected"
        | "reported" = "content_not_registered";

      if (item.isRejected) {
        pendingState = "rejected";
      } else if (item.isReported) {
        pendingState = "reported";
      } else if ((item as any).extension_request_reason) {
        pendingState = "extension_requested";
      }

      return (
        <MissionPendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={(item as any).isExtensionApproved}
          extendedDeadline={(item as any).extendedDeadline}
          deadlineDate={params.deadlineDate}
          reject_reason={rejectReasons.get(item.id) || item.reject_reason}
          extension_request_reason={(item as any).extension_request_reason}
          reportedDate={reportedDates.get(item.id) || item.reportedDate}
          onExtend={handleExtend}
          onReport={handleReport}
        />
      );
    }

    // 확인 탭
    if (activeTab === "확인") {
      return (
        <MissionInspectionCard
          key={item.id}
          applicant={applicant}
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
          onCheckImage={() => {
            // TODO: 이미지 확인 모달 구현
            console.log("이미지 확인:", item.id);
          }}
          onApprove={handleApprove}
          onReject={(applicantId, rejectReason) => handleReject(applicantId, rejectReason)}
          onExtend={handleExtend}
          onReport={handleReport}
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
        onCheckImage={() => {
          // TODO: 이미지 확인 모달 구현
          console.log("이미지 확인:", item.id);
        }}
        onReport={handleReport}
        contentType={params.contentType}
        registrationDate={registrationDate}
        dateLabel={dateLabel}
      />
    );
  };


  const handleBatchExtension = () => {
    console.log("일괄 기한 연장 클릭");
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
