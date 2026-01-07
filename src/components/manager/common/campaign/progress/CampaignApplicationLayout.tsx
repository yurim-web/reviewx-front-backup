/* ========================================
   🎨 관리자 캠페인 신청내역 페이지 공통 레이아웃 컴포넌트
   ======================================== */

/**
 * 관리자 캠페인 신청내역 페이지의 공통 UI 레이아웃 컴포넌트
 *
 * 📌 컴포넌트 재사용성:
 * - 여러 페이지에서 동일한 UI 구조를 사용할 때 중복을 제거합니다
 * - 레이아웃 변경 시 한 곳만 수정하면 모든 페이지에 반영됩니다
 *
 * 주요 기능:
 * - 캠페인 정보 박스 표시
 * - 정렬 컨트롤
 * - 탭 네비게이션
 * - 신청자 목록 그리드
 * - 모달 표시
 * - 캠페인 보기 버튼 (관리자 전용)
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/loading";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import detailStyles from "@/styles/manager_ga/campaign_detail.module.css";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import EmptyApplicantsList from "@/components/partner/campaign_application/EmptyApplicantsList";
import BaseModal from "@/components/common/modal/BaseModal";
import { isAnnouncementDatePassed } from "@/components/partner/campaign_application/utils/campaign_info_helpers";
import { getCampaignDetailPath } from "@/utils/getCampaignDetailPath";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "@/data/partner/sharedCampaigns";
import type {
  SortOption,
  TabType,
} from "@/hooks/partner/campaign_application/useCampaignApplication";

/**
 * 카드 렌더링 함수 타입 정의
 */
type CardRenderer = (
  applicant: AllApplicant,
  isSelected: boolean
) => React.ReactNode;

/**
 * CampaignApplicationLayout 컴포넌트의 Props 타입 정의
 */
interface CampaignApplicationLayoutProps {
  // 캠페인 데이터 관련
  campaignData: CampaignWithApplicants | null;
  isLoading: boolean;
  error: string | null;

  // 탭 관련
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  applicantsCount: number;
  selectedCount: number;

  // 정렬 관련
  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;

  // 신청자 데이터
  currentApplicants: AllApplicant[];

  // 모달 관련
  is_modal_open: boolean;
  handle_close_modal: () => void;
  is_already_selected_modal_open: boolean;
  handle_close_already_selected_modal: () => void;

  // 핸들러 함수들
  handleSelectApplicant: (applicantId: string) => void;
  handleCancelApplicant: (applicantId: string) => void;

  // 카드 렌더링 함수
  renderCard: CardRenderer;
}

/**
 * 관리자 캠페인 신청내역 페이지 공통 레이아웃 컴포넌트
 */
