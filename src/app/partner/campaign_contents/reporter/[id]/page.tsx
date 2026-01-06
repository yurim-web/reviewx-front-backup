/* ========================================
   📰 기자단 콘텐츠 내역 상세 (id 연동) - 대기/확인/완료 탭
   ======================================== */

/**
 * 기자단 캠페인 콘텐츠 내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 기자단 캠페인의 콘텐츠(리뷰) 내역을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_contents/reporter/[id] (동적 라우팅)
 * - 예: /partner/campaign_contents/reporter/reporter_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 대기/확인/완료 탭 네비게이션
 * - 콘텐츠 목록 그리드 표시 (경험형 카드 사용)
 * - 승인/반려 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 *
 * 📌 리팩토링:
 * - 공통 로직은 useCampaignContents 훅으로 추출
 * - 공통 UI는 CampaignContentsLayout 컴포넌트로 추출
 * - 이 페이지는 기자단 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

// 기자단 전용 카드 컴포넌트들 (경험형 카드)
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperiencePendingCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperiencePendingCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import ExperienceRejectedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceRejectedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceTypes";
import { getChannelUrl } from "@/utils/channelUrlHelper";

// 기자단 콘텐츠 데이터 로더
import { getReporterContentsById } from "@/data/campaign/reporter/reporterCampaigns";

/**
 * 기자단 캠페인 콘텐츠 내역 페이지 컴포넌트 (동적)
 *
 * 📌 기자단 캠페인 특징:
 * - 경험형 카드 사용 (Experience 카드)
 * - 배송형/방문형과 동일한 카드 구조
 */
export default function ReporterContentsDetailPage() {
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
  } = useCampaignContents(getReporterContentsById);

  /**
   * 기자단 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 경험형 카드 렌더링:
   * - 배송형/방문형과 동일한 카드 구조 사용
   */
  const renderCardComponent = (
    item: ContentItem,
    index: number
  ): React.ReactNode => {
    const brandChannel = campaignInfo?.brandName ?? item.channel;
    const applicant: ExperienceApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: brandChannel || "",
      channelId: item.channelId || "",
      registrationDate: formatDateTime(item.createdAt),
      updatedAt: item.updatedAt ? formatDateTime(item.updatedAt) : undefined,
    };

    const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
      ? "지각 등록"
      : item.updatedAt
      ? "수정"
      : "등록";

    if (activeTab === "대기") {
      let pendingState:
        | "content_not_registered"
        | "extension_requested"
        | "rejected" = "content_not_registered";
      let isExtensionApproved = false;
      let extendedDeadline: string | undefined;
      let deadlineDate: string | undefined;

      if (item.isRejected) {
        pendingState = "rejected";
      }

      return (
        <ExperiencePendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={isExtensionApproved}
          extendedDeadline={extendedDeadline}
          deadlineDate={deadlineDate}
          onContentCheck={() => {
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
          dateLabel={dateLabel}
        />
      );
    }

    if (activeTab === "확인") {
      if (item.isRejected) {
        return (
          <ExperienceRejectedCard
            key={item.id}
            applicant={applicant}
            onContentCheck={() => {
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
            onHandleReject={() => {}}
            dateLabel={dateLabel}
          />
        );
      }
      return (
        <ExperienceInspectionCard
          key={item.id}
          applicant={applicant}
          onContentCheck={() => {
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
          dateLabel={dateLabel}
        />
      );
    }

    return (
      <ExperienceCompletedCard
        key={item.id}
        applicant={applicant}
        onContentCheck={() => {
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
        dateLabel={dateLabel}
        isLate={item.isLate || false}
        onApprove={handleApprove}
        onReject={() => {}}
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
