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

import React, { useState, useMemo } from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignContents } from "@/hooks/partner/campaign_contents/useCampaignContents";
import CampaignContentsLayout from "@/components/partner/campaign_contents/CampaignContentsLayout";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

// 배송형 전용 카드 컴포넌트들 (경험형 카드)
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperiencePendingCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperiencePendingCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceTypes";
import { getChannelUrl } from "@/utils/helpers/url";

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
    handleReport,
    reportedDates,
    formatDateTime,
  } = useCampaignContents(getDeliveryContentsById);

  // 📌 등록 기간에서 기한 날짜 추출:
  // - campaignInfo의 registrationPeriod에서 마지막 날짜를 추출합니다
  // - 예: "2025-12-08 ~ 2025-12-25" → "2025-12-25"
  // - 경우의 수 1 (콘텐츠 미등록)에서 기한 날짜를 표시하기 위해 사용합니다
  const deadlineDate = useMemo(() => {
    if (!campaignInfo?.registrationPeriod) return undefined;

    // 등록 기간 문자열에서 마지막 날짜 추출
    // 📌 정규표현식 사용:
    // - " ~ " 또는 "~" 구분자를 사용하여 날짜를 분리합니다
    // - 마지막 날짜 부분을 추출합니다
    const period = campaignInfo.registrationPeriod;
    const separator = period.includes(" ~ ") ? " ~ " : "~";
    const parts = period.split(separator);
    const endDateStr = parts[1]?.trim();

    if (endDateStr) {
      // 날짜 형식 검증 (YYYY-MM-DD)
      const dateMatch = endDateStr.match(/^(\d{4}-\d{2}-\d{2})/);
      return dateMatch ? dateMatch[1] : undefined;
    }

    return undefined;
  }, [campaignInfo?.registrationPeriod]);

  // 📌 반려 사유 저장 상태:
  // - 확인 탭에서 반려 처리 시 입력한 반려 사유를 저장
  // - Map 자료구조 사용: { contentId: rejectReason }
  // - 대기 탭에서 ExperiencePendingCard에 전달하여 표시
  const [rejectReasons, setRejectReasons] = useState<Map<string, string>>(
    new Map()
  );

  // 📌 반려 처리 핸들러:
  // - 확인 탭에서 반려 버튼 클릭 시 실행
  // - 반려 사유를 저장하고 대기 탭으로 이동
  // - 대기 탭에서 ExperiencePendingCard의 4번째 경우로 표시
  const handleReject = (contentId: string, rejectReason: string) => {
    // 반려 사유 저장
    setRejectReasons((prev) => {
      const newMap = new Map(prev);
      newMap.set(contentId, rejectReason);
      return newMap;
    });

    // 대기 탭으로 이동
    setActiveTab("대기");

    // URL 쿼리 파라미터도 업데이트
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "대기");
      window.history.pushState({}, "", url.toString());
    }
  };

  // 📌 반려된 콘텐츠 필터링:
  // - reviewing에서 반려된 콘텐츠를 제거하고 waiting에 추가
  // - rejectReasons에 있는 ID를 가진 콘텐츠를 reviewing에서 필터링
  // - useMemo를 사용하여 rejectReasons나 contents가 변경될 때만 재계산
  const filteredContents = useMemo(() => {
    const reviewing = contents.reviewing || [];
    const waiting = contents.waiting || [];

    // 반려된 콘텐츠 ID 목록
    const rejectedIds = Array.from(rejectReasons.keys());

    // reviewing에서 반려된 콘텐츠 필터링
    const rejectedItems = reviewing.filter((item) =>
      rejectedIds.includes(item.id)
    );
    const remainingReviewing = reviewing.filter(
      (item) => !rejectedIds.includes(item.id)
    );

    // waiting에 반려된 콘텐츠 추가 (중복 방지)
    const existingWaitingIds = new Set(waiting.map((item) => item.id));
    const newWaitingItems = rejectedItems.filter(
      (item) => !existingWaitingIds.has(item.id)
    );

    return {
      waiting: [...waiting, ...newWaitingItems],
      reviewing: remainingReviewing,
      completed: contents.completed || [],
    };
  }, [contents, rejectReasons]);

  // 📌 필터링된 콘텐츠 기반으로 카운트 재계산:
  // - 반려된 콘텐츠가 waiting으로 이동했으므로 카운트도 업데이트
  const filteredWaitingCount = filteredContents.waiting?.length || 0;
  const filteredReviewCount = filteredContents.reviewing?.length || 0;
  const filteredCompletedCount = filteredContents.completed?.length || 0;

  /**
   * 배송형 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 경험형 카드 렌더링:
   * - 대기 탭: ExperiencePendingCard (콘텐츠 미등록, 반려 등)
   * - 확인 탭: ExperienceInspectionCard (검수 중, 경우의 수 3가지)
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
    // - channel 필드에는 채널 타입(네이버블로그, 인스타그램 등)을 사용해야 getChannelUrl이 올바른 URL을 생성할 수 있습니다
    const applicant: ExperienceApplicant = {
      id: item.id,
      userType: item.userType,
      nickname: item.nickname,
      profileImage: item.profileImage,
      channel: item.channel || "",
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
      // - isReported: 신고된 콘텐츠
      // - isRejected: 반려된 콘텐츠
      // - 기본: 콘텐츠 미등록 상태
      let pendingState:
        | "content_not_registered"
        | "extension_requested"
        | "rejected"
        | "reported" = "content_not_registered";
      let isExtensionApproved = false;
      let extendedDeadline: string | undefined;

      // 📌 상태 확인:
      // 1. 신고된 경우: reported
      // 2. 반려된 경우: rejected (item.isRejected 또는 rejectReasons에 해당 ID가 있으면)
      if (item.isReported) {
        pendingState = "reported";
      } else if (item.isRejected || rejectReasons.has(item.id)) {
        pendingState = "rejected";
      }
      // TODO: 연장 요청 상태는 추후 데이터에 필드가 추가되면 처리

      // 반려 사유 가져오기 (rejectReasons에서 조회)
      const rejectReason = rejectReasons.get(item.id) || "";

      return (
        <ExperiencePendingCard
          key={item.id}
          applicant={applicant}
          pendingState={pendingState}
          isExtensionApproved={isExtensionApproved}
          extendedDeadline={extendedDeadline}
          deadlineDate={deadlineDate}
          reject_reason={rejectReason}
          reportedDate={reportedDates.get(item.id) || item.reportedDate}
          onReport={handleReport}
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

    // 확인 탭: 검수 중 콘텐츠 (반려된 경우는 대기 탭으로 이동)
    // 📌 filteredContents를 사용하여 반려된 콘텐츠가 제거된 reviewing 데이터 사용
    if (activeTab === "확인") {
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
          onReject={handleReject}
          onReport={handleReport}
          dateLabel={dateLabel}
        />
      );
    }

    // 완료 탭: 완료된 콘텐츠 (항상 동일한 완료 카드)
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
        onReport={handleReport}
        dateLabel={dateLabel}
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
      waitingCount={filteredWaitingCount}
      reviewCount={filteredReviewCount}
      completedCount={filteredCompletedCount}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      sortOptions={sortOptions}
      contents={filteredContents}
      renderCard={renderCardComponent}
      onBatchExtension={handleBatchExtension}
    />
  );
}
