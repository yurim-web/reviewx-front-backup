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

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  add_blacklist_item,
  get_blacklist_data,
  block_code_reason_map,
  type BlacklistItem,
  type BlockReason,
} from "@/data/manager_ga/member/blacklist";
import type { BlockCode } from "@/data/manager_ga/common/filterOptions";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_ga/campaign/reported/reported_table.module.css";
import {
  get_reported_campaign_list,
  remove_reported_campaign,
  reported_campaign_list,
  report_code_info,
  type ReportedCampaignItem,
  type ReportCodeInfo,
  type ReportCode,
} from "@/data/manager_ga/reported";
import CampaignReasonModal from "@/components/manager/common/campaign/modal/CampaignReasonModal";
import ManagerRestrictionModal from "@/components/manager/common/campaign/modal/ManagerRestrictionModal";
import BaseModal from "@/components/common/modal/BaseModal";
import TextareaModal from "@/components/common/modal/TextareaModal";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";

import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface ReportedCampaignTableProps {
  search_query: string;
  selected_report_codes: ReportCode[];
  selected_date_range?: DateRange | undefined;
}

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
  // 신고 내역 목록 업데이트를 위한 상태 (리렌더링 트리거)
  const [reported_update_key, set_reported_update_key] = useState<number>(0);
  // 클라이언트 마운트 여부 (Hydration 오류 방지)
  const [is_mounted, set_is_mounted] = useState<boolean>(false);

  // 클라이언트에서만 마운트 후 localStorage 데이터 로드
  useEffect(() => {
    set_is_mounted(true);
    // localStorage에서 데이터를 로드하여 상태 업데이트
    set_reported_update_key((prev) => prev + 1);
  }, []);

  // Next.js 라우터: 페이지 이동에 사용
  // useRouter는 Next.js의 클라이언트 사이드 라우팅을 위한 Hook입니다.
  const router = useRouter();

  const [block_modal_state, set_block_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
    item: ReportedCampaignItem | null;
  }>({
    is_open: false,
    campaign_id: null,
    item: null,
  });

  const [modal_state, set_modal_state] = useState<{
    is_open: boolean;
    item: ReportedCampaignItem | null;
  }>({
    is_open: false,
    item: null,
  });

  // 해제 확인 모달 상태
  const [clear_confirm_modal_state, set_clear_confirm_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  // 해제 완료 모달 상태
  const [clear_complete_modal_state, set_clear_complete_modal_state] =
    useState<boolean>(false);

  // 이미 처리된 요청 모달 상태
  const [already_processed_modal_state, set_already_processed_modal_state] =
    useState<boolean>(false);

  // 신고 사유 확인 모달 상태 (W013 코드용)
  const [report_reason_modal_state, set_report_reason_modal_state] = useState<{
    is_open: boolean;
    item: ReportedCampaignItem | null;
  }>({
    is_open: false,
    item: null,
  });

  const handle_block_click = (
    campaign_id: string,
    item: ReportedCampaignItem
  ) => {
    set_block_modal_state({
      is_open: true,
      campaign_id,
      item,
    });
  };

  // 해제 버튼 클릭 핸들러
  const handle_clear_click = (campaign_id: string) => {
    set_clear_confirm_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  // 해제 확인 모달 닫기 핸들러
  const handle_clear_confirm_modal_close = () => {
    set_clear_confirm_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  // 해제 확인 모달에서 해제 버튼 클릭 핸들러
  const handle_clear_confirm = () => {
    if (clear_confirm_modal_state.campaign_id) {
      // 신고 내역 제거 (localStorage에 저장)
      remove_reported_campaign(clear_confirm_modal_state.campaign_id);

      // 목록 업데이트를 위한 리렌더링 트리거
      set_reported_update_key((prev) => prev + 1);
    }

    // 확인 모달 닫기
    set_clear_confirm_modal_state({
      is_open: false,
      campaign_id: null,
    });

    // 해제 완료 모달 표시
    set_clear_complete_modal_state(true);
  };

  // 해제 완료 모달 닫기 핸들러
  const handle_clear_complete_modal_close = () => {
    set_clear_complete_modal_state(false);
    // 목록이 자동으로 업데이트됨 (get_reported_campaign_list()가 다시 호출됨)
  };

  const handle_block_modal_close = () => {
    set_block_modal_state({
      is_open: false,
      campaign_id: null,
      item: null,
    });
  };

  // 이용 제한 핸들러
  // 이용 제한 사유 모달에서 "확인" 버튼을 클릭했을 때 실행됩니다
  const handle_block_submit = (block_reason: string) => {
    if (!block_modal_state.item) return;

    // 리뷰어 정보 추출
    const reviewer_name = block_modal_state.item.target;

    // 이미 이용 제한된 계정인지 확인
    // 같은 이름으로 이미 블랙리스트에 등록된 내역이 있는지 체크
    const existing_blacklist = get_blacklist_data();
    const is_already_blocked = existing_blacklist.some(
      (item) => item.name === reviewer_name
    );

    // 이미 이용 제한된 경우 예외 처리
    if (is_already_blocked) {
      // 이용 제한 모달 닫기
      handle_block_modal_close();
      // 이미 처리된 요청 모달 표시
      set_already_processed_modal_state(true);
      return;
    }

    // 차단 사유를 BlockReason 타입으로 변환
    // 모달의 차단 사유 옵션과 BlockReason 타입을 매핑
    const block_reason_map: Record<string, BlockReason> = {
      "반복 반려 누적": "반복 반려 누적",
      "반복 취소 누적": "반복 반려 누적", // 가장 유사한 것으로 매핑
      "무단 이탈 · 노쇼 누적": "무단 이탈 · 노쇼 누적",
      "공정위 위반 게시 요청 누적": "공정위 위반 게시 요청",
      "부적절 캠페인 게시": "부적절 캠페인 게시",
      "콘텐츠 도용 · 중복": "콘텐츠 중복 · 도용",
      "비정상 요청 · 접근": "비정상 운영 행위",
      "외부 결제 · 금전 요구": "외부 결제 · 금전 요구",
      "비매너 행위": "커뮤니티 가이드 위반", // 가장 유사한 것으로 매핑
    };

    const mapped_block_reason: BlockReason =
      block_reason_map[block_reason] || "커뮤니티 가이드 위반";

    // 차단 코드 찾기 (역방향 매핑)
    const block_code =
      (Object.keys(block_code_reason_map) as BlockCode[]).find(
        (code) => block_code_reason_map[code] === mapped_block_reason
      ) || "B004"; // 기본값

    // 새로운 블랙리스트 항목 ID 생성
    const existing_data = get_blacklist_data();
    const max_id = Math.max(
      ...existing_data.map((item) => parseInt(item.id) || 0)
    );
    const new_id = (max_id + 1).toString();

    // 현재 날짜/시간 생성 (기존 데이터 형식과 동일하게)
    // 기존 데이터 형식: "2026-01-28 09:40"
    const current_date = format(new Date(), "yyyy-MM-dd HH:mm");

    // 디버깅: 추가되는 항목 확인
    console.log("새 블랙리스트 항목 추가:", {
      name: reviewer_name,
      registered_date: current_date,
      block_reason: mapped_block_reason,
    });

    // 블랙리스트 항목 생성
    const new_blacklist_item: BlacklistItem = {
      id: new_id,
      name: reviewer_name,
      user_id: `reviewer_${new_id}`, // 임시 user_id 생성
      division: "리뷰어",
      current_points: 0,
      ip_address: "0.0.0.0", // 임시 IP 주소
      block_code: block_code as BlockCode,
      block_reason: mapped_block_reason,
      registered_date: current_date,
      registered_by: "관리자",
    };

    // 블랙리스트에 추가
    add_blacklist_item(new_blacklist_item);

    // 신고 내역에서 제거 (localStorage에 저장)
    if (block_modal_state.item) {
      remove_reported_campaign(block_modal_state.item.id);
      // 목록 업데이트를 위한 리렌더링 트리거
      set_reported_update_key((prev) => prev + 1);
    }

    // 블랙리스트 페이지로 이동
    // router.push: Next.js에서 페이지를 이동하는 메서드입니다.
    router.push("/manager_ga/member/blacklist");

    // 모달 닫기
    handle_block_modal_close();
  };

  // reported_update_key를 의존성으로 추가하여 리렌더링 트리거
  const filtered_list = useMemo(() => {
    // 필터 함수 (공통)
    const filter_item = (item: ReportedCampaignItem): boolean => {
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
    };

    // 서버 사이드에서는 기본 데이터만 반환 (Hydration 오류 방지)
    if (!is_mounted) {
      return reported_campaign_list.filter(filter_item);
    }

    // 클라이언트에서는 localStorage 데이터 포함
    return get_reported_campaign_list().filter(filter_item);
  }, [
    search_query,
    selected_report_codes,
    selected_date_range,
    reported_update_key,
    is_mounted,
  ]);

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
            case "report_code": {
              // W013 코드일 때만 아이콘 표시
              const is_w013 = row.report_code === "W013";
              return (
                <div className={styles.report_code_cell}>
                  <span>{row.report_code}</span>
                  {is_w013 && (
                    <button
                      onClick={() => {
                        set_report_reason_modal_state({
                          is_open: true,
                          item: row,
                        });
                      }}
                      className={styles.report_code_info_button}
                      aria-label="신고 사유 확인"
                    >
                      <img
                        src="/images/management_page/cancel_info.svg"
                        alt="신고 사유 확인"
                        className={styles.report_code_info_icon}
                      />
                    </button>
                  )}
                </div>
              );
            }
            case "report_count":
              return <span>{row.report_count}회</span>;
            case "processed_date":
              return <span>{row.processed_date}</span>;
            case "block": {
              const is_hovered = hovered_row_id === row.id;
              return is_hovered ? (
                <div className={styles.block_button_group}>
                  <button
                    onClick={() => handle_clear_click(row.id)}
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
                    onClick={() => handle_block_click(row.id, row)}
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
        empty_message="검색 결과가 없습니다."
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
            "검색 결과가 없습니다."
          }
          code={modal_state.item.report_code}
          code_info_list={report_code_info.map((info) => ({
            code: info.code,
            category: info.category,
            reason: info.reason,
          }))}
        />
      )}
      <ManagerRestrictionModal
        is_open={block_modal_state.is_open}
        on_close={handle_block_modal_close}
        campaign_id={block_modal_state.campaign_id || undefined}
        on_block={handle_block_submit}
      />
      {/* 해제 확인 모달 */}
      <BaseModal
        is_open={clear_confirm_modal_state.is_open}
        on_close={handle_clear_confirm_modal_close}
        message="신고 내역을 해제하시겠습니까?"
        buttons={["취소", "해제"]}
        on_confirm={handle_clear_confirm}
        type="center"
      />
      {/* 해제 완료 모달 */}
      <BaseModal
        is_open={clear_complete_modal_state}
        on_close={handle_clear_complete_modal_close}
        message="해제가 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />
      {/* 신고 사유 확인 모달 (W013 코드용) */}
      {report_reason_modal_state.item && (
        <TextareaModal
          is_open={report_reason_modal_state.is_open}
          on_close={() => {
            set_report_reason_modal_state({
              is_open: false,
              item: null,
            });
          }}
          title="신고 사유"
          value={
            report_reason_modal_state.item.report_reason ||
            get_report_code_info(report_reason_modal_state.item.report_code)
              ?.reason ||
            "신고 사유가 없습니다."
          }
          readOnly={true}
          buttons={["닫기"]}
          type="center"
        />
      )}
      {/* 이미 처리된 요청 모달 */}
      <BaseModal
        is_open={already_processed_modal_state}
        on_close={() => set_already_processed_modal_state(false)}
        message="이미 처리된 요청입니다."
        buttons={["확인"]}
        type="center"
      />
    </>
  );
}
