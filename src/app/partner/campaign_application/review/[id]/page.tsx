/* ========================================
   🛒 구매평 캠페인 신청내역 페이지 (동적)
   ======================================== */

/**
 * 구매평 캠페인 신청내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 구매평 캠페인에 신청한 사용자들의 목록을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/review/[id] (동적 라우팅)
 * - 예: /partner/campaign_application/review/review_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 신청자/선정자 탭 네비게이션
 * - 신청자 목록 그리드 표시 (프로필, 메모 등 - basic 카드만 사용)
 * - 선정하기/선택 취소 버튼 기능
 * - 필터링 및 정렬 기능
 *
 * 📌 리팩토링:
 * - 공통 로직은 useCampaignApplication 훅으로 추출
 * - 공통 UI는 CampaignApplicationLayout 컴포넌트로 추출
 * - 이 페이지는 구매평 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/partner/campaign_application/CampaignApplicationLayout";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";

// 구매평 전용 카드 컴포넌트 (basic 타입 사용)
import BasicCard from "@/components/partner/campaign_application/card_type/basic/BasicCard";

// 개별 신청자 타입들 import (카드 컴포넌트에서 사용)
import { type BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 구매평 캠페인 신청내역 페이지 컴포넌트 (동적)
 *
 * 📌 Next.js 동적 라우팅:
 * 1. [id] 폴더명으로 동적 라우팅 설정
 * 2. useParams() 훅으로 URL 파라미터 접근 (useCampaignApplication 내부에서 처리)
 * 3. URL: /partner/campaign_application/review/review_001
 * 4. params.id = "review_001"
 *
 * 📌 구매평 캠페인 특징:
 * - basic 카드 타입만 사용
 * - 채널별 특화 정보 없음 (팔로워, 구독자 수 등)
 * - 기본 프로필 정보와 메모만 표시
 */
export default function ReviewCampaignApplicationPage() {
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
   * - BasicCard 타입 사용
   * - 채널별 특화 정보 없음 (팔로워, 구독자 수 등)
   * - 기본 프로필 정보, 회원 타입, 메모만 표시
   * - 선정하기 버튼만 제공 (선택 취소는 지원하지 않음)
   *
   * @param applicant - 신청자 데이터 (BasicApplicant)
   * @param isSelected - 선정 탭 여부 (BasicCard는 미사용)
   * @returns JSX 요소
   */
  const renderCardComponent = (
    applicant: AllApplicant,
    isSelected: boolean = false
  ): React.ReactNode => {
    // 구매평은 BasicApplicant 타입으로 처리
    const basicApplicant = applicant as BasicApplicant;

    // BasicCard는 선정 탭을 지원하지 않으므로 신청자 탭에서만 표시
    if (isSelected) {
      return null;
    }

    return (
      <BasicCard
        applicant={basicApplicant}
        onSelect={handleSelectApplicant}
      />
    );
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
