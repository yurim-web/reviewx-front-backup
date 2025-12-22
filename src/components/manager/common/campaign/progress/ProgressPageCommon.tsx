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
 * - CampaignProgressFilterSection: 필터 섹션 (공통)
 * - CampaignTableCommon: 캠페인 테이블 (공통)
 *
 */

"use client";

import { useState, useMemo } from "react";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import StatCardsSectionCommon from "./cards/StatCardsSection";
import CampaignProgressFilterSection from "./section/CampaignProgressFilterSection";
import CampaignTableCommon from "./table/CampaignTable";

// 신고 모달 공통 컴포넌트와 데이터 import
import CampaignReportModalCommon, {
  type ReportCode,
} from "@/components/manager/common/campaign/modal/CampaignReportModal";
import { report_code_info } from "@/data/manager_ga/reported";

// 데이터와 스타일을 import
import { calculate_stat_card_values as calculateGAStats } from "@/data/manager_ga/progress";
import { calculate_stat_card_values as calculateSAStats } from "@/data/manager_sa/progress";
import {
  campaign_list as gaCampaignList,
  type CampaignProgressItem,
} from "@/data/manager_ga/progress";
import {
  campaign_list as saCampaignList,
  type CampaignProgressItem as SACampaignProgressItem,
} from "@/data/manager_sa/progress";
import type { CampaignStatus } from "./filter/StatusFilterModal";
import type { CampaignType } from "./filter/TypeFilterModal";
import type { Channel } from "./filter/ChannelFilterModal";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

// 스타일 import - 공통 스타일 사용
import pageStyles from "@/styles/manager/common/campaign/progress/page.module.css";
import statCardStyles from "@/styles/manager/common/campaign/progress/stat_card.module.css";
import filterSectionStyles from "@/styles/manager/common/campaign/progress/filter_section.module.css";
import tableStyles from "@/styles/manager/common/campaign/progress/progress_table.module.css";
import commonTagStyles from "@/styles/common/tags.module.css";
import channelIconStyles from "@/styles/manager/common/campaign/progress/channel_icon.module.css";
import campaignReportModalStyles from "@/styles/manager/common/campaign/progress/campaign_report_modal.module.css";

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
  /* ========================================
     📌 필터 상태 관리
     ======================================== */

  // 검색어 상태
  const [search_query, set_search_query] = useState("");

  // 필터 상태
  const [selected_statuses, set_selected_statuses] = useState<CampaignStatus[]>(
    []
  );
  const [selected_types, set_selected_types] = useState<CampaignType[]>([]);
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);

  // manager_type에 따라 데이터를 선택합니다
  // 스타일은 공통 스타일을 사용하므로 선택하지 않습니다

  // 통계 카드 값 계산 함수 선택
  const calculateStats =
    manager_type === "ga" ? calculateGAStats : calculateSAStats;

  // 캠페인 리스트 선택
  const allCampaignList =
    manager_type === "ga" ? gaCampaignList : saCampaignList;

  /* ========================================
     🔍 필터링 로직
     ======================================== */

  // 필터 초기화 함수
  const handle_filter_reset = () => {
    set_search_query("");
    set_selected_statuses([]);
    set_selected_types([]);
    set_selected_channels([]);
    set_selected_date_range(undefined);
  };

  // 필터링된 캠페인 리스트 계산
  // useMemo: 필터 조건이 변경될 때만 재계산하여 성능 최적화
  const filtered_campaign_list = useMemo(() => {
    return allCampaignList.filter((campaign) => {
      // 상태 필터: 선택된 상태가 없으면 모든 상태 통과, 있으면 선택된 상태만 통과
      if (
        selected_statuses.length > 0 &&
        !selected_statuses.includes(campaign.status)
      ) {
        return false;
      }

      // 유형 필터: 선택된 유형이 없으면 모든 유형 통과, 있으면 선택된 유형만 통과
      if (
        selected_types.length > 0 &&
        !selected_types.includes(campaign.type)
      ) {
        return false;
      }

      // 채널 필터: 선택된 채널이 없으면 모든 채널 통과, 있으면 선택된 채널만 통과
      if (
        selected_channels.length > 0 &&
        !selected_channels.includes(campaign.channel)
      ) {
        return false;
      }

      // 검색어 필터: 검색어가 없으면 통과, 있으면 캠페인명 또는 파트너명에 포함되는지 확인
      if (search_query.trim()) {
        const query = search_query.toLowerCase();
        const campaign_name = campaign.campaign_name.toLowerCase();
        const partner_name = campaign.partner_name.toLowerCase();
        if (!campaign_name.includes(query) && !partner_name.includes(query)) {
          return false;
        }
      }

      // 날짜 범위 필터: 선택된 날짜 범위가 있으면 해당 범위 내의 캠페인만 통과
      if (
        selected_date_range?.from &&
        selected_date_range?.to &&
        campaign.created_at
      ) {
        const campaign_date = new Date(campaign.created_at);
        const from_date = new Date(selected_date_range.from);
        const to_date = new Date(selected_date_range.to);
        to_date.setHours(23, 59, 59, 999); // 종료일의 끝 시간까지 포함

        // 날짜 비교 시 시간 부분을 제거하여 날짜만 비교
        campaign_date.setHours(0, 0, 0, 0);
        from_date.setHours(0, 0, 0, 0);

        if (campaign_date < from_date || campaign_date > to_date) {
          return false;
        }
      }

      return true;
    });
  }, [
    allCampaignList,
    selected_statuses,
    selected_types,
    selected_channels,
    selected_date_range,
    search_query,
  ]);

  // 스타일은 모두 공통 스타일을 사용합니다

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
        {/* CampaignProgressFilterSection은 공통 컴포넌트로, 스타일을 props로 받습니다 */}
        <CampaignProgressFilterSection
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
          search_query={search_query}
          on_search_change={set_search_query}
          selected_statuses={selected_statuses}
          on_statuses_change={set_selected_statuses}
          selected_types={selected_types}
          on_types_change={set_selected_types}
          selected_channels={selected_channels}
          on_channels_change={set_selected_channels}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          on_filter_reset={handle_filter_reset}
        />

        {/* 캠페인 테이블 */}
        {/* CampaignTableCommon은 공통 컴포넌트로, 데이터와 스타일을 props로 받습니다 */}
        <CampaignTableCommon
          campaign_list={filtered_campaign_list}
          base_path={basePath}
          ReportModal={ReportModal}
          styles={tableStyles}
          tagStyles={
            commonTagStyles as Record<string, string> & { type_tag: string }
          }
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
