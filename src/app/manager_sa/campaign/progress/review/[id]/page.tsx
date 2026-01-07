/* ========================================
   🛒 SA 관리자 구매평 캠페인 상세 페이지 (동적)
   ======================================== */

/**
 * 구매평 캠페인 진행 현황 상세 페이지 (SA 관리자 버전)
 *
 * 목적: SA 관리자가 진행 현황 테이블에서 특정 구매평 캠페인을 클릭했을 때
 *       신청자/선정자 목록, 카드 이동, 엑셀 다운로드 등 상세 관리를 할 수 있도록 구성합니다.
 *
 * 참고:
 * - 파트너 센터의 `/partner/campaign_application/review/[id]` 페이지 구조를 그대로 차용했습니다.
 * - 관리자 페이지에 맞게 주석과 용어를 재정비했습니다.
 * - 구매평은 basic 카드 타입만 사용합니다.
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/manager/common/campaign/progress/CampaignApplicationLayout";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";

// 구매평 전용 카드 컴포넌트들 (basic 타입만 사용)
import BasicCard from "@/components/partner/campaign_application/card_type/basic/BasicCard";
import BasicSelectedCard from "@/components/partner/campaign_application/card_type/basic/BasicSelectedCard";

// 개별 신청자 타입들 import (카드 컴포넌트에서 사용)
import { type BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 구매평 캠페인 상세 컴포넌트
 */
export default function ManagerReviewProgressDetailPage() {
  // 📌 커스텀 훅 사용:
  // - 모든 공통 로직(상태 관리, 데이터 로딩, 핸들러 등)을 훅에서 가져옵니다
  const {
    campaignData,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    sortOptions,
    applicantsCount,
    selectedCount,
    currentApplicants,
    is_modal_open,
    handleSelectApplicant,
    handleCancelApplicant,
    handle_close_modal,
    is_already_selected_modal_open,
    handle_close_already_selected_modal,
  } = useCampaignApplication();

  /**
   * 구매평 캠페인용 카드 컴포넌트를 렌더링하는 함수
   *
   * 📌 구매평 캠페인 특징:
   * - basic 카드 타입만 사용
   * - 채널별 특화 정보 없음 (팔로워, 구독자 수 등)
   * - 기본 프로필 정보와 메모만 표시
   * - 선정/미선정 상태에 따라 다른 카드 컴포넌트 사용
   * - 📌 관리자 모드: 선정하기/선택 취소 버튼 비활성화 (빈 함수 전달)
   *
   * @param applicant - 신청자 데이터 (BasicApplicant)
   * @param isSelected - 선정 탭 여부
   * @returns JSX 요소
   */
  const renderCardComponent = (
    applicant: AllApplicant,
    isSelected: boolean = false
  ): React.ReactNode => {
    // 관리자 모드: 버튼 비활성화를 위한 빈 함수
    const empty_handler = () => {};

    // 구매평은 항상 BasicApplicant 타입으로 처리
    const basicApplicant = applicant as BasicApplicant;

    if (isSelected) {
      return (
        <BasicSelectedCard
          applicant={basicApplicant}
          onCancel={empty_handler}
        />
      );
    } else {
      return <BasicCard applicant={basicApplicant} onSelect={empty_handler} />;
    }
  };

  // 📌 공통 레이아웃 컴포넌트 사용:
  // - 모든 공통 UI와 로직을 CampaignApplicationLayout에 위임합니다
  // - 이 페이지는 구매평 캠페인에 특화된 renderCard 함수만 전달합니다
  return (
    <CampaignApplicationLayout
      campaignData={campaignData}
      isLoading={isLoading}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      applicantsCount={applicantsCount}
      selectedCount={selectedCount}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      sortOptions={sortOptions}
      currentApplicants={currentApplicants}
      is_modal_open={is_modal_open}
      handle_close_modal={handle_close_modal}
      is_already_selected_modal_open={is_already_selected_modal_open}
      handle_close_already_selected_modal={handle_close_already_selected_modal}
      handleSelectApplicant={handleSelectApplicant}
      handleCancelApplicant={handleCancelApplicant}
      renderCard={renderCardComponent}
    />
  );
}
