/* ========================================
   📦 배송형 캠페인 신청내역 페이지
   ======================================== */

/**
 * 배송형 캠페인 신청내역 페이지
 *
 * 목적: 파트너가 생성한 배송형 캠페인에 신청한 사용자들의 목록을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/delivery
 *
 * 주요 기능:
 * - 배송형 캠페인 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 신청자/선정자 탭 네비게이션
 * - 신청자 목록 그리드 표시 (프로필, 통계, 메모 등)
 * - 선정하기/이용제한 버튼 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 */

"use client";

import { useState, useEffect } from "react";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "@/styles/partner/layout.module.css";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import ContentExcelDownloadBtn from "@/components/partner/campaign_application/ContentExcelDownloadBtn";
import SortDropdown from "@/components/partner/campaign_application/SortDropdown";
import NaverBlogReviewCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogReviewCard";
import NaverBlogCompletedCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCompletedCard";

// 📦 목업 데이터 import
// 별도 파일로 분리된 데이터를 가져옴
import {
  mockCampaignInfo,
  mockApplicants,
  mockSelectedApplicants,
  type Applicant,
} from "@/data/partner/campaign_application/delivery_applicants";
import {
  mockReviewApplicants,
  mockCompletedApplicants,
  type ReviewApplicant,
  type CompletedApplicant,
} from "@/data/partner/campaign_application/delivery_review_completed";

/**
 * 배송형 캠페인 신청내역 페이지 컴포넌트
 */
