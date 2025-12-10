/* ========================================
   📊 캠페인 진행 상황 페이지 (공통 컴포넌트)
   ======================================== */

/**
 * 캠페인 진행 상황 페이지 (공통 컴포넌트)
 *
 * 목적: GA/SA 관리자 진행 상황 페이지에서 공통으로 사용하는 페이지 컴포넌트입니다.
 *       manager_type에 따라 데이터 소스와 스타일을 동적으로 결정합니다.
 *
 * 두 가지 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 상황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 상황 페이지)
 *
 * 실무에서 사용하는 패턴:
 * - 공통 컴포넌트를 만들어서 중복 코드 제거
 * - Props로 manager_type을 받아서 데이터와 스타일을 주입
 * - 각 경로에서는 이 컴포넌트를 wrapper로 사용
 *
 * 주요 기능:
 * - 상단 통계 카드 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
 * - 필터 섹션 (날짜, 검색, 상태, 유형, 채널, 정렬, 저장)
 * - 캠페인 목록 테이블
 *
 * 컴포넌트 구조:
 * - StatCardsSectionCommon: 통계 카드 섹션 (공통)
 * - FilterSectionCommon: 필터 섹션 (공통)
 * - CampaignTableCommon: 캠페인 테이블 (공통)
 *
 */

"use client";

import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import StatCardsSectionCommon from "./cards/StatCardsSection";
import FilterSectionCommon from "./section/FilterSection";
import CampaignTableCommon from "./table/CampaignTable";

// 신고 모달 공통 컴포넌트와 데이터 import
import CampaignReportModalCommon, {
  type ReportCode,
} from "@/components/manager/common/campaign/modal/CampaignReportModal";
import { report_code_info } from "@/data/manager_ga/reported";

// 데이터와 스타일을 import
import { calculate_stat_card_values as calculateGAStats } from "@/data/manager_ga/progress";
import { calculate_stat_card_values as calculateSAStats } from "@/data/manager_sa/progress";
import { campaign_list as gaCampaignList } from "@/data/manager_ga/progress";
import { campaign_list as saCampaignList } from "@/data/manager_sa/progress";

// 스타일 import
import pageStylesGA from "@/styles/manager_ga/campaign/progress/page.module.css";
import pageStylesSA from "@/styles/manager_sa/campaign/progress/page.module.css";
import statCardStylesGA from "@/styles/manager_ga/campaign/progress/stat_card.module.css";
import statCardStylesSA from "@/styles/manager_sa/campaign/progress/stat_card.module.css";
import filterSectionStylesGA from "@/styles/manager_ga/campaign/progress/filter_section.module.css";
import filterSectionStylesSA from "@/styles/manager_sa/campaign/progress/filter_section.module.css";
import tableStylesGA from "@/styles/manager_ga/campaign/progress_table.module.css";
import tableStylesSA from "@/styles/manager_sa/campaign/progress_table.module.css";
import tagStylesGA from "@/styles/manager_ga/campaign/progress/tags.module.css";
import tagStylesSA from "@/styles/manager_sa/campaign/progress/tags.module.css";
import channelIconStylesGA from "@/styles/manager_ga/campaign/progress/channel_icon.module.css";
import channelIconStylesSA from "@/styles/manager_sa/campaign/progress/channel_icon.module.css";
import campaignReportModalStylesGA from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";
import campaignReportModalStylesSA from "@/styles/manager_sa/campaign/progress/campaign_report_modal.module.css";

// 관리자 타입 정의
export type ManagerType = "ga" | "sa";

/**
 * ProgressPageCommon 컴포넌트의 Props 타입 정의
 *
 * @property manager_type - 관리자 타입 ('ga' | 'sa')
 *                        이 값에 따라 데이터 소스와 스타일이 결정됩니다
 */
interface ProgressPageCommonProps {
  manager_type: ManagerType;
}

/**
 * 캠페인 진행 상황 페이지 공통 컴포넌트
 *
 * @param props - ProgressPageCommonProps 객체
 * @param props.manager_type - 관리자 타입 ('ga' 또는 'sa')
 * @returns 캠페인 진행 상황 페이지 JSX 요소
 *
 * 학습 포인트:
 * - Props를 통해 컴포넌트의 동작을 제어하는 방법
 * - 조건부로 데이터와 스타일을 선택하는 방법
 * - 공통 컴포넌트를 만들어서 코드 중복을 제거하는 방법
 */
