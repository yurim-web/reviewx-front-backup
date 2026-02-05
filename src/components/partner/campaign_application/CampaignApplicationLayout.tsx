/* ========================================
   🎨 캠페인 신청내역 페이지 공통 레이아웃 컴포넌트
   ======================================== */

/**
 * 캠페인 신청내역 페이지의 공통 UI 레이아웃 컴포넌트
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
 *
 * 📌 Props 패턴:
 * - 컴포넌트에 데이터와 함수를 props로 전달하여 재사용성을 높입니다
 * - renderCard 함수를 props로 받아 각 캠페인 유형별로 다른 카드를 렌더링합니다
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/loading";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "@/styles/partner/layout.module.css";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import PageHeader from "@/components/partner/campaign_application/PageHeader";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import EmptyApplicantsList from "@/components/partner/campaign_application/EmptyApplicantsList";
import BaseModal from "@/components/common/modal/BaseModal";
import { isAnnouncementDatePassed } from "@/components/partner/campaign_application/utils/campaign_info_helpers";
import { getCampaignDetailPath } from "@/utils/helpers/url";
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
 *
 * 📌 함수 타입:
 * - (applicant: AllApplicant, isSelected: boolean) => React.ReactNode
 * - 신청자 데이터와 선정 여부를 받아서 React 컴포넌트를 반환하는 함수
 */
type CardRenderer = (
  applicant: AllApplicant,
  isSelected: boolean
) => React.ReactNode;

