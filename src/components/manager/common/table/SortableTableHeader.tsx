/* ========================================
   📋 정렬 가능한 테이블 헤더 컴포넌트 (공통)
   ======================================== */

/**
 * 정렬 가능한 테이블 헤더 컴포넌트
 *
 * 목적: 여러 테이블에서 공통으로 사용되는 정렬 기능이 포함된 헤더 렌더링을 제공합니다.
 *
 * 사용 위치:
 * - CampaignTable (캠페인 진행 현황 테이블)
 *   - src/components/manager/common/campaign/progress/table/CampaignTable.tsx
 *
 * - PostTable (게시글 목록 테이블)
 *   - src/components/manager/common/community/posts/section/PostTable.tsx
 *
 * - BlacklistTable (차단 내역 테이블)
 *   - src/components/manager/common/member/blacklist/BlacklistTable.tsx
 *
 * - CategoryTable (카테고리 테이블)
 *   - src/components/manager/common/community/categories/section/CategoryTable.tsx
 *
 * - ReviewerTable (리뷰어 목록 테이블)
 *   - src/components/manager/common/member/table/ReviewerTable.tsx
 *
 * - PartnerTable (파트너 목록 테이블)
 *   - src/components/manager/common/member/table/PartnerTable.tsx
 *
 * - PaymentHistoryTable (결제 내역 테이블)
 *   - src/components/manager/sa/settlement/payment_history/section/PaymentHistoryTable.tsx
 *
 * - WithdrawalTable (출금 현황 테이블)
 *   - src/components/manager/sa/settlement/withdrawal/section/WithdrawalTable.tsx
 *
 * - RequestTable (출금 요청 테이블)
 *   - src/components/manager/sa/settlement/withdrawal_request/section/RequestTable.tsx
 *
 * - RejectedCampaignTable (반려 내역 캠페인 테이블)
 *   - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 *
 * - ReportedCampaignTable (신고 내역 캠페인 테이블)
 *   - src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx
 *
 * - AdminTable (관리자 테이블)
 *   - src/components/manager/sa/member/admins/section/AdminTable.tsx
 *
 * 주요 기능:
 * - 정렬 가능한 컬럼에 정렬 버튼 표시
 * - 정렬 상태에 따른 화살표 회전 애니메이션
 * - 체크박스 전체 선택/해제 기능
 * - 커스텀 헤더 셀 스타일 지원
 * - table_header_row 사용 여부 선택 가능 (use_header_row prop)
 */

"use client";

import { ReactNode } from "react";
import type { TableColumn } from "./CommonTable";
import type { SortState } from "@/utils/table/sort";
import {
  get_sort_arrow_transform,
  get_sort_arrow_alt,
} from "@/utils/table/sort";

/**
 * SortableTableHeader Props 인터페이스
 *
 * 각 속성 설명:
 * - columns: 테이블 컬럼 정의 배열
 * - sort_state: 현재 정렬 상태 (어떤 컬럼이 정렬되었는지, 오름차순/내림차순)
 * - handle_sort: 정렬을 처리하는 함수
 * - handle_select_all: 전체 선택/해제 핸들러
 * - is_all_selected: 전체 선택 상태 여부
 * - styles: CSS 모듈 스타일 객체
 * - render_checkbox?: 체크박스 커스텀 렌더링 함수 (선택사항)
 * - get_custom_header_class?: 특정 컬럼에 커스텀 클래스를 추가하는 함수 (선택사항)
 * - render_custom_cell?: 특정 컬럼에 커스텀 헤더 셀을 렌더링하는 함수 (선택사항, 예: 빈 셀)
 * - enable_checkbox?: 체크박스 표시 여부 (기본값: true)
 * - disable_select_all?: 전체 선택 체크박스 비활성화 여부 (기본값: false, true일 경우 체크박스는 표시되지만 비활성화됨)
 * - container_style?: 헤더 컨테이너에 적용할 인라인 스타일 (선택사항)
 * - container_class_name?: 헤더 컨테이너에 적용할 추가 클래스 (선택사항, 예: grid 레이아웃용)
 * - use_header_row?: table_header_row 사용 여부 (기본값: true, false일 경우 헤더 셀을 직접 table_header에 배치)
 */
