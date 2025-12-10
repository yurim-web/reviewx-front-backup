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
import {
  get_sort_arrow_transform,
  get_sort_arrow_alt,
  type SortColumnConfig,
} from "@/utils/table/sort";
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

interface RejectedCampaignTableProps {
  search_query: string;
  selected_reject_codes: RejectCode[];
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
    if (
      search_query &&
      !item.campaign_name.includes(search_query) &&
      !item.campaign_number.includes(search_query)
    ) {
      return false;
    }

    if (
      selected_reject_codes.length > 0 &&
      !selected_reject_codes.includes(item.reject_code)
    ) {
      return false;
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
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_filtered_list,
  } = useTableSort({
    data: filtered_list,
    initial_column_key: "campaign_number",
    initial_direction: "asc",
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

  // 커스텀 헤더 렌더링
  const render_custom_header = () => {
    return (
      <div className={styles.table_header}>
        {columns.map((column) => {
          if (column.key === "report") {
            return (
              <div
                key={column.key}
                className={styles.table_header_cell_report}
              ></div>
            );
          }
          return (
            <div key={column.key} className={styles.table_header_cell}>
              <span>{column.label}</span>
              {column.sortable && (
                <button
                  type="button"
                  onClick={() => handle_sort(column.key)}
                  className={styles.table_header_sort_button}
                  aria-label={`${column.label} 정렬`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/images/icons/table_arrow.svg"
                    alt={get_sort_arrow_alt(sort_state, column.key)}
                    className={styles.table_header_arrow}
                    style={{
                      transform: get_sort_arrow_transform(
                        sort_state,
                        column.key
                      ),
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
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