export default function ProgressPageCommon({
  manager_type,
}: ProgressPageCommonProps) {
  // manager_type에 따라 데이터와 스타일을 선택합니다
  // 삼항 연산자를 사용하여 조건부로 값을 선택합니다
  // 형식: 조건 ? 참일 때 값 : 거짓일 때 값

  // 페이지 스타일 선택
  const pageStyles = manager_type === "ga" ? pageStylesGA : pageStylesSA;

  // 통계 카드 값 계산 함수 선택
  const calculateStats =
    manager_type === "ga" ? calculateGAStats : calculateSAStats;

  // 통계 카드 스타일 선택
  const statCardStyles =
    manager_type === "ga" ? statCardStylesGA : statCardStylesSA;

  // 필터 섹션 스타일 선택
  const filterSectionStyles =
    manager_type === "ga" ? filterSectionStylesGA : filterSectionStylesSA;

  // 캠페인 리스트 선택
  const campaignList = manager_type === "ga" ? gaCampaignList : saCampaignList;

  // 테이블 스타일 선택
  const tableStyles = manager_type === "ga" ? tableStylesGA : tableStylesSA;

  // 태그 스타일 선택
  const tagStyles = manager_type === "ga" ? tagStylesGA : tagStylesSA;

  // 채널 아이콘 스타일 선택
  const channelIconStyles =
    manager_type === "ga" ? channelIconStylesGA : channelIconStylesSA;

  // 신고 모달 스타일 선택
  const campaignReportModalStyles =
    manager_type === "ga"
      ? campaignReportModalStylesGA
      : campaignReportModalStylesSA;

  // 신고 코드 옵션 (GA와 SA 모두 동일)
  const report_code_options: ReportCode[] = [
    "W001", // 예정 취소
    "W002", // 지급 출출
    "W003", // 무단 탈퇴 · 차단
    "W004", // 출출 기간 불이행
    "W005", // 예정 신청 불이행
    "W006", // 게시 취소
    "W007", // 부적절한 캠페인 게시
    "W009", // 비정상적 신청 반복
    "W010", // 중복 계정 사용
    "W011", // 콘텐츠 중복 사용
    "W013", // 기타 비매너 위반
  ];

  // 신고 모달 컴포넌트를 wrapper 함수로 생성
  // CampaignTableCommon이 컴포넌트 타입을 기대하므로 wrapper 함수를 만들어서 전달합니다
  const ReportModal = ({
    is_open,
    on_close,
    campaign_id,
    on_report,
  }: {
    is_open: boolean;
    on_close: () => void;
    campaign_id?: string;
    on_report?: (report_code: string) => void;
  }) => {
    return (
      <CampaignReportModalCommon
        mode="report"
        is_open={is_open}
        on_close={on_close}
        campaign_id={campaign_id}
        on_report={on_report as (report_code: ReportCode) => void}
        styles={
          campaignReportModalStyles as {
            modal_overlay: string;
            modal_content: string;
            modal_title: string;
            options_list: string;
            option_item: string;
            option_radio: string;
            option_label: string;
            modal_footer: string;
            close_button: string;
            report_button: string;
            block_button: string;
          }
        }
        report_code_info={report_code_info}
        report_code_options={report_code_options}
      />
    );
  };

  // base_path 선택 (URL 경로)
  const basePath =
    manager_type === "ga"
      ? "/manager_ga/campaign/progress"
      : "/manager_sa/campaign/progress";

  // 통계 카드 값들을 계산합니다
  const statCardValues = calculateStats();

  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="캠페인 진행 상황" />

        {/* 통계 카드 섹션 */}
        {/* StatCardsSectionCommon은 공통 컴포넌트로, 데이터와 스타일을 props로 받습니다 */}
        <StatCardsSectionCommon
          stat_card_values={statCardValues}
          styles={
            statCardStyles as {
              stat_cards_section: string;
              stat_card: string;
              stat_card_title: string;
              stat_card_value: string;
              stat_card_value_cancelled: string;
            }
          }
        />

        {/* 필터 섹션 */}
        {/* FilterSectionCommon은 공통 컴포넌트로, 스타일을 props로 받습니다 */}
        <FilterSectionCommon
          styles={
            filterSectionStyles as {
              filter_item: string;
              filter_icon: string;
              filter_text: string;
              checkbox_icon: string;
              dropdown_arrow: string;
              report_icon: string;
            }
          }
        />

        {/* 캠페인 테이블 */}
        {/* CampaignTableCommon은 공통 컴포넌트로, 데이터와 스타일을 props로 받습니다 */}
        <CampaignTableCommon
          campaign_list={campaignList}
          base_path={basePath}
          ReportModal={ReportModal}
          styles={tableStyles}
          tagStyles={tagStyles as Record<string, string> & { type_tag: string }}
          channelIconStyles={
            channelIconStyles as Record<string, string> & {
              channel_icon: string;
              channel_icon_image: string;
            }
          }
        />
      </div>
    </div>
  );
}
