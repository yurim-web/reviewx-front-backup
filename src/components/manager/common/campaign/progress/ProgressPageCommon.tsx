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

import { useState, useMemo, useEffect } from "react";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import StatCardsSectionCommon from "./cards/StatCardsSection";
import CampaignProgressFilterSection from "./section/CampaignProgressFilterSection";
import CampaignTableCommon from "./table/CampaignProgressTable";

// 신고 사유 모달 공통 컴포넌트와 데이터 import
import ManagerReportReasonModalCommon, {
  type ReportCode,
} from "@/components/manager/common/campaign/modal/ManagerReportReasonModal";

// 데이터와 스타일을 import
import { get_campaign_list as getGACampaignList } from "@/data/manager_ga/progress";
import { get_campaign_list as getSACampaignList } from "@/data/manager_sa/progress";
import type { CampaignProgressItem } from "@/data/manager_ga/progress";
import type { CampaignStatus } from "./filter/StatusFilterModal";
import type { CampaignType } from "./filter/TypeFilterModal";
import type { Channel } from "./filter/ChannelFilterModal";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

// 스타일 import - 공통 스타일 사용
import pageStyles from "@/styles/manager/common/manager_common_page.module.css";
import statCardStyles from "@/styles/manager/common/campaign/progress/stat_card.module.css";
import filterSectionStyles from "@/styles/manager/common/section/filter_section.module.css";
import tableStyles from "@/styles/manager/common/campaign/progress/progress_table.module.css";
import commonTagStyles from "@/styles/common/tags.module.css";
import channelIconStyles from "@/styles/manager/common/campaign/progress/channel_icon.module.css";

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
 */
