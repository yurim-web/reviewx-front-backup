/* ========================================
   📋 반려 이력 테이블 컴포넌트
   ======================================== */

/**
 * 반려 이력 테이블 컴포넌트
 *
 * 목적: GA 관리자 반려 이력 페이지에서 반려 이력 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려 이력 페이지)
 *
 * 주요 기능:
 * - 반려 이력 목록을 테이블로 표시합니다
 * - 검색어와 반려 코드 필터를 적용합니다
 * - 사유 확인하기 버튼을 제공합니다
 *
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_ga/campaign/rejected_table.module.css";
import {
  rejected_campaign_list,
  reject_code_info,
  type RejectedCampaignItem,
  type RejectCodeInfo,
  type RejectCode,
} from "@/data/manager_ga/rejected";
import CampaignReasonModal from "@/components/manager/common/campaign/modal/CampaignReasonModal";
import CampaignReportModalCommon, {
  type ReportCode,
} from "@/components/manager/common/campaign/modal/CampaignReportModal";
import { report_code_info } from "@/data/manager_ga/reported";
import campaignReportModalStyles from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";
import campaignReasonModalStyles from "@/styles/manager_ga/campaign/common/modal/campaign_reason_modal.module.css";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface RejectedCampaignTableProps {
  search_query: string;
  selected_reject_codes: RejectCode[];
  selected_date_range?: DateRange | undefined;
}

// RejectedCampaignItem이 TableRowData를 확장하도록 확장
interface RejectedCampaignTableRowData
  extends RejectedCampaignItem,
    TableRowData {}

// 반려 코드 정보를 코드로 찾는 함수
const get_reject_code_info = (code: string): RejectCodeInfo | undefined => {
  return reject_code_info.find((info) => info.code === code);
};

// 컬럼 정의
const get_columns = (styles: Record<string, string>): TableColumn[] => [
  {
    key: "campaign_number",
    label: "캠페인 번호",
    sortable: true,
  },
  {
    key: "campaign_name",
    label: "캠페인명",
    className: styles.table_cell_campaign_name,
  },
  {
    key: "target",
    label: "등록자",
  },
  {
    key: "inspector",
    label: "검수자",
  },
  {
    key: "reject_code",
    label: "반려 코드",
  },
  {
    key: "reject_reason",
    label: "반려 사유",
  },
  {
    key: "reject_count",
    label: "반려 횟수",
    sortable: true,
  },
  {
    key: "processed_date",
    label: "처리일",
    sortable: true,
  },
  {
    key: "report",
    label: "",
    className: styles.table_cell_report,
  },
];

export default function RejectedCampaignTable({
  search_query,
  selected_reject_codes,
  selected_date_range,
}: RejectedCampaignTableProps) {
  const [hovered_report_row_id, set_hovered_report_row_id] = useState<
    string | null
  >(null);

  const [modal_state, set_modal_state] = useState<{
    is_open: boolean;
    item: RejectedCampaignItem | null;
  }>({
    is_open: false,
    item: null,
  });

  const [report_modal_state, set_report_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  const handle_report_click = (campaign_id: string) => {
    set_report_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  const handle_report_modal_close = () => {
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  const handle_report_submit = (report_code: ReportCode) => {
    // TODO: 실제 신고 로직 구현
  };

  const filtered_list = rejected_campaign_list.filter((item) => {
    // 검색어 필터
    if (
      search_query &&
      !item.campaign_name.includes(search_query) &&
      !item.campaign_number.includes(search_query)
    ) {
      return false;
    }

    // 반려 코드 필터
    if (
      selected_reject_codes.length > 0 &&
      !selected_reject_codes.includes(item.reject_code)
    ) {
      return false;
    }

    // 날짜 범위 필터
    if (selected_date_range?.from && selected_date_range?.to) {
      // processed_date 형식: "2025-08-01 18:56"
      const processed_date_str = item.processed_date.split(" ")[0]; // 날짜 부분만 추출
      const processed_date = new Date(processed_date_str);
      const from_date = new Date(selected_date_range.from);
      const to_date = new Date(selected_date_range.to);
      to_date.setHours(23, 59, 59, 999); // 종료일의 끝 시간까지 포함

      // 날짜 비교 시 시간 부분을 제거하여 날짜만 비교
      processed_date.setHours(0, 0, 0, 0);
      from_date.setHours(0, 0, 0, 0);

      if (processed_date < from_date || processed_date > to_date) {
        return false;
      }
    }

    return true;
  });

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    campaign_number: "numeric_string",
    reject_count: "number",
    processed_date: "date",
  };

  // 정렬 훅 사용
  // 페이지 로드 시 "campaign_number" 컬럼 기준 오름차순으로 기본 정렬
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_filtered_list,
  } = useTableSort({
    data: filtered_list,
    initial_column_key: "campaign_number", // 기본 정렬: 캠페인 번호 컬럼
    initial_direction: "asc", // 오름차순
    column_config,
  });

  const columns = get_columns(styles);

  // 툴팁 설정
  const tooltip_config: TooltipConfig = {
    column_key: "campaign_name",
    tooltip_content: (row: RejectedCampaignItem) => row.campaign_name,
    tooltip_class_name: styles.tooltip_box,
    text_class_name: styles.campaign_name_text,
  };

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // "report" 컬럼은 빈 셀로 처리
  const render_custom_header = () => {
    const handle_select_all = () => {
      // RejectedCampaignTable은 체크박스가 없으므로 빈 함수
    };

    // "report" 컬럼을 빈 셀로 렌더링
    const render_custom_cell = (column: TableColumn) => {
      if (column.key === "report") {
        return (
          <div
            key={column.key}
            className={styles.table_header_cell_report}
          ></div>
        );
      }
      return null;
    };

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={false}
        styles={styles}
        enable_checkbox={false}
        render_custom_cell={render_custom_cell}
        use_header_row={false}
      />
    );
  };

  return (
    <>
      <CommonTableWithTooltip<RejectedCampaignTableRowData>
        columns={columns}
        data={sorted_filtered_list}
        render_cell={(row, column) => {
          switch (column.key) {
            case "campaign_number":
              return <span>{row.campaign_number}</span>;
            case "campaign_name":
              return <span>{row.campaign_name}</span>;
            case "target":
              return <span>{row.target}</span>;
            case "inspector":
              return <span>{row.inspector}</span>;
            case "reject_code":
              return <span>{row.reject_code}</span>;
            case "reject_reason": {
              return (
                <button
                  className={styles.reject_reason_button}
                  onClick={() => {
                    set_modal_state({
                      is_open: true,
                      item: row,
                    });
                  }}
                  aria-label={`${row.campaign_number} 반려 사유 확인`}
                >
                  <img
                    src="/images/management_page/cancel_info.svg"
                    alt="반려 사유 정보"
                    className={styles.reject_reason_icon}
                  />
                  사유 확인
                </button>
              );
            }
            case "reject_count":
              return <span>{row.reject_count}회</span>;
            case "processed_date":
              return <span>{row.processed_date}</span>;
            case "report": {
              const is_report_hovered = hovered_report_row_id === row.id;
              return is_report_hovered ? (
                <button
                  onClick={() => handle_report_click(row.id)}
                  className={styles.report_button}
                  aria-label={`${row.campaign_name} 신고`}
                >
                  <img
                    src="/images/icons/table_report.svg"
                    alt="신고"
                    className={styles.report_icon}
                  />
                </button>
              ) : null;
            }
            default:
              return null;
          }
        }}
        styles={styles}
        tooltip_config={tooltip_config}
        render_header={render_custom_header}
        on_row_wrapper_hover={(row_id) => {
          set_hovered_report_row_id(row_id);
        }}
        empty_message="반려 이력이 없습니다."
      />
      {modal_state.item && (
        <CampaignReasonModal
          mode="reject"
          is_open={modal_state.is_open}
          on_close={() => {
            set_modal_state({
              is_open: false,
              item: null,
            });
          }}
          reason_text={
            modal_state.item.reject_reason ||
            get_reject_code_info(modal_state.item.reject_code)?.reason ||
            "반려 사유가 없습니다."
          }
          code={modal_state.item.reject_code}
          code_info_list={reject_code_info.map((info) => ({
            code: info.code,
            category: info.category,
            reason: info.reason,
          }))}
          styles={
            campaignReasonModalStyles as Record<string, string> & {
              modal_overlay: string;
              modal_container: string;
              modal_title: string;
              reason_box: string;
              reason_text: string;
              ai_recommended_section: string;
              ai_recommended_label: string;
              classification_container: string;
              classification_item: string;
              classification_item_selected: string;
              classification_radio: string;
              classification_check_icon: string;
              classification_label: string;
              modal_footer: string;
              close_button: string;
              confirm_button: string;
            }
          }
        />
      )}
      <CampaignReportModalCommon
        mode="report"
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
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
        report_code_options={[
          "W001",
          "W002",
          "W003",
          "W004",
          "W005",
          "W006",
          "W007",
          "W009",
          "W010",
          "W011",
          "W013",
        ]}
      />
    </>
  );
}
