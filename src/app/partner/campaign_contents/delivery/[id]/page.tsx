/* ========================================
   🚚 배송형 콘텐츠 내역 상세 (id 연동) - 대기/확인/완료 탭
   ======================================== */

/**
 * 배송형 캠페인 콘텐츠 내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 배송형 캠페인의 콘텐츠(리뷰) 내역을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_contents/delivery/[id] (동적 라우팅)
 * - 예: /partner/campaign_contents/delivery/delivery_001
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
 * - 이 페이지는 배송형 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

// 배송형 전용 카드 컴포넌트들 (경험형 카드)
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperiencePendingCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperiencePendingCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import ExperienceRejectedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceRejectedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceTypes";
import { getChannelUrl } from "@/utils/channelUrlHelper";

// 배송형 콘텐츠 데이터 로더
import { getDeliveryContentsById } from "@/data/campaign/delivery/deliveryCampaigns";

/**
 * 배송형 캠페인 콘텐츠 내역 페이지 컴포넌트 (동적)
 *
 * 📌 Next.js 동적 라우팅:
 * 1. [id] 폴더명으로 동적 라우팅 설정
 * 2. useParams() 훅으로 URL 파라미터 접근 (useCampaignContents 내부에서 처리)
 * 3. URL: /partner/campaign_contents/delivery/delivery_001
 * 4. params.id = "delivery_001"
 *
 * 📌 배송형 캠페인 특징:
 * - 경험형 카드 사용 (Experience 카드)
 * - 대기/확인/완료 탭으로 콘텐츠 상태 관리
 */
export default function DeliveryContentsDetailPage() {
  // 📌 커스텀 훅 사용:
  // - 모든 공통 로직(상태 관리, 데이터 로딩, 핸들러 등)을 훅에서 가져옵니다
  // - getDeliveryContentsById를 콘텐츠 로더로 전달합니다
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
  } = useCampaignContents(getDeliveryContentsById);

  /**
   * 배송형 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 경험형 카드 렌더링:
   * - 대기 탭: ExperiencePendingCard (콘텐츠 미등록, 반려 등)
   * - 확인 탭: ExperienceInspectionCard (검수 중) 또는 ExperienceRejectedCard (반려)
   * - 완료 탭: ExperienceCompletedCard (완료)
   *
   * @param item - 콘텐츠 아이템 데이터
   * @param index - 리스트 인덱스
   * @returns JSX 요소
   */
  const renderCardComponent = (
    item: ContentItem,
    index: number
  ): React.ReactNode => {
    // 콘텐츠 → 경험형 카드 데이터 매핑
    // 📌 데이터 변환:
    // - ContentItem을 ExperienceApplicant 타입으로 변환합니다
    // - brandName이 있으면 우선 사용, 없으면 item.channel 사용
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

    // 날짜 라벨 결정
    // 📌 조건부 값 할당:
    // - isLate가 true면 "지각 등록"
    // - updatedAt이 있으면 "수정"
    // - 그 외는 "등록"
    const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
      ? "지각 등록"
      : item.updatedAt
      ? "수정"
      : "등록";

    // 대기 탭: 상태에 따른 카드 표시
    if (activeTab === "대기") {
      // 상태 결정 로직
      // 📌 상태 분류:
      // - isRejected: 반려된 콘텐츠
      // - 기본: 콘텐츠 미등록 상태
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
      // TODO: 연장 요청 상태는 추후 데이터에 필드가 추가되면 처리

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
          dateLabel={dateLabel}
        />
      );
    }

    // 확인 탭: 검수 중 또는 반려된 콘텐츠
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
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭: 완료된 콘텐츠
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

  // 일괄 기한 연장 핸들러
  const handleBatchExtension = () => {
    // TODO: 일괄 기한 연장 기능 구현
    console.log("일괄 기한 연장 클릭");
  };

  // 📌 공통 레이아웃 컴포넌트 사용:
  // - 모든 공통 UI와 로직을 CampaignContentsLayout에 위임합니다
  // - 이 페이지는 배송형 캠페인에 특화된 renderCard 함수만 전달합니다
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
