/* ========================================
   📐 캠페인 진행현황 상세 페이지 공통 레이아웃
   ======================================== */

/**
 * 캠페인 진행현황 상세 페이지 공통 레이아웃 컴포넌트
 *
 * 목적: 배송형, 미션형, 기자단, 구매평, 방문형 캠페인 상세 페이지에서
 *       공통으로 사용하는 JSX 구조를 재사용 가능한 컴포넌트로 추출합니다.
 *
 * 📍 사용 위치:
 * - src/app/manager_ga/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/visit/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/visit/[id]/page.tsx
 *
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import EmptyApplicantsList from "@/components/partner/campaign_application/EmptyApplicantsList";
import {
  getCampaignDetailPath,
  type CampaignType,
} from "@/utils/getCampaignDetailPath";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "@/data/partner/sharedCampaigns";
import type {
  SortOption,
  TabType,
} from "@/hooks/manager/common/campaign/useCampaignProgressDetail";

/**
 * 카드 렌더링 함수 타입 정의
 * - applicant: 신청자 데이터
 * - is_selected: 선정 여부
 * - campaign_data: 캠페인 데이터 (일부 카드 타입에서 브랜드명 확인용)
 * - handle_select: 선정 핸들러
 * - handle_cancel: 선정 취소 핸들러
 */
export type RenderCardFunction = (
  applicant: AllApplicant,
  is_selected: boolean,
  campaign_data: CampaignWithApplicants | null,
  handle_select: (id: string) => void,
  handle_cancel: (id: string) => void
) => React.ReactNode;

/**
 * CampaignProgressDetailLayout 컴포넌트의 props 타입 정의
 */
interface CampaignProgressDetailLayoutProps {
  // 캠페인 데이터
  campaign_data: CampaignWithApplicants;
  // 활성 탭
  active_tab: TabType;
  set_active_tab: (tab: TabType) => void;
  // 정렬 관련
  sort_order: SortOption;
  set_sort_order: (order: SortOption) => void;
  sort_options: Array<{ value: SortOption; label: string }>;
  // 카운트
  applicants_count: number;
  selected_count: number;
  // 현재 탭에 표시할 신청자 목록
  current_applicants: AllApplicant[];
  // 핸들러 함수들
  handle_select_applicant: (id: string) => void;
  handle_cancel_applicant: (id: string) => void;
  handle_download_applicants: () => void;
  handle_download_selected: () => void;
  // 카드 렌더링 함수 (각 캠페인 타입마다 다른 카드 컴포넌트를 렌더링)
  render_card: RenderCardFunction;
  // 캠페인 ID (캠페인 보기 버튼 클릭 시 사용)
  campaign_id: string;
  // CSS 모듈 스타일 객체
  detailStyles: Record<string, string> & {
    detail_page_wrapper: string;
    content_container: string;
    content_inner: string;
  };
}

/**
 * 캠페인 진행현황 상세 페이지 공통 레이아웃 컴포넌트
 *
 * @param props - CampaignProgressDetailLayoutProps 타입의 props
 * @returns JSX.Element - 레이아웃 컴포넌트
 */
