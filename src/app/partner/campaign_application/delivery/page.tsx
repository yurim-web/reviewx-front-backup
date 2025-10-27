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
import styles from "../../../../styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "../../../../styles/partner/layout.module.css";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import SortDropdown from "@/components/partner/campaign_application/SortDropdown";
import ApplicantCard from "@/components/partner/campaign_application/ApplicantCard";

// 📦 목업 데이터 import
// 별도 파일로 분리된 데이터를 가져옴
import {
  mockCampaignInfo,
  mockApplicants,
  mockSelectedApplicants,
  type Applicant,
} from "@/data/partner/campaign_application/delivery";

/**
 * 배송형 캠페인 신청내역 페이지 컴포넌트
 */
export default function DeliveryCampaignApplicationPage() {
  // 탭 상태 관리 (신청/선정)
  const [activeTab, setActiveTab] = useState<"applicants" | "selected">(
    "applicants"
  );

  // 정렬 상태 관리 (최신순, 인기순, 마감임박순, 포인트순)
  type SortOption = "latest" | "popular" | "deadline" | "point";
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  /**
   * 탭별 데이터 개수 계산
   * - 신청 탭: 전체 신청자 수
   * - 선정 탭: 선정된 신청자 수
   */
  const applicantsCount = mockApplicants.length;
  const selectedCount = mockSelectedApplicants.length;

  /**
   * 현재 활성화된 탭에 따라 표시할 데이터 결정
   *
   * 📌 삼항 연산자 사용:
   * - activeTab이 "applicants"면 mockApplicants 사용
   * - 그렇지 않으면 mockSelectedApplicants 사용
   *
   * 📌 동적 데이터 렌더링:
   * - 신청 탭: 모든 신청자 목록 표시
   * - 선정 탭: 선정된 신청자만 표시
   */
  const currentApplicants =
    activeTab === "applicants" ? mockApplicants : mockSelectedApplicants;

  // 기본 헤더 숨기기 (PartnerHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 선정하기 버튼 클릭 핸들러
  const handleSelectApplicant = (applicantId: string) => {
    console.log("선정하기:", applicantId);
    // 실제로는 API 호출로 선정 처리
  };

  // 엑셀 다운로드 핸들러
  const handleDownloadApplicants = () => {
    console.log("신청자 목록 다운로드");
    // 실제로는 API 호출로 엑셀 파일 다운로드
  };

  const handleDownloadSelected = () => {
    console.log("선정자 목록 다운로드");
    // 실제로는 API 호출로 엑셀 파일 다운로드
  };

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 헤더 */}
      <PartnerHeader />
      {/* 페이지 제목 */}
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>캠페인 신청 내역</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <section className={styles.campaign_application_section}>
        {/* 캠페인 정보 박스 */}
        <Campaignbanner campaignInfo={mockCampaignInfo} />

        <article className={styles.download_section}>
          {/* 다운로드 버튼 */}
          <ExcelDownloadBtn
            onDownloadApplicants={handleDownloadApplicants}
            onDownloadSelected={handleDownloadSelected}
          />

          {/* 정렬 필터 */}
          <SortDropdown sortOrder={sortOrder} onSortChange={setSortOrder} />
        </article>

        {/* 탭 네비게이션 */}
        <article className={styles.tab_navigation}>
          <button
            className={`${styles.tab_button} ${
              activeTab === "applicants" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("applicants")}
          >
            신청 <span className={styles.tab_count}>{applicantsCount}</span>
          </button>
          <button
            className={`${styles.tab_button} ${
              activeTab === "selected" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("selected")}
          >
            선정 <span className={styles.tab_count}>{selectedCount}</span>
          </button>
        </article>

        {/* 신청자 목록 그리드 */}
        {/* 
          📌 currentApplicants 사용:
          - activeTab 상태에 따라 동적으로 변경되는 데이터
          - 신청 탭: mockApplicants 표시
          - 선정 탭: mockSelectedApplicants 표시
          
          📌 map 함수:
          - 배열의 각 요소를 컴포넌트로 변환
          - key prop: React가 효율적으로 렌더링하기 위해 필수
          
          📌 ApplicantCard 컴포넌트 사용:
          - 별도 파일로 분리된 재사용 가능한 컴포넌트
          - applicant: 신청자 정보 데이터
          - onSelect: 선정하기 버튼 클릭 핸들러
        */}
        <article className={styles.applicants_grid}>
          {currentApplicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onSelect={handleSelectApplicant}
            />
          ))}
        </article>
      </section>
    </div>
  );
}