export default function ProgressPageCommon({
  manager_type,
}: ProgressPageCommonProps) {
  /* ========================================
     📌 필터 상태 관리
     ======================================== */

  // 검색어 상태
  const [search_query, set_search_query] = useState("");

  /* ========================================
     📅 현재 달의 날짜 범위 계산 함수
     ======================================== */

  /**
   * 현재 달의 첫날과 마지막 날을 계산하는 함수
   *
   * 설명:
   * - 현재 날짜를 기준으로 이번 달의 첫날(1일)과 마지막 날을 계산합니다
   * - 예: 2026년 1월 → 2026-01-01 ~ 2026-01-31
   * - 예: 2026년 2월 → 2026-02-01 ~ 2026-02-28 (또는 29일, 윤년인 경우)
   *
   * 📌 주의:
   * - 이 함수는 클라이언트에서만 실행되어야 합니다 (서버 사이드에서는 undefined 반환)
   * - useState의 초기값 함수로 사용하면 클라이언트에서만 실행됩니다
   *
   * @returns 현재 달의 첫날과 마지막 날을 포함한 DateRange 객체
   */
  const get_current_month_date_range = (): DateRange | undefined => {
    // 서버 사이드에서는 undefined 반환 (Hydration 오류 방지)
    if (typeof window === "undefined") {
      return undefined;
    }

    // 현재 날짜 가져오기
    const now = new Date();
    const year = now.getFullYear(); // 현재 연도 (예: 2026)
    const month = now.getMonth(); // 현재 월 (0부터 시작: 0 = 1월, 11 = 12월)

    // 이번 달의 첫날 계산
    // new Date(year, month, 1): 해당 연도와 월의 1일
    const first_day = new Date(year, month, 1);
    // 시간 부분을 00:00:00으로 설정 (날짜만 비교하기 위해)
    first_day.setHours(0, 0, 0, 0);

    // 이번 달의 마지막 날 계산
    // new Date(year, month + 1, 0): 다음 달의 0일 = 이번 달의 마지막 날
    // 예: new Date(2026, 1, 0) = 2026년 1월 31일 (2월의 0일)
    const last_day = new Date(year, month + 1, 0);
    // 시간 부분을 23:59:59로 설정 (종료일의 끝 시간까지 포함)
    last_day.setHours(23, 59, 59, 999);

    return {
      from: first_day,
      to: last_day,
    };
  };

  // 필터 상태
  const [selected_statuses, set_selected_statuses] = useState<CampaignStatus[]>(
    []
  );
  const [selected_types, set_selected_types] = useState<CampaignType[]>([]);
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);
  // 날짜 범위 필터: 초기값을 undefined로 설정 (모든 캠페인 표시)
  // useState의 초기값을 함수로 설정하면 클라이언트에서만 실행됩니다
  // 📌 페이지 로드 시 날짜 필터 없이 모든 캠페인이 표시됩니다
  const [selected_date_range, set_selected_date_range] = useState<
    DateRange | undefined
  >(undefined);

  // manager_type에 따라 데이터를 선택합니다
  // 스타일은 공통 스타일을 사용하므로 선택하지 않습니다

  // 캠페인 리스트 가져오기 함수 선택
  const getCampaignList =
    manager_type === "ga" ? getGACampaignList : getSACampaignList;

  // 캠페인 리스트 상태 (클라이언트에서만 로드하여 Hydration 오류 방지)
  const [allCampaignList, setAllCampaignList] = useState<
    CampaignProgressItem[]
  >([]);

  // useEffect: 클라이언트에서만 실행되어 localStorage 데이터를 포함한 캠페인 리스트 로드
  // 📌 Hydration 오류 방지:
  // - 서버 사이드에서는 localStorage가 없어서 다른 결과를 반환할 수 있습니다
  // - useEffect는 클라이언트에서만 실행되므로 서버와 클라이언트의 렌더링 결과가 동일합니다
  useEffect(() => {
    const campaignList = getCampaignList();
    setAllCampaignList(campaignList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager_type]); // manager_type이 변경될 때만 재로드

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

      // 검색어 필터: 검색어가 없으면 통과, 있으면 캠페인 번호, 캠페인명, 파트너명에 포함되는지 확인
      if (search_query.trim()) {
        const query = search_query.toLowerCase();
        const campaign_number = campaign.campaign_number.toLowerCase();
        const campaign_name = campaign.campaign_name.toLowerCase();
        const partner_name = campaign.partner_name.toLowerCase();
        if (
          !campaign_number.includes(query) &&
          !campaign_name.includes(query) &&
          !partner_name.includes(query)
        ) {
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
  const ReportModal = ({
    is_open,
    on_close,
    campaign_id,
    on_report,
    report_item,
  }: {
    is_open: boolean;
    on_close: () => void;
    campaign_id?: string;
    on_report?: (report_code: string, report_item?: unknown) => void;
    report_item?: unknown;
  }) => {
    return (
      <ManagerReportReasonModalCommon
        is_open={is_open}
        on_close={on_close}
        campaign_id={campaign_id}
        on_report={on_report as (report_code: ReportCode, report_item?: unknown) => void}
        report_code_options={report_code_options}
        report_item={report_item}
      />
    );
  };

  // base_path 선택 (URL 경로)
  const basePath =
    manager_type === "ga"
      ? "/manager_ga/campaign/progress"
      : "/manager_sa/campaign/progress";

  /* ========================================
     📊 통계 카드 값 계산 (필터링된 데이터 기준)
     ======================================== */

  /**
   * 필터링된 캠페인 리스트를 기반으로 통계 카드 값들을 계산하는 함수
   *
   * 설명:
   * - filtered_campaign_list를 기반으로 각 상태별 캠페인 개수를 계산합니다
   * - 날짜 필터가 적용되면 해당 날짜 범위의 캠페인만 통계에 포함됩니다
   * - 숫자를 천 단위로 포맷팅하여 반환합니다
   *
   * @param campaign_list - 통계를 계산할 캠페인 리스트
   * @returns 통계 카드 값들 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
   */
  const calculate_stat_card_values_from_list = (
    campaign_list: CampaignProgressItem[]
  ) => {
    // 오픈 예정 캠페인 (status가 '예정'인 것)
    const open_scheduled_count = campaign_list.filter(
      (campaign) => campaign.status === "예정"
    ).length;

    // 진행 중인 캠페인 (status가 '진행'인 것)
    const in_progress_count = campaign_list.filter(
      (campaign) => campaign.status === "진행"
    ).length;

    // 신청 중인 캠페인 (status가 '신청'인 것)
    const applying_count = campaign_list.filter(
      (campaign) => campaign.status === "신청"
    ).length;

    // 전체 캠페인
    const total_count = campaign_list.length;

    // 종료된 캠페인 (status가 '종료'인 것)
    const ended_count = campaign_list.filter(
      (campaign) => campaign.status === "종료"
    ).length;

    // 취소된 캠페인 (status가 '취소'인 것)
    const cancelled_count = campaign_list.filter(
      (campaign) => campaign.status === "취소"
    ).length;

    // 숫자를 천 단위로 포맷팅하는 함수
    // toLocaleString: 숫자를 지역화된 문자열로 변환합니다 (예: 1000 -> "1,000")
    const format_count = (count: number): string => {
      return `${count.toLocaleString("ko-KR")}건`;
    };

    return {
      open_scheduled: format_count(open_scheduled_count),
      in_progress: format_count(in_progress_count),
      applying: format_count(applying_count),
      total: format_count(total_count),
      ended: format_count(ended_count),
      cancelled: format_count(cancelled_count),
    };
  };

  // 통계 카드 값들을 계산합니다 (필터링된 캠페인 리스트 기준)
  // useMemo: filtered_campaign_list가 변경될 때만 재계산하여 성능 최적화
  // 📌 날짜 필터 적용:
  // - selected_date_range가 변경되면 filtered_campaign_list도 변경됩니다
  // - filtered_campaign_list가 변경되면 통계 카드 값도 자동으로 재계산됩니다
  // - 이렇게 하면 날짜 필터를 선택하면 통계 카드가 해당 날짜 범위의 데이터만 표시합니다
  const statCardValues = useMemo(() => {
    // 클라이언트에서만 계산 (localStorage 데이터 포함)
    // 서버 사이드에서는 빈 통계를 반환하여 Hydration 오류 방지
    if (typeof window === "undefined") {
      return {
        open_scheduled: "0건",
        in_progress: "0건",
        applying: "0건",
        total: "0건",
        ended: "0건",
        cancelled: "0건",
      };
    }

    // 필터링된 캠페인 리스트를 기반으로 통계 계산
    return calculate_stat_card_values_from_list(filtered_campaign_list);
  }, [filtered_campaign_list]); // filtered_campaign_list가 변경될 때만 재계산

  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="캠페인 진행 현황" />

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
          search_query={search_query}
          has_active_filters={
            selected_statuses.length > 0 ||
            selected_types.length > 0 ||
            selected_channels.length > 0 ||
            selected_date_range !== undefined
          }
        />
      </div>
    </div>
  );
}
