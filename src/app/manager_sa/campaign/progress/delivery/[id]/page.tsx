/* ========================================
   🚚 SA 관리자 배송형 캠페인 상세 페이지 (동적)
   ======================================== */

/**
 * 배송형 캠페인 진행 현황 상세 페이지 (SA 관리자 버전)
 *
 * 목적: SA 관리자가 진행 현황 테이블에서 특정 배송형 캠페인을 클릭했을 때
 *       신청자/선정자 목록, 카드 이동, 엑셀 다운로드 등 상세 관리를 할 수 있도록 구성합니다.
 *
 * 참고:
 * - 파트너 센터의 `/partner/campaign_application/delivery/[id]` 페이지 구조를 그대로 차용했습니다.
 * - 관리자 페이지에 맞게 주석과 용어를 재정비했습니다.
 *
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/manager/common/campaign/progress/CampaignApplicationLayout";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";

// 배송형 캠페인 전용 카드 컴포넌트들
import NaverBlogCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard";
import NaverClipCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipCard";
import NaverClipSelectedCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard";
import InstagramCard from "@/components/partner/campaign_application/card_type/instagram/InstagramCard";
import InstagramSelectedCard from "@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard";
import YoutubeCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeCard";
import YoutubeSelectedCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard";

// 개별 신청자 타입들 import (카드 컴포넌트에서 사용)
import {
  type Applicant,
  type NaverClipApplicant,
  type InstagramApplicant,
  type YoutubeApplicant,
} from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 배송형 캠페인 상세 컴포넌트
 */
export default function ManagerDeliveryProgressDetailPage() {
  // 📌 커스텀 훅 사용:
  // - 모든 공통 로직(상태 관리, 데이터 로딩, 핸들러 등)을 훅에서 가져옵니다
  // - 구조분해할당으로 필요한 값만 추출하여 사용합니다
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
   * 배송형 캠페인에 특화된 카드 컴포넌트 렌더링 함수
   *
   * 📌 채널별 카드 렌더링:
   * - 개별 신청자의 channel 기준으로 카드 컴포넌트 선택
   * - 각 채널별로 다른 카드 컴포넌트 사용 (네이버블로그, 네이버클립, 인스타그램, 유튜브)
   * - 선정 여부에 따라 다른 카드 컴포넌트 사용 (일반 카드 vs 선정 카드)
   * - 📌 관리자 모드: 선정하기/선택 취소 버튼 비활성화 (빈 함수 전달)
   *
   * @param applicant - 신청자 데이터
   * @param isSelected - 선정 탭 여부
   * @returns JSX 요소
   */
  const renderCardComponent = (
    applicant: AllApplicant,
    isSelected: boolean = false
  ): React.ReactNode => {
    // 관리자 모드: 버튼 비활성화를 위한 빈 함수
    const empty_handler = () => {};

    // 개별 신청자의 channel 기준으로 카드 컴포넌트 선택
    switch (applicant.channel) {
      case "네이버블로그":
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={empty_handler}
            onCancel={empty_handler}
          />
        );

      case "네이버클립":
        if (isSelected) {
          return (
            <NaverClipSelectedCard
              applicant={applicant as NaverClipApplicant}
              onCancel={empty_handler}
            />
          );
        } else {
          return (
            <NaverClipCard
              applicant={applicant as NaverClipApplicant}
              onSelect={empty_handler}
            />
          );
        }

      case "인스타그램":
        if (isSelected) {
          return (
            <InstagramSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={empty_handler}
            />
          );
        } else {
          return (
            <InstagramCard
              applicant={applicant as InstagramApplicant}
              onSelect={empty_handler}
            />
          );
        }

      case "유튜브":
        if (isSelected) {
          return (
            <YoutubeSelectedCard
              applicant={applicant as YoutubeApplicant}
              onCancel={empty_handler}
            />
          );
        } else {
          return (
            <YoutubeCard
              applicant={applicant as YoutubeApplicant}
              onSelect={empty_handler}
            />
          );
        }

      default:
        // 기본값: 네이버블로그 카드 사용
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={empty_handler}
            onCancel={empty_handler}
          />
        );
    }
  };

  // 📌 공통 레이아웃 컴포넌트 사용:
  // - 모든 공통 UI와 로직을 CampaignApplicationLayout에 위임합니다
  // - 이 페이지는 배송형 캠페인에 특화된 renderCard 함수만 전달합니다
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
