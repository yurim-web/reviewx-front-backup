/* ========================================
   📋 신고내역 테이블 컴포넌트
   ======================================== */

/**
 * 신고내역 테이블 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 내역 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 * 주요 기능:
 * - 신고 내역 목록을 테이블로 표시합니다
 * - 검색어와 신고 코드 필터를 적용합니다
 * - 사유 확인하기 버튼을 제공합니다
 *
 */

"use client";

import { useState } from "react";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_ga/campaign/reported/reported_table.module.css";
import {
  reported_campaign_list,
  report_code_info,
  type ReportedCampaignItem,
  type ReportCodeInfo,
  type ReportCode,
} from "@/data/manager_ga/reported";
import CampaignReasonModal from "@/components/manager/common/campaign/modal/CampaignReasonModal";
import CampaignReportModal from "@/components/manager/common/campaign/modal/CampaignReportModal";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import campaignReportModalStyles from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";
import campaignReasonModalStyles from "@/styles/manager_ga/campaign/common/modal/campaign_reason_modal.module.css";

import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface ReportedCampaignTableProps {
  search_query: string;
  selected_report_codes: ReportCode[];
  selected_date_range?: DateRange | undefined;
}

// 차단 사유 옵션 (차단 모달에서 사용)
const block_reason_options = [
  "반복 반려 누적",
  "반복 취소 누적",
  "무단 이탈 · 노쇼 누적",
  "공정위 위반 게시 요청 누적",
  "부적절 캠페인 게시",
  "콘텐츠 도용 · 중복",
  "비정상 요청 · 접근",
  "외부 결제 · 금전 요구",
  "비매너 행위",
];

// ReportedCampaignItem이 TableRowData를 확장하도록 확장
interface ReportedCampaignTableRowData
  extends ReportedCampaignItem,
    TableRowData {}

// 신고 코드 정보를 코드로 찾는 함수
const get_report_code_info = (code: string): ReportCodeInfo | undefined => {
  return report_code_info.find((info) => info.code === code);
};

// 컬럼 정의
const get_columns = (styles: Record<string, string>): TableColumn[] => [
  {
    key: "campaign_number",
    label: "번호",
    sortable: true,
  },
  {
    key: "campaign_name",
    label: "캠페인명/이름",
    className: styles.table_cell_campaign_name,
  },
  {
    key: "target",
    label: "대상자",
  },
  {
    key: "inspector",
    label: "검수자",
  },
  {
    key: "report_code",
    label: "신고 코드",
  },
  {
    key: "report_count",
    label: "신고 횟수",
    sortable: true,
  },
  {
    key: "processed_date",
    label: "처리일",
    sortable: true,
  },
  {
    key: "block",
    label: "",
    className: styles.table_cell_block,
  },
];

export default function ReportedCampaignTable({
  search_query,
  selected_report_codes,
  selected_date_range,
}: ReportedCampaignTableProps) {
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  const [block_modal_state, set_block_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  const [modal_state, set_modal_state] = useState<{
    is_open: boolean;
    item: ReportedCampaignItem | null;
  }>({
    is_open: false,
    item: null,
  });

  const handle_block_click = (campaign_id: string) => {
    set_block_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  const handle_block_modal_close = () => {
    set_block_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  const handle_block_submit = (block_reason: string) => {
    // TODO: 실제 차단 로직 구현
  };

  const filtered_list = reported_campaign_list.filter((item) => {
    // 검색어 필터
    if (
      search_query &&
      !item.campaign_name.includes(search_query) &&
      !item.campaign_number.includes(search_query)
    ) {
      return false;
    }

    // 신고 코드 필터
    if (
      selected_report_codes.length > 0 &&
      !selected_report_codes.includes(item.report_code)
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
    report_count: "number",
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
    tooltip_content: (row: ReportedCampaignItem) => row.campaign_name,
    tooltip_class_name: styles.tooltip_box,
    text_class_name: styles.campaign_name_text,
  };

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // "block" 컬럼은 빈 셀로 처리
  const render_custom_header = () => {
    const handle_select_all = () => {
      // ReportedCampaignTable은 체크박스가 없으므로 빈 함수
    };

    // "block" 컬럼을 빈 셀로 렌더링
    const render_custom_cell = (column: TableColumn) => {
      if (column.key === "block") {
        return (
          <div
            key={column.key}
            className={styles.table_header_cell_block}
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
      <CommonTableWithTooltip<ReportedCampaignTableRowData>
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
            case "report_code":
              return <span>{row.report_code}</span>;
            case "report_count":
              return <span>{row.report_count}회</span>;
            case "processed_date":
              return <span>{row.processed_date}</span>;
            case "block": {
              const is_hovered = hovered_row_id === row.id;
              return is_hovered ? (
                <div className={styles.block_button_group}>
                  <button
                    onClick={() => {
                      // TODO: 해제 로직 구현
                    }}
                    className={styles.clear_button}
                    aria-label={`${row.campaign_name} 해제`}
                  >
                    <img
                      src="/images/icons/clear_icon.svg"
                      alt="해제"
                      className={styles.clear_icon}
                    />
                  </button>
                  <button
                    onClick={() => handle_block_click(row.id)}
                    className={styles.block_button}
                    aria-label={`${row.campaign_name} 차단`}
                  >
                    <img
                      src="/images/icons/declaration_icon.svg"
                      alt="차단"
                      className={styles.block_icon}
                    />
                  </button>
                </div>
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
          set_hovered_row_id(row_id);
        }}
        empty_message="신고 내역이 없습니다."
      />
      {modal_state.item && (
        <CampaignReasonModal
          mode="report"
          is_open={modal_state.is_open}
          on_close={() => {
            set_modal_state({
              is_open: false,
              item: null,
            });
          }}
          reason_text={
            modal_state.item.report_reason ||
            get_report_code_info(modal_state.item.report_code)?.reason ||
            "신고 사유가 없습니다."
          }
          code={modal_state.item.report_code}
          code_info_list={report_code_info.map((info) => ({
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
      <CampaignReportModal
        mode="block"
        is_open={block_modal_state.is_open}
        on_close={handle_block_modal_close}
        campaign_id={block_modal_state.campaign_id || undefined}
        on_block={handle_block_submit}
        block_reason_options={block_reason_options}
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
      />
    </>
  );
}