interface SortableTableHeaderProps {
  columns: TableColumn[];
  sort_state: SortState;
  handle_sort: (column_key: string) => void;
  handle_select_all: () => void;
  is_all_selected: boolean;
  styles: Record<string, string>;
  render_checkbox?: () => ReactNode;
  get_custom_header_class?: (column_key: string) => string;
  render_custom_cell?: (column: TableColumn) => ReactNode | null;
  enable_checkbox?: boolean;
  disable_select_all?: boolean;
  container_style?: React.CSSProperties;
  container_class_name?: string;
  use_header_row?: boolean;
}

/**
 * 정렬 가능한 테이블 헤더 컴포넌트
 *
 * @param columns - 테이블 컬럼 정의 배열
 * @param sort_state - 현재 정렬 상태
 * @param handle_sort - 정렬 핸들러 함수
 * @param handle_select_all - 전체 선택/해제 핸들러
 * @param is_all_selected - 전체 선택 상태
 * @param styles - CSS 모듈 스타일 객체
 * @param render_checkbox - 체크박스 커스텀 렌더링 함수 (선택사항)
 * @param get_custom_header_class - 커스텀 헤더 클래스 함수 (선택사항)
 */
export default function SortableTableHeader({
  columns,
  sort_state,
  handle_sort,
  handle_select_all,
  is_all_selected,
  styles,
  render_checkbox,
  get_custom_header_class,
  render_custom_cell,
  enable_checkbox = true,
  disable_select_all = false,
  container_style,
  container_class_name,
  use_header_row = true,
}: SortableTableHeaderProps) {
  const header_class = `${styles.table_header} ${container_class_name || ""}`.trim();
  // 헤더 셀들을 렌더링하는 함수
  const render_header_cells = () => {
    return (
      <>
        {/* 체크박스 헤더 */}
        {enable_checkbox &&
          (render_checkbox ? (
            render_checkbox()
          ) : (
            <div className={styles.table_cell_checkbox}>
              <input
                type="checkbox"
                checked={is_all_selected}
                onChange={handle_select_all}
                disabled={disable_select_all}
                className={styles.checkbox}
                aria-label="전체 선택"
              />
            </div>
          ))}

        {/* 컬럼 헤더 */}
        {columns.map((column) => {
          // 커스텀 셀 렌더링이 있으면 그것을 사용 (예: 빈 셀)
          if (render_custom_cell) {
            const custom_cell = render_custom_cell(column);
            if (custom_cell !== null) {
              return <div key={column.key}>{custom_cell}</div>;
            }
          }

          // 커스텀 헤더 클래스 가져오기
          const custom_class = get_custom_header_class
            ? get_custom_header_class(column.key)
            : "";

          // header_text 클래스가 없으면 기본 span 사용 (일부 테이블은 header_text 클래스가 없음)
          const header_text_class = styles.header_text || "";

          return (
            <div
              key={column.key}
              className={`${styles.table_header_cell} ${
                column.className || ""
              } ${custom_class}`}
            >
              {header_text_class ? (
                <span className={header_text_class}>{column.label}</span>
              ) : (
                <span>{column.label}</span>
              )}
              {/* 정렬 가능한 컬럼에 정렬 버튼 표시 */}
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
                    className={styles.sort_icon || styles.table_header_arrow}
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
      </>
    );
  };

  // table_header_row를 사용하는 경우와 사용하지 않는 경우를 구분
  if (use_header_row) {
    return (
      <div className={header_class} style={container_style}>
        <div className={styles.table_header_row}>{render_header_cells()}</div>
      </div>
    );
  } else {
    // table_header_row를 사용하지 않는 경우 (CampaignTable, BlacklistTable, PostTable 등)
    return (
      <div className={header_class} style={container_style}>
        {render_header_cells()}
      </div>
    );
  }
}
