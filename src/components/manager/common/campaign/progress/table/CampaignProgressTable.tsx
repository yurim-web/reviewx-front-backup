/* ========================================
   📋 캠페인 진행 현황 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 진행 현황 테이블 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는
 *       캠페인 진행 현황 테이블 컴포넌트입니다.
 *
 * 📍 사용 위치:
 * - 직접 사용 컴포넌트:
 *   - ProgressPageCommon 컴포넌트 (캠페인 진행 상황 페이지 공통 컴포넌트)
 *
 * - 최종 사용 페이지:
 *   - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 *   - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 사용 흐름:
 * GA 관리자 진행 현황 페이지 (/manager_ga/campaign/progress)
 *   └─> ProgressPageCommon 컴포넌트 (manager_type="ga")
 *       └─> CampaignProgressTable 컴포넌트
 *
 * SA 관리자 진행 현황 페이지 (/manager_sa/campaign/progress)
 *   └─> ProgressPageCommon 컴포넌트 (manager_type="sa")
 *       └─> CampaignProgressTable 컴포넌트
 *
 */

"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useTableSort } from "@/hooks/table/useTableSort";
import {
  add_reported_campaign,
  get_reported_campaign_list,
  report_code_info,
  reported_campaign_list,
  type ReportedCampaignItem,
} from "@/data/manager_ga/reported";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import CampaignStatusTag from "@/components/manager/common/tags/CampaignStatusTag";
import CampaignTypeTag from "@/components/manager/common/tags/CampaignTypeTag";
import ChannelIcon from "../icons/ChannelIcon";
import type { CampaignStatus } from "@/components/manager/common/tags/CampaignStatusTag";
import type { CampaignType } from "@/components/manager/common/tags/CampaignTypeTag";
import type { Channel } from "../icons/ChannelIcon";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";

// 캠페인 진행 아이템 타입 정의
export interface CampaignProgressItem {
  id: string; // 캠페인 ID
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  type: CampaignType; // 캠페인 유형
  channel: Channel; // 채널
  status: CampaignStatus; // 상태
  recruit_count: number; // 모집 수
  apply_count: number; // 신청 수
  point: number; // 지급 포인트
  detail_campaign_id?: string; // 상세 페이지에서 사용할 공용 캠페인 ID (옵션)
}

// CampaignProgressItem이 TableRowData를 확장하도록 확장
interface CampaignTableRowData extends CampaignProgressItem, TableRowData {}

// 신고 모달 컴포넌트 타입 (props로 받음)
interface ReportModalComponent {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: string, report_item?: unknown) => void;
  report_item?: unknown;
}

interface CampaignTableProps {
  campaign_list: CampaignProgressItem[]; // 캠페인 목록 데이터
  base_path: string; // 상세 페이지 기본 경로 (예: '/manager_ga/campaign/progress' 또는 '/manager_sa/campaign/progress')
  ReportModal: React.ComponentType<ReportModalComponent>; // 신고 모달 컴포넌트
  styles: Record<string, string>; // CSS 모듈 스타일 객체 (유연한 타입)
  tagStyles: Record<string, string> & { type_tag: string }; // 태그 스타일 객체 (type_tag 포함)
  channelIconStyles: Record<string, string> & {
    channel_icon: string;
    channel_icon_image: string;
  }; // 채널 아이콘 스타일 객체 (channel_icon, channel_icon_image 포함)
  // 필터/검색 상태 (빈 메시지 결정용)
  search_query?: string; // 검색어
  has_active_filters?: boolean; // 활성 필터가 있는지 여부 (상태, 유형, 채널, 날짜 필터)
}

// 캠페인 타입별 상세 페이지 경로 매핑
const campaign_detail_map: Record<
  CampaignType,
  { slug: string; sample_id: string }
> = {
  배송형: { slug: "delivery", sample_id: "961" },
  방문형: { slug: "visit", sample_id: "1" },
  구매평: { slug: "review", sample_id: "18" },
  기자단: { slug: "reporter", sample_id: "201" },
  미션형: { slug: "mission", sample_id: "16" },
};

// 컬럼 정의
const get_columns = (styles: Record<string, string>): TableColumn[] => [
  {
    key: "campaign_number",
    label: "캠페인 번호",
    sortable: true,
  },
  {
    key: "partner_name",
    label: "파트너명",
  },
  {
    key: "campaign_name",
    label: "캠페인명",
    className: styles.table_cell_campaign_name,
  },
  {
    key: "status",
    label: "상태",
  },
  {
    key: "type",
    label: "유형",
  },
  {
    key: "channel",
    label: "플랫폼",
  },
  {
    key: "apply_count",
    label: "신청 수",
    sortable: true,
  },
  {
    key: "recruit_count",
    label: "모집 수",
    sortable: true,
  },
  {
    key: "point",
    label: "지급 포인트",
    sortable: true,
  },
  {
    key: "report",
    label: "",
    className: styles.table_cell_report,
  },
];

