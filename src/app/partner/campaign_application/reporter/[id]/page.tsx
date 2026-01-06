/* ========================================
   📰 기자단 캠페인 신청내역 페이지 (동적)
   ======================================== */

/**
 * 기자단 캠페인 신청내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 기자단 캠페인에 신청한 사용자들의 목록을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/reporter/[id] (동적 라우팅)
 * - 예: /partner/campaign_application/reporter/reporter_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 신청자/선정자 탭 네비게이션
 * - 신청자 목록 그리드 표시 (프로필, 통계, 메모 등)
 * - 선정하기/이용제한 버튼 기능
 * - 필터링 및 정렬 기능
 *
 * 📌 리팩토링:
 * - 공통 로직은 useCampaignApplication 훅으로 추출
 * - 공통 UI는 CampaignApplicationLayout 컴포넌트로 추출
 * - 이 페이지는 기자단 캠페인에 특화된 카드 렌더링 로직만 포함
 */

"use client";

import React from "react";
// 공통 훅과 컴포넌트 import
import { useCampaignApplication } from "@/hooks/partner/campaign_application/useCampaignApplication";
import CampaignApplicationLayout from "@/components/partner/campaign_application/CampaignApplicationLayout";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";

// 기자단 카드 컴포넌트들 import (채널별)
import NaverBlogCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard";
import NaverClipCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipCard";
import NaverClipSelectedCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard";
import InstagramCard from "@/components/partner/campaign_application/card_type/instagram/InstagramCard";
import InstagramSelectedCard from "@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard";
import YoutubeCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeCard";
import YoutubeSelectedCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard";
import ReelsCard from "@/components/partner/campaign_application/card_type/reels/ReelsCard";
import ReelsSelectedCard from "@/components/partner/campaign_application/card_type/reels/ReelsSelectedCard";
import ShortsCard from "@/components/partner/campaign_application/card_type/shorts/ShortsCard";
import ShortsSelectedCard from "@/components/partner/campaign_application/card_type/shorts/ShortsSelectedCard";

// 개별 신청자 타입들 import (카드 컴포넌트에서 사용)
import {
  type Applicant,
  type NaverClipApplicant,
  type InstagramApplicant,
  type YoutubeApplicant,
} from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 기자단 캠페인 신청내역 페이지 컴포넌트 (동적)
 *
 * 📌 Next.js 동적 라우팅:
 * 1. [id] 폴더명으로 동적 라우팅 설정
 * 2. useParams() 훅으로 URL 파라미터 접근 (useCampaignApplication 내부에서 처리)
 * 3. URL: /partner/campaign_application/reporter/reporter_001
 * 4. params.id = "reporter_001"
 *
 * 📌 기자단 캠페인 특징:
 * - channel/brandName에 따라 적절한 카드 컴포넌트 선택
 * - 인스타그램 + 브랜드=릴스 → ReelsCard/Selected
 * - 유튜브 + 브랜드=숏츠 → ShortsCard/Selected
 * - 그 외는 채널 기본 카드 사용
 */
export default function ReporterCampaignApplicationPage() {
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
   * channel/brandName에 따라 적절한 카드 컴포넌트를 렌더링하는 함수
   * - 인스타그램 + 브랜드=릴스 → ReelsCard/Selected
   * - 유튜브 + 브랜드=숏츠 → ShortsCard/Selected
   * - 그 외는 채널 기본 카드 사용
   *
   * @param applicant - 신청자 데이터
   * @param isSelected - 선정 탭 여부
   * @returns JSX 요소
   */
  const renderCardComponent = (
    applicant: AllApplicant,
    isSelected: boolean = false
  ): React.ReactNode => {
    switch (applicant.channel) {
      case "네이버블로그":
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );

      case "네이버클립":
        return isSelected ? (
          <NaverClipSelectedCard
            applicant={applicant as NaverClipApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <NaverClipCard
            applicant={applicant as NaverClipApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "인스타그램":
        // 브랜드가 릴스인 경우 전용 카드 사용
        if (campaignData?.campaignInfo.brandName === "릴스") {
          return isSelected ? (
            <ReelsSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ReelsCard
              applicant={applicant as InstagramApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <InstagramSelectedCard
            applicant={applicant as InstagramApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <InstagramCard
            applicant={applicant as InstagramApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "유튜브":
        // 브랜드가 숏츠인 경우 전용 카드 사용
        if (campaignData?.campaignInfo.brandName === "숏츠") {
          return isSelected ? (
            <ShortsSelectedCard
              applicant={applicant as YoutubeApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ShortsCard
              applicant={applicant as YoutubeApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <YoutubeSelectedCard
            applicant={applicant as YoutubeApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <YoutubeCard
            applicant={applicant as YoutubeApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      default:
        // 기본값: 네이버블로그 카드 사용
        // 📌 타입 캐스팅:
        // - unknown을 거쳐서 캐스팅하여 타입 안정성을 확보합니다
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );
    }
  };

  // 📌 공통 레이아웃 컴포넌트 사용:
  // - 모든 공통 UI와 로직을 CampaignApplicationLayout에 위임합니다
  // - 이 페이지는 기자단 캠페인에 특화된 renderCard 함수만 전달합니다
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
