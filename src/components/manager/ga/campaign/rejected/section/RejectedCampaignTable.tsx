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

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import BaseModal from "@/components/common/modal/BaseModal";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_ga/campaign/rejected/rejected_table.module.css";
import {
  get_rejected_campaign_list,
  rejected_campaign_list,
  reject_code_info,
  remove_rejected_campaign,
  reset_rejected_campaign_storage,
  type RejectedCampaignItem,
  type RejectCodeInfo,
  type RejectCode,
} from "@/data/manager_ga/rejected";
import {
  add_reported_campaign,
  get_reported_campaign_list,
  report_code_info,
  reported_campaign_list,
  type ReportedCampaignItem,
} from "@/data/manager_ga/reported";
import CampaignReasonModal from "@/components/manager/common/campaign/modal/CampaignReasonModal";
import ManagerReportReasonModalCommon, {
  type ReportCode,
} from "@/components/manager/common/campaign/modal/ManagerReportReasonModal";
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
  // Next.js 라우터: 페이지 이동에 사용
  const router = useRouter();

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
    item: RejectedCampaignItem | null;
  }>({
    is_open: false,
    campaign_id: null,
    item: null,
  });
  // on_report 호출 시 항상 최신 item 사용 (클로저/배칭으로 인한 stale state 방지)
  const report_modal_item_ref = useRef<RejectedCampaignItem | null>(null);

  // 이미 처리된 요청 모달 상태
  const [already_processed_modal_state, set_already_processed_modal_state] =
    useState<boolean>(false);

  // 반려 내역 업데이트를 위한 리렌더링 트리거
  const [rejected_update_key, set_rejected_update_key] = useState<number>(0);

  // Hydration 오류 방지를 위한 마운트 상태
  const [is_mounted, set_is_mounted] = useState<boolean>(false);

  useEffect(() => {
    set_is_mounted(true);
    
    // 개발 환경에서 localStorage 확인 및 디버깅
    if (process.env.NODE_ENV === 'development') {
      const list = get_rejected_campaign_list();
      if (list.length === 0 && rejected_campaign_list.length > 0) {
        console.warn('반려 내역 데이터가 표시되지 않습니다. localStorage에 제거된 항목이 저장되어 있을 수 있습니다.');
        console.log('localStorage 초기화를 원하시면 브라우저 콘솔에서 다음을 실행하세요:');
        console.log('localStorage.removeItem("rejected_campaign_removed_ids"); location.reload();');
      }
    }
  }, []);

  const handle_report_click = (
    campaign_id: string,
    item: RejectedCampaignItem
  ) => {
    report_modal_item_ref.current = item;
    set_report_modal_state({
      is_open: true,
      campaign_id,
      item,
    });
  };

  const handle_report_modal_close = () => {
    report_modal_item_ref.current = null;
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
      item: null,
    });
  };

  // 신고 핸들러 (닫기 시 모달에서 report_item으로 전달받거나 ref 사용)
  const handle_report_submit = (
    report_code: ReportCode,
    report_item_from_modal?: unknown
  ) => {
    const rejected_item =
      (report_item_from_modal as RejectedCampaignItem | null) ??
      report_modal_item_ref.current ??
      report_modal_state.item;
    if (!rejected_item) return;

    // 이미 신고된 내역인지 확인
    // 같은 캠페인 번호와 대상자로 이미 신고된 내역이 있는지 체크
    const existing_reported_list = get_reported_campaign_list();
    const is_already_reported = existing_reported_list.some(
      (item) =>
        item.campaign_number === rejected_item.campaign_number &&
        item.target === rejected_item.target
    );

    // 이미 신고된 경우 예외 처리
    if (is_already_reported) {
      // 신고 모달 닫기
      handle_report_modal_close();
      // 이미 처리된 요청 모달 표시
      set_already_processed_modal_state(true);
      return;
    }

    // 신고 코드 정보 가져오기
    const code_info = report_code_info.find(
      (info) => info.code === report_code
    );
    const report_reason = code_info?.reason || "";

    // 새로운 신고 내역 ID 생성
    // 기존 신고 내역 목록에서 최대 ID 찾기
    const max_id = Math.max(
      ...reported_campaign_list.map((item) => parseInt(item.id) || 0)
    );
    const new_id = (max_id + 1).toString();

    // 현재 날짜/시간 생성
    const current_date = format(new Date(), "yyyy-MM-dd HH:mm");

    // 신고 내역 항목 생성 (반려 내역 → 신고 내역 변환)
    const new_reported_item: ReportedCampaignItem = {
      id: new_id,
      campaign_number: rejected_item.campaign_number,
      campaign_name: rejected_item.campaign_name,
      report_code: report_code,
      report_reason: report_reason,
      inspector: rejected_item.inspector,
      target: rejected_item.target,
      processed_date: current_date,
      report_count: 1,
    };

    // 신고 내역에 추가
    add_reported_campaign(new_reported_item);

    // 반려 내역에서 제거 (localStorage에 저장)
    remove_rejected_campaign(rejected_item.id);

    // 목록 업데이트를 위한 리렌더링 트리거
    set_rejected_update_key((prev) => prev + 1);

    // 모달은 신고 완료 안내 모달에서 "닫기" 클릭 시 닫힘 (handle_report_modal_close는 on_close로 호출됨)
    // 신고 내역 페이지로 이동은 닫기 클릭 시 처리
  };

  // 이미 처리된 요청 모달 닫기 핸들러
  const handle_already_processed_modal_close = () => {
    set_already_processed_modal_state(false);
  };

  const filtered_list = useMemo(() => {
    // 서버 사이드에서는 기본 데이터만 반환 (Hydration 오류 방지)
    const list_to_filter = !is_mounted
      ? rejected_campaign_list
      : get_rejected_campaign_list();

    return list_to_filter.filter((item) => {
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
  }, [
    search_query,
    selected_reject_codes,
    selected_date_range,
    rejected_update_key,
    is_mounted, // is_mounted를 의존성으로 추가
  ]);

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
    initial_direction: "desc", // 번호 최신순
    column_config,
  });

  const columns = get_columns(styles);

  // 툴팁 설정
  const tooltip_config: TooltipConfig = {
    column_key: "all",
    exclude_column_keys: ["report"],
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
                  onClick={() => handle_report_click(row.id, row)}
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
        empty_message="검색 결과가 없습니다."
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
          on_confirm={(reason_text) => {
            if (modal_state.item) {
              modal_state.item.reject_reason = reason_text;
              set_rejected_update_key((k) => k + 1);
            }
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
        />
      )}
      <ManagerReportReasonModalCommon
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
        report_item={report_modal_state.item}
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
      {/* 이미 처리된 요청 모달 */}
      <BaseModal
        is_open={already_processed_modal_state}
        on_close={handle_already_processed_modal_close}
        message="이미 처리된 요청입니다."
        buttons={["확인"]}
        type="center"
      />
    </>
  );
}