export default function CampaignProgressTable({
  campaign_list,
  base_path,
  ReportModal,
  styles: cssStyles,
  tagStyles,
  channelIconStyles,
  search_query = "",
  has_active_filters = false,
}: CampaignTableProps) {
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // useState: 클라이언트 마운트 여부 (Hydration 오류 방지용)
  // 서버 사이드에서는 false, 클라이언트에서 마운트되면 true가 됩니다
  const [is_mounted, setIsMounted] = useState(false);

  // useEffect: 클라이언트에서만 실행되어 마운트 상태를 true로 설정
  // 📌 Hydration 오류 방지:
  // - 서버 사이드에서는 실행되지 않으므로 서버와 클라이언트의 초기 렌더링 결과가 동일합니다
  // - 클라이언트에서 마운트된 후에만 실제 필터 상태를 사용합니다
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    campaign_number: "numeric_string",
    apply_count: "number",
    recruit_count: "number",
    point: "number",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_campaign_list,
  } = useTableSort({
    data: campaign_list,
    initial_column_key: "campaign_number",
    initial_direction: "desc", // 번호 최신순
    column_config,
  });

  const [report_modal_state, set_report_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
    item: CampaignProgressItem | null;
  }>({
    is_open: false,
    campaign_id: null,
    item: null,
  });

  const handle_report_click = (campaign_id: string, row: CampaignProgressItem) => {
    set_report_modal_state({
      is_open: true,
      campaign_id,
      item: row,
    });
  };

  const handle_report_modal_close = () => {
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
      item: null,
    });
  };

  const handle_report_submit = (
    report_code: string,
    report_item_from_modal?: unknown
  ) => {
    const row = report_item_from_modal as CampaignProgressItem | null;
    if (!row?.campaign_number) return;

    const code_info = report_code_info.find((info) => info.code === report_code);
    const report_reason = code_info?.reason ?? "";
    const max_id = Math.max(
      0,
      ...reported_campaign_list.map((item) => parseInt(item.id) || 0),
      ...get_reported_campaign_list().map((item) => parseInt(item.id) || 0)
    );
    const new_id = String(max_id + 1);
    const new_reported_item: ReportedCampaignItem = {
      id: new_id,
      campaign_number: row.campaign_number,
      campaign_name: row.campaign_name,
      report_code: report_code as ReportedCampaignItem["report_code"],
      report_reason,
      inspector: row.partner_name ?? "-",
      target: "-",
      processed_date: format(new Date(), "yyyy-MM-dd HH:mm"),
      report_count: 1,
    };
    add_reported_campaign(new_reported_item);
  };

  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  const get_detail_href = (campaign: CampaignProgressItem): string | null => {
    const detail_info = campaign_detail_map[campaign.type];
    if (!detail_info) {
      return null;
    }
    const detail_id =
      (campaign.detail_campaign_id &&
        String(campaign.detail_campaign_id).trim()) ||
      detail_info.sample_id;
    return `${base_path}/${detail_info.slug}/${detail_id}`;
  };

  const columns = get_columns(cssStyles);

  // 헤더용 컬럼 정의 (className 제거하여 헤더 스타일이 바디 스타일에 영향받지 않도록)
  const header_columns: TableColumn[] = columns.map((column) => ({
    ...column,
    className:
      column.key === "report" ? cssStyles.table_header_cell_report : undefined,
  }));

  // 빈 메시지 결정: 필터/검색이 적용되어 있으면 "검색 결과가 없습니다.", 아니면 "캠페인이 없습니다."
  // 📌 Hydration 오류 방지:
  // - 서버 사이드 또는 초기 렌더링 시에는 항상 "캠페인이 없습니다."를 반환합니다
  // - 클라이언트에서 마운트된 후에만 실제 필터 상태를 확인하여 메시지를 결정합니다
  const empty_message = useMemo(() => {
    // 클라이언트에서 마운트되지 않았으면 기본 메시지 반환 (Hydration 오류 방지)
    if (!is_mounted) {
      return "캠페인이 없습니다.";
    }

    // 검색어가 있거나 활성 필터가 있으면 검색 결과 없음 메시지 표시
    return search_query.trim() || has_active_filters
      ? "검색 결과가 없습니다."
      : "캠페인이 없습니다.";
  }, [is_mounted, search_query, has_active_filters]);

  // 커스텀 행 래퍼 (행 전체를 클릭 가능하게 만들되, report 버튼은 제외)
  const render_row_wrapper = (
    row: CampaignTableRowData,
    row_content: React.ReactNode,
    index: number
  ) => {
    const detail_href = get_detail_href(row);

    // 상세 페이지 링크가 없으면 그대로 반환
    if (!detail_href) {
      return row_content;
    }

    return (
      <Link
        href={detail_href}
        className={cssStyles.table_row_link}
        aria-label={`캠페인 상세로 이동: ${row.campaign_name}`}
        onClick={(e) => {
          // report 셀 또는 report 버튼을 클릭한 경우 링크 이동 방지
          const target = e.target as HTMLElement;
          const currentTarget = e.currentTarget as HTMLElement;

          // data 속성으로 report 셀 확인
          const report_cell = target.closest('[data-report-cell="true"]');
          const report_button = target.closest('[data-report-button="true"]');

          // report 셀의 클래스명으로도 확인 (CSS 모듈 클래스명)
          const is_report_cell = target.closest(
            `.${cssStyles.table_cell_report}`
          );
          const is_report_button = target.closest(
            `.${cssStyles.report_button}`
          );

          if (
            report_cell ||
            report_button ||
            is_report_cell ||
            is_report_button
          ) {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            return false;
          }
        }}
        onMouseDown={(e) => {
          // report 셀 클릭 시 Link의 클릭 이벤트 차단
          const target = e.target as HTMLElement;
          const report_cell = target.closest('[data-report-cell="true"]');
          const is_report_cell = target.closest(
            `.${cssStyles.table_cell_report}`
          );

          if (report_cell || is_report_cell) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {row_content}
      </Link>
    );
  };

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // "report" 컬럼은 빈 셀로 처리
  const render_custom_header = () => {
    const handle_select_all = () => {
      // CampaignTable은 체크박스가 없으므로 빈 함수
    };

    // "report" 컬럼을 빈 셀로 렌더링
    const render_custom_cell = (column: TableColumn) => {
      if (column.key === "report") {
        return (
          <div
            key={column.key}
            className={cssStyles.table_header_cell_report}
          ></div>
        );
      }
      return null;
    };

    return (
      <SortableTableHeader
        columns={header_columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={false}
        styles={cssStyles}
        enable_checkbox={false}
        render_custom_cell={render_custom_cell}
        use_header_row={false}
      />
    );
  };

  const tooltip_config: TooltipConfig = {
    column_key: "all",
    exclude_column_keys: ["report"],
  };

  return (
    <>
      <CommonTableWithTooltip<CampaignTableRowData>
        columns={columns}
        data={sorted_campaign_list}
        tooltip_config={tooltip_config}
        render_cell={(row, column) => {
          switch (column.key) {
            case "campaign_number":
              return <span>{row.campaign_number}</span>;
            case "partner_name":
              return <span>{row.partner_name}</span>;
            case "campaign_name": {
              return <span>{row.campaign_name}</span>;
            }
            case "status":
              return <CampaignStatusTag status={row.status} />;
            case "type":
              return <CampaignTypeTag type={row.type} />;
            case "channel":
              return (
                <ChannelIcon channel={row.channel} styles={channelIconStyles} />
              );
            case "apply_count":
              return <span>{format_number(row.apply_count)}</span>;
            case "recruit_count":
              return <span>{format_number(row.recruit_count)}</span>;
            case "point":
              return <span>{format_number(row.point)}</span>;
            case "report": {
              const is_hovered = hovered_row_id === row.id;
              return (
                <div
                  data-report-cell="true"
                  onMouseDown={(e) => {
                    // Link의 클릭 이벤트를 완전히 차단
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 행 클릭 이벤트 전파 방지
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  {is_hovered ? (
                    <button
                      data-report-button="true"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // 행 클릭 이벤트 전파 방지
                        handle_report_click(row.id, row);
                      }}
                      className={cssStyles.report_button}
                      aria-label={`${row.campaign_name} 신고`}
                    >
                      <img
                        src="/images/icons/table_report.svg"
                        alt="신고"
                        className={cssStyles.report_icon}
                      />
                    </button>
                  ) : null}
                </div>
              );
            }
            default:
              return null;
          }
        }}
        styles={cssStyles}
        enable_hover={true}
        on_row_hover={set_hovered_row_id}
        render_header={render_custom_header}
        render_row_wrapper={render_row_wrapper}
        container_class_name=""
        empty_message={empty_message}
      />
      <ReportModal
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
        report_item={report_modal_state.item}
      />
    </>
  );
}