export default function CampaignApplicationLayout({
  campaignData,
  isLoading,
  error,
  activeTab,
  setActiveTab,
  applicantsCount,
  selectedCount,
  sortOrder,
  setSortOrder,
  sortOptions,
  currentApplicants,
  is_modal_open,
  handle_close_modal,
  is_already_selected_modal_open,
  handle_close_already_selected_modal,
  renderCard,
}: CampaignApplicationLayoutProps) {
  const router = useRouter();

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return <Loading />;
  }

  // 에러가 있을 때 표시할 UI
  if (error || !campaignData) {
    return (
      <div className={detailStyles.detail_page_wrapper}>
        <div className={detailStyles.content_container}>
          <div className={detailStyles.content_inner}>
            <div className={styles.page_header}>
              <h1 className={styles.page_title}>캠페인 신청 내역</h1>
            </div>
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "red" }}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 캠페인 상세 페이지 경로 생성
  const campaignDetailPath = getCampaignDetailPath(
    campaignData.campaignInfo.campaignType,
    campaignData.campaignInfo.id
  );

  return (
    <div className={detailStyles.detail_page_wrapper}>
      <div className={detailStyles.content_container}>
        <div className={detailStyles.content_inner}>
          {/* 페이지 헤더 영역 */}
          <div className={styles.page_header}>
            <h1 className={styles.page_title}>캠페인 신청 내역</h1>

            {/* 캠페인 보기 버튼 */}
            <button
              className={styles.view_campaign_button}
              onClick={() => {
                router.push(campaignDetailPath);
              }}
              aria-label="캠페인 보기"
            >
              <span>캠페인 보기</span>
              <span className={styles.view_campaign_button_icon}>
                <Image
                  src="/images/icons/chevron_right.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
            </button>
          </div>

          {/* 메인 콘텐츠 */}
          <section className={styles.campaign_application_section}>
            {/* 캠페인 정보 박스 */}
            <Campaignbanner campaignInfo={campaignData.campaignInfo} />

            {/* 선정 날짜 확인 */}
            {selectedCount === 0 ? (
              /* 아직 선정하지 않은 경우 - 항상 신청 내역 표시 */
              <>
                {/* 정렬 섹션 */}
                <article className={styles.download_section_right}>
                  <SortFilterControl
                    options={sortOptions}
                    value={sortOrder}
                    onChange={(opt) => setSortOrder(opt.value as SortOption)}
                    defaultSort="latest"
                  />
                </article>

                {/* 신청내역 탭 네비게이션 */}
                <article className={styles.tab_navigation}>
                  <button
                    className={`${styles.tab_button} ${
                      activeTab === "applicants" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("applicants")}
                  >
                    신청{" "}
                    <span className={styles.tab_count}>{applicantsCount}</span>
                  </button>
                  <button
                    className={`${styles.tab_button} ${
                      activeTab === "selected" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("selected")}
                  >
                    선정{" "}
                    <span className={styles.tab_count}>{selectedCount}</span>
                  </button>
                </article>

                {/* 신청자 목록 그리드 */}
                <article className={styles.applicants_grid}>
                  {currentApplicants.length === 0 ? (
                    <EmptyApplicantsList />
                  ) : (
                    currentApplicants.map((applicant, index) => (
                      <div key={`${activeTab}-${applicant.id}-${index}`}>
                        {renderCard(applicant, activeTab === "selected")}
                      </div>
                    ))
                  )}
                </article>
              </>
            ) : isAnnouncementDatePassed(
                campaignData.campaignInfo.announcementDate
              ) ? (
              /* 선정 날짜가 지난 경우 - 신청 내역 열람 불가 */
              <article className={styles.access_denied_message}>
                <p>신청 내역 열람 불가</p>
                <p className={styles.access_denied_subtext}>
                  선정 날짜가 지나 신청 내역을 열람할 수 없습니다.
                </p>
              </article>
            ) : (
              <>
                {/* 정렬 섹션 */}
                <article className={styles.download_section_right}>
                  <SortFilterControl
                    options={sortOptions}
                    value={sortOrder}
                    onChange={(opt) => setSortOrder(opt.value as SortOption)}
                    defaultSort="latest"
                  />
                </article>

                {/* 신청내역 탭 네비게이션 */}
                <article className={styles.tab_navigation}>
                  <button
                    className={`${styles.tab_button} ${
                      activeTab === "applicants" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("applicants")}
                  >
                    신청{" "}
                    <span className={styles.tab_count}>{applicantsCount}</span>
                  </button>
                  <button
                    className={`${styles.tab_button} ${
                      activeTab === "selected" ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab("selected")}
                  >
                    선정{" "}
                    <span className={styles.tab_count}>{selectedCount}</span>
                  </button>
                </article>

                {/* 신청자 목록 그리드 */}
                <article className={styles.applicants_grid}>
                  {currentApplicants.length === 0 ? (
                    <EmptyApplicantsList />
                  ) : (
                    currentApplicants.map((applicant, index) => (
                      <div key={`${activeTab}-${applicant.id}-${index}`}>
                        {renderCard(applicant, activeTab === "selected")}
                      </div>
                    ))
                  )}
                </article>
              </>
            )}
          </section>

          {/* 모집 인원 초과 모달 */}
          <BaseModal
            is_open={is_modal_open}
            on_close={handle_close_modal}
            message="모집 인원을 초과할 수 없습니다."
            buttons={["닫기"]}
            type="center"
          />

          {/* 이미 선택된 리뷰어 모달 */}
          <BaseModal
            is_open={is_already_selected_modal_open}
            on_close={handle_close_already_selected_modal}
            message="이미 선택된 리뷰어입니다."
            buttons={["확인"]}
            type="center"
          />
        </div>
      </div>
    </div>
  );
}