/**
 * CampaignApplicationLayout 컴포넌트의 Props 타입 정의
 *
 * 📌 TypeScript 인터페이스:
 * - 컴포넌트가 받을 props의 타입을 명시적으로 정의합니다
 * - 타입 안정성을 확보하고 IDE 자동완성을 지원합니다
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
 * 캠페인 신청내역 페이지 공통 레이아웃 컴포넌트
 *
 * @param props - CampaignApplicationLayoutProps 타입의 props
 * @returns JSX 요소
 *
 * 📌 사용 예시:
 * ```tsx
 * <CampaignApplicationLayout
 *   campaignData={campaignData}
 *   isLoading={isLoading}
 *   activeTab={activeTab}
 *   currentApplicants={currentApplicants}
 *   renderCard={renderCardComponent}
 *   // ... 기타 props
 * />
 * ```
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
  /**
   * useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
   * - router.push(): 프로그래밍 방식으로 페이지를 이동시킵니다
   */
  const router = useRouter();
  // 로딩 중일 때 표시할 UI
  // 📌 조건부 렌더링:
  // - isLoading이 true이면 Loading 컴포넌트를 반환하여 로딩 화면을 표시합니다
  if (isLoading) {
    return <Loading />;
  }

  // 에러가 있을 때 표시할 UI
  // 📌 조건부 렌더링:
  // - error가 있거나 campaignData가 없으면 에러 메시지를 표시합니다
  if (error || !campaignData) {
    return (
      <div className={layoutStyles.container}>
        <PartnerSubHeader />
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>캠페인 신청 내역</h1>
        </div>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </div>
    );
  }

  // 캠페인 상세 페이지 경로 생성
  // 📌 getCampaignDetailPath: 캠페인 타입과 ID를 사용하여 상세 페이지 경로를 생성합니다
  const campaignDetailPath = campaignData
    ? getCampaignDetailPath(
        campaignData.campaignInfo.campaignType,
        campaignData.campaignInfo.id
      )
    : "";

  return (
    <div className={styles.campaign_application_wrapper}>
      {/* 페이지 제목 - 공용 컴포넌트 */}
      {/* 📌 컴포넌트 재사용:
          - PageHeader 컴포넌트를 사용하여 일관된 페이지 제목 스타일을 유지합니다
          - right prop으로 "캠페인 보기" 버튼을 전달합니다
      */}
      <PageHeader
        title="캠페인 신청 내역"
        right={
          campaignData ? (
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
          ) : null
        }
      />

      {/* 메인 콘텐츠 */}
      {/* 📌 시맨틱 HTML:
          - section: 관련된 콘텐츠를 그룹화하는 HTML5 시맨틱 태그
          - article: 독립적인 콘텐츠를 나타내는 HTML5 시맨틱 태그
      */}
      <section className={styles.campaign_application_section}>
        {/* 캠페인 정보 박스 */}
        {/* 📌 Props 전달:
            - campaignInfo를 Campaignbanner 컴포넌트에 전달합니다
            - campaignData가 null이 아님을 위에서 확인했으므로 안전하게 사용 가능
        */}
        <Campaignbanner
          campaignInfo={campaignData.campaignInfo}
          applicantsCount={applicantsCount}
        />

        {/* 📌 선정 날짜 확인:
            - 아직 선정하지 않은 경우(selectedCount === 0): 선정 날짜 체크를 무시하고 신청 내역 표시
            - 이미 선정한 경우(selectedCount > 0): 선정 날짜가 지났는지 확인하여 조건부 렌더링
            - 선정 날짜가 지나면 신청 내역 열람 불가 메시지 표시
        */}
        {selectedCount === 0 ? (
          /* 아직 선정하지 않은 경우 - 항상 신청 내역 표시 */
          <>
            {/* 정렬 섹션 */}
            <article className={styles.download_section_right}>
              {/* 정렬 트리거 + 모달 통합 */}
              {/* 📌 제어 컴포넌트 패턴:
                  - value와 onChange를 모두 props로 받아서 부모 컴포넌트가 상태를 제어합니다
                  - 이렇게 하면 상태 관리가 부모 컴포넌트에 집중되어 예측 가능한 동작을 보장합니다
              */}
              <SortFilterControl
                options={sortOptions}
                value={sortOrder}
                onChange={(opt) => setSortOrder(opt.value as SortOption)}
                defaultSort="latest"
              />
            </article>

            {/* 신청내역 탭 네비게이션 - 신청/선정만 표시 */}
            {/* 📌 동적 클래스명:
                - 템플릿 리터럴과 삼항 연산자를 사용하여 조건부로 클래스를 적용합니다
                - activeTab === "applicants"일 때 styles.active 클래스가 추가됩니다
            */}
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
            {/* 📌 조건부 렌더링과 리스트 렌더링:
                - currentApplicants.length === 0이면 EmptyApplicantsList를 표시
                - 그렇지 않으면 map()을 사용하여 각 신청자에 대해 카드를 렌더링
            */}
            <article className={styles.applicants_grid}>
              {currentApplicants.length === 0 ? (
                <EmptyApplicantsList />
              ) : (
                currentApplicants.map((applicant, index) => {
                  // 동적 카드 컴포넌트 렌더링
                  // 📌 key prop:
                  // - React에서 리스트를 렌더링할 때 각 요소에 고유한 key를 제공해야 합니다
                  // - key를 고유하게 만들기 위해 탭과 인덱스를 조합합니다
                  // - renderCard 함수를 호출하여 각 캠페인 유형에 맞는 카드를 렌더링합니다
                  return (
                    <div key={`${activeTab}-${applicant.id}-${index}`}>
                      {renderCard(applicant, activeTab === "selected")}
                    </div>
                  );
                })
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
              {/* 정렬 트리거 + 모달 통합 */}
              {/* 📌 제어 컴포넌트 패턴:
                  - value와 onChange를 모두 props로 받아서 부모 컴포넌트가 상태를 제어합니다
                  - 이렇게 하면 상태 관리가 부모 컴포넌트에 집중되어 예측 가능한 동작을 보장합니다
              */}
              <SortFilterControl
                options={sortOptions}
                value={sortOrder}
                onChange={(opt) => setSortOrder(opt.value as SortOption)}
                defaultSort="latest"
              />
            </article>

            {/* 신청내역 탭 네비게이션 - 신청/선정만 표시 */}
            {/* 📌 동적 클래스명:
                - 템플릿 리터럴과 삼항 연산자를 사용하여 조건부로 클래스를 적용합니다
                - activeTab === "applicants"일 때 styles.active 클래스가 추가됩니다
            */}
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
            {/* 📌 조건부 렌더링과 리스트 렌더링:
                - currentApplicants.length === 0이면 EmptyApplicantsList를 표시
                - 그렇지 않으면 map()을 사용하여 각 신청자에 대해 카드를 렌더링
            */}
            <article className={styles.applicants_grid}>
              {currentApplicants.length === 0 ? (
                <EmptyApplicantsList />
              ) : (
                currentApplicants.map((applicant, index) => {
                  // 동적 카드 컴포넌트 렌더링
                  // 📌 key prop:
                  // - React에서 리스트를 렌더링할 때 각 요소에 고유한 key를 제공해야 합니다
                  // - key를 고유하게 만들기 위해 탭과 인덱스를 조합합니다
                  // - renderCard 함수를 호출하여 각 캠페인 유형에 맞는 카드를 렌더링합니다
                  return (
                    <div key={`${activeTab}-${applicant.id}-${index}`}>
                      {renderCard(applicant, activeTab === "selected")}
                    </div>
                  );
                })
              )}
            </article>
          </>
        )}
      </section>

      {/* 모집 인원 초과 모달 */}
      {/* 📌 조건부 렌더링:
          - BaseModal 컴포넌트는 is_open prop이 true일 때만 렌더링됩니다
          - 모달이 닫혀있으면 (is_modal_open === false) null을 반환하여 아무것도 렌더링하지 않습니다
      */}
      <BaseModal
        is_open={is_modal_open}
        on_close={handle_close_modal}
        message="모집 인원을 초과할 수 없습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 이미 선택된 리뷰어 모달 */}
      {/* 📌 조건부 렌더링:
          - 이미 선택된 리뷰어를 다시 선택하려 할 때 표시되는 모달
      */}
      <BaseModal
        is_open={is_already_selected_modal_open}
        on_close={handle_close_already_selected_modal}
        message="이미 선택된 리뷰어입니다."
        buttons={["확인"]}
        type="center"
      />
    </div>
  );
}