export default function CampaignProgressDetailLayout({
  campaign_data,
  active_tab,
  set_active_tab,
  sort_order,
  set_sort_order,
  sort_options,
  applicants_count,
  selected_count,
  current_applicants,
  handle_select_applicant,
  handle_cancel_applicant,
  handle_download_applicants,
  handle_download_selected,
  render_card,
  campaign_id,
  detailStyles,
}: CampaignProgressDetailLayoutProps) {
  /**
   * useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
   * - router.push(): 프로그래밍 방식으로 페이지를 이동시킵니다
   */
  const router = useRouter();

  /**
   * JSX 반환
   * - React 컴포넌트는 JSX(JavaScript XML)를 반환합니다
   * - className: CSS 모듈에서 가져온 스타일 클래스를 적용합니다
   * - 조건부 렌더링: 삼항 연산자(?)를 사용하여 조건에 따라 다른 내용을 렌더링합니다
   */
  return (
    <div className={detailStyles.detail_page_wrapper}>
      <div className={detailStyles.content_container}>
        <div className={detailStyles.content_inner}>
          {/* 
            페이지 헤더 영역
            - flex 레이아웃을 사용하여 좌우로 요소를 배치합니다
            - 왼쪽: 페이지 제목 ("캠페인 신청 내역")
            - 오른쪽: 캠페인 보기 버튼 (클릭 시 캠페인 상세 페이지로 이동)
          */}
          <div className={styles.page_header}>
            {/* 페이지 제목 - h1 태그는 페이지의 주요 제목을 나타내는 시맨틱 태그입니다 */}
            <h1 className={styles.page_title}>캠페인 신청 내역</h1>

            {/* 
              캠페인 보기 버튼
              - onClick: 버튼 클릭 시 실행될 함수를 정의합니다 (화살표 함수 사용)
              - aria-label: 스크린 리더를 위한 접근성 속성입니다
              - className: CSS 모듈에서 가져온 스타일 클래스를 적용합니다
            */}
            <button
              className={styles.view_campaign_button}
              onClick={() => {
                /**
                 * 캠페인 상세 페이지로 이동하는 로직
                 *
                 * - 기존 TODO를 실제 구현으로 교체했습니다.
                 * - 캠페인 타입(배송형/방문형/구매평/기자단/미션형)에 따라
                 *   공통 상세 페이지 URL을 생성합니다.
                 * - 관리자 종류(GA/SA)와 상관없이 동일한 상세 페이지로 이동합니다.
                 */
                const campaign_type =
                  campaign_data.campaignInfo.campaignType as CampaignType;
                const detail_path = getCampaignDetailPath(
                  campaign_type,
                  campaign_id
                );
                router.push(detail_path);
              }}
              aria-label="캠페인 보기"
            >
              {/* 버튼 텍스트 */}
              <span>캠페인 보기</span>

              {/* 
                화살표 아이콘
                - Next.js의 Image 컴포넌트를 사용하여 이미지를 최적화합니다
                - width, height: 이미지 크기를 명시적으로 지정합니다
                - alt: 빈 문자열("")은 장식용 이미지임을 나타냅니다
              */}
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

          {/* 
            캠페인 신청 내역 섹션
            - section 태그: 페이지의 논리적 섹션을 나타내는 시맨틱 태그입니다
          */}
          <section className={styles.campaign_application_section}>
            {/* 캠페인 배너 - 캠페인 기본 정보를 표시합니다 */}
            <Campaignbanner campaignInfo={campaign_data.campaignInfo} />

            {/* 
              정렬 섹션
              - article 태그: 독립적인 콘텐츠 영역을 나타내는 시맨틱 태그입니다
            */}
            <article className={styles.download_section_right}>
              {/* 정렬 필터 컨트롤 */}
              <SortFilterControl
                options={sort_options}
                value={sort_order}
                onChange={(option) =>
                  set_sort_order(option.value as SortOption)
                }
                defaultSort="latest"
              />
            </article>

            {/* 
              탭 네비게이션
              - 신청 탭과 선정 탭을 전환할 수 있는 버튼들입니다
            */}
            <article className={styles.tab_navigation}>
              {/* 신청 탭 버튼 */}
              <button
                className={`${styles.tab_button} ${
                  active_tab === "applicants" ? styles.active : ""
                }`}
                onClick={() => set_active_tab("applicants")}
              >
                신청{" "}
                <span className={styles.tab_count}>{applicants_count}</span>
              </button>
              {/* 선정 탭 버튼 */}
              <button
                className={`${styles.tab_button} ${
                  active_tab === "selected" ? styles.active : ""
                }`}
                onClick={() => set_active_tab("selected")}
              >
                선정 <span className={styles.tab_count}>{selected_count}</span>
              </button>
            </article>

            {/* 
              신청자 그리드
              - 조건부 렌더링: current_applicants.length가 0이면 EmptyApplicantsList를,
                그렇지 않으면 카드 목록을 렌더링합니다
              - map 함수: 배열의 각 항목을 컴포넌트로 변환합니다
              - key prop: React가 리스트의 각 항목을 식별하기 위해 사용합니다
            */}
            <article className={styles.applicants_grid}>
              {current_applicants.length === 0 ? (
                <EmptyApplicantsList />
              ) : (
                current_applicants.map((applicant, index) => (
                  <div key={`${active_tab}-${applicant.id}-${index}`}>
                    {/* 
                      render_card 함수 호출
                      - 각 캠페인 타입마다 다른 카드 컴포넌트를 렌더링합니다
                      - render prop 패턴: 함수를 props로 전달하여 동적으로 컴포넌트를 렌더링합니다
                    */}
                    {render_card(
                      applicant,
                      active_tab === "selected",
                      campaign_data,
                      handle_select_applicant,
                      handle_cancel_applicant
                    )}
                  </div>
                ))
              )}
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