export default function DeliveryCampaignApplicationPage() {
  // 탭 상태 관리 (검수/완료만 사용)
  const [activeTab, setActiveTab] = useState<"review" | "completed">("review");

  // 정렬 상태 관리 (최신순, 인기순, 마감임박순, 포인트순)
  type SortOption = "latest" | "popular" | "deadline" | "point";
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  /**
   * 탭별 데이터 개수 계산
   * - 신청 탭: 전체 신청자 수
   * - 선정 탭: 선정된 신청자 수
   * - 검수 탭: 검수 중인 신청자 수
   * - 완료 탭: 완료된 신청자 수
   */
  const applicantsCount = mockApplicants.length;
  const selectedCount = mockSelectedApplicants.length;
  const reviewCount = mockReviewApplicants.length;
  const completedCount = mockCompletedApplicants.length;

  /**
   * 현재 활성화된 탭에 따라 표시할 데이터 결정
   *
   * 📌 콘텐츠 내역 페이지 데이터 선택:
   * - 검수 탭: 검수 중인 콘텐츠 목록 표시
   * - 완료 탭: 완료된 콘텐츠 목록 표시
   */
  const getCurrentApplicants = (): ReviewApplicant[] | CompletedApplicant[] => {
    switch (activeTab) {
      case "review":
        return mockReviewApplicants;
      case "completed":
        return mockCompletedApplicants;
      default:
        return mockReviewApplicants;
    }
  };

  const currentApplicants = getCurrentApplicants();

  // 기본 헤더 숨기기 (PartnerHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 콘텐츠 확인하기 버튼 클릭 핸들러
  const handleContentCheck = (applicantId: string) => {
    console.log("콘텐츠 확인:", applicantId);
    // 실제로는 콘텐츠 상세 페이지로 이동
  };

  // 승인 버튼 클릭 핸들러
  const handleApprove = (applicantId: string) => {
    console.log("승인:", applicantId);
    // 실제로는 API 호출로 승인 처리
  };

  // 반려 버튼 클릭 핸들러
  const handleReject = (applicantId: string) => {
    console.log("반려:", applicantId);
    // 실제로는 API 호출로 반려 처리
  };

  // 완료 확인 버튼 클릭 핸들러
  const handleConfirmCompletion = (applicantId: string) => {
    console.log("완료 확인:", applicantId);
    // 실제로는 API 호출로 완료 확인 처리
  };

  // 콘텐츠 내역 엑셀 다운로드 핸들러
  const handleDownloadReview = () => {
    console.log("검수 중인 콘텐츠 다운로드");
    // 실제로는 API 호출로 엑셀 파일 다운로드
  };

  const handleDownloadCompleted = () => {
    console.log("완료된 콘텐츠 다운로드");
    // 실제로는 API 호출로 엑셀 파일 다운로드
  };

  const handleDownloadReport = () => {
    console.log("결과 보고서 다운로드");
    // 실제로는 API 호출로 엑셀 파일 다운로드
  };

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 헤더 */}
      <PartnerHeader />
      {/* 페이지 제목 */}
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>캠페인 콘텐츠 내역</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <section className={styles.campaign_application_section}>
        {/* 캠페인 정보 박스 */}
        {/* 배송형 전용 */}
        <Campaignbanner campaignInfo={mockCampaignInfo} />

        <article className={styles.download_section}>
          {/* 콘텐츠 내역 다운로드 버튼 */}
          <ContentExcelDownloadBtn
            onDownloadReview={handleDownloadReview}
            onDownloadCompleted={handleDownloadCompleted}
            onDownloadReport={handleDownloadReport}
          />

          {/* 정렬 필터 */}
          <SortDropdown sortOrder={sortOrder} onSortChange={setSortOrder} />
        </article>

        {/* 콘텐츠 내역 탭 네비게이션 - 검수/완료만 표시 */}
        <article className={styles.tab_navigation}>
          <button
            className={`${styles.tab_button} ${
              activeTab === "review" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("review")}
          >
            검수 <span className={styles.tab_count}>{reviewCount}</span>
          </button>
          <button
            className={`${styles.tab_button} ${
              activeTab === "completed" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            완료 <span className={styles.tab_count}>{completedCount}</span>
          </button>
        </article>

        {/* 배송형 콘텐츠 목록 그리드 */}
        {/* 
          📌 콘텐츠 내역 페이지 컴포넌트:
          - 검수 탭: DeliveryReviewCard (콘텐츠 확인, 승인/반려 버튼)
          - 완료 탭: DeliveryCompletedCard (완료 확인 버튼)
          
          📌 조건부 렌더링:
          - activeTab에 따라 다른 컴포넌트와 핸들러 사용
        */}
        <article className={styles.applicants_grid}>
          {currentApplicants.map((applicant) => {
            // brandName에 따라 직접 컴포넌트 선택
            switch (mockCampaignInfo.brandName) {
              case "네이버블로그":
                // 검수 탭: 콘텐츠 확인하기, 승인/반려 버튼이 있는 카드
                if (activeTab === "review") {
                  return (
                    <NaverBlogReviewCard
                      key={applicant.id}
                      applicant={applicant as ReviewApplicant}
                      onContentCheck={handleContentCheck}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  );
                }

                // 완료 탭: 완료 확인 버튼이 있는 카드
                if (activeTab === "completed") {
                  return (
                    <NaverBlogCompletedCard
                      key={applicant.id}
                      applicant={applicant as CompletedApplicant}
                      onConfirm={handleConfirmCompletion}
                    />
                  );
                }

                // 기본값: 검수 탭과 동일
                return (
                  <NaverBlogReviewCard
                    key={applicant.id}
                    applicant={applicant as ReviewApplicant}
                    onContentCheck={handleContentCheck}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                );

              // TODO: 다른 브랜드별 카드 컴포넌트 추가
              // case "네이버클립":
              //   return <NaverClipReviewCard ... />;
              // case "인스타그램":
              //   return <InstaReviewCard ... />;
              // case "유튜브":
              //   return <YoutubeReviewCard ... />;
              // case "기본":
              //   return <CommonReviewCard ... />;

              default:
                // 기본값: 네이버블로그 카드 사용
                if (activeTab === "review") {
                  return (
                    <NaverBlogReviewCard
                      key={applicant.id}
                      applicant={applicant as ReviewApplicant}
                      onContentCheck={handleContentCheck}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  );
                }

                if (activeTab === "completed") {
                  return (
                    <NaverBlogCompletedCard
                      key={applicant.id}
                      applicant={applicant as CompletedApplicant}
                      onConfirm={handleConfirmCompletion}
                    />
                  );
                }

                return (
                  <NaverBlogReviewCard
                    key={applicant.id}
                    applicant={applicant as ReviewApplicant}
                    onContentCheck={handleContentCheck}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                );
            }
          })}
        </article>
      </section>
    </div>
  );
}
