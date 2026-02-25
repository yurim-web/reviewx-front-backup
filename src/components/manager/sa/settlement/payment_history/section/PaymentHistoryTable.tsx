/* ========================================
   결제 내역 테이블 컴포넌트
   ======================================== */

/**
 * PaymentHistoryTable
 *
 * 목적: 결제 내역 페이지의 결제 목록을 테이블 형태로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";
import type { TableColumn, TableRowData } from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/payment_history/payment_history_table.module.css";
import {
  paymentHistoryList,
  getPaymentHistoryList,
  type PaymentHistoryItem,
} from "@/data/manager_sa/settlement/paymentHistoryData";
import PaymentMethodTag from "@/components/manager/common/tags/PaymentMethodTag";
import type { PaymentMethod } from "@/components/manager/common/tags/PaymentMethodTag";
import BusinessTypeTag from "@/components/manager/common/tags/BusinessTypeTag";
import type { BusinessType } from "@/components/manager/common/tags/BusinessTypeTag";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import type { MemberStatus } from "@/components/manager/common/tags/MemberStatusTag";
import PaymentStatusTag from "@/components/manager/common/tags/PaymentStatusTag";
import type { PaymentStatus } from "@/components/manager/common/tags/PaymentStatusTag";
import ManagerReceiptLookupModal from "@/components/manager/sa/settlement/payment_history/modal/ManagerReceiptLookupModal";
import ManagerRefundAccountModal from "@/components/manager/sa/settlement/payment_history/modal/ManagerRefundAccountModal";

// PaymentHistoryItem을 TableRowData로 확장
interface PaymentHistoryTableRowData extends TableRowData, PaymentHistoryItem {}

import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import type { AccountStatus } from "@/components/manager/sa/settlement/payment_history/filter/AccountStatusFilterDropdown";
import type { TaxInvoiceType } from "@/components/manager/sa/settlement/payment_history/filter/TaxInvoiceTypeFilterDropdown";
import type { MemberType } from "@/components/manager/sa/settlement/payment_history/filter/MemberTypeFilterDropdown";

interface PaymentHistoryTableProps {
  search_query?: string;
  selected_date_range?: DateRange | undefined;
  selected_business_types?: BusinessType[];
  selected_payment_methods?: PaymentMethod[];
  selected_tax_invoice_types?: TaxInvoiceType[];
  selected_payment_statuses?: PaymentStatus[];
  selected_member_types?: MemberType[];
  selected_account_statuses?: AccountStatus[];
}

export default function PaymentHistoryTable({
  search_query = "",
  selected_date_range,
  selected_business_types = [],
  selected_payment_methods = [],
  selected_tax_invoice_types = [],
  selected_payment_statuses = [],
  selected_member_types = [],
  selected_account_statuses = [],
}: PaymentHistoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** 상호명 ... 메뉴 열린 행 ID (null이면 닫힘) */
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  /** 드롭다운 위치 (Portal fixed용) */
  const [dropdownRect, setDropdownRect] = useState<{ left: number; top: number } | null>(null);
  /** 거래명세서 조회 모달에 넘길 행 */
  const [receiptModalItem, setReceiptModalItem] = useState<PaymentHistoryItem | null>(null);
  /** 환불 계좌 조회 모달에 넘길 행 */
  const [refundAccountModalItem, setRefundAccountModalItem] = useState<PaymentHistoryItem | null>(
    null
  );
  const menu_wrapper_ref = useRef<HTMLDivElement | null>(null);
  /** 드롭다운 위치 갱신용: 메뉴가 열린 행의 트리거 버튼 */
  const menu_trigger_button_ref = useRef<HTMLButtonElement | null>(null);

  /** 드롭다운 위치 계산: 가로는 원래대로(트리거 왼쪽 기준), 하단 여유 없을 때만 위로 열기 */
  const get_dropdown_position = (trigger_rect: DOMRect) => {
    const DROPDOWN_ESTIMATED_HEIGHT = 145;
    const GAP = 4;
    const HORIZONTAL_PADDING = 8;
    const MIN_DROPDOWN_WIDTH = 163;
    /** 위로 열릴 때 트리거에서 너무 멀지 않게 살짝 아래로 내림 */
    const OPEN_ABOVE_OFFSET_DOWN = 24;
    const space_below =
      typeof window !== "undefined" ? window.innerHeight - trigger_rect.bottom - GAP : 0;
    const open_above = space_below < DROPDOWN_ESTIMATED_HEIGHT;
    const top = open_above
      ? trigger_rect.top - DROPDOWN_ESTIMATED_HEIGHT - GAP + OPEN_ABOVE_OFFSET_DOWN
      : trigger_rect.bottom + GAP;
    let left = trigger_rect.left;
    if (typeof window !== "undefined") {
      const max_left = window.innerWidth - MIN_DROPDOWN_WIDTH - HORIZONTAL_PADDING;
      if (left > max_left) left = max_left;
      if (left < HORIZONTAL_PADDING) left = HORIZONTAL_PADDING;
    }
    return { left, top };
  };

  // 결제 내역 데이터 상태
  // 초기값은 Mock 데이터(paymentHistoryList)를 사용하여 서버와 클라이언트의 초기 렌더링을 일치시킵니다.
  // 클라이언트 마운트 후 useEffect에서 LocalStorage 데이터를 병합한 실제 리스트로 교체합니다.
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(paymentHistoryList);

  /**
   * 클라이언트 마운트 후 결제 내역 데이터 로드
   *
   * 설명:
   * - Hydration 에러를 방지하기 위해 서버 렌더링 시에는 paymentHistoryList(고정된 Mock 데이터)만 사용합니다.
   * - 클라이언트 마운트 후에만 getPaymentHistoryList()를 호출하여
   *   LocalStorage에 저장된 결제 내역과 Mock 데이터를 병합합니다.
   * - 이렇게 하면 서버와 클라이언트의 초기 HTML이 동일하게 유지되어 Hydration mismatch가 발생하지 않습니다.
   */
  useEffect(() => {
    const merged_list = getPaymentHistoryList();
    setPaymentHistory(merged_list);
  }, []);

  /** 상호명 ... 메뉴 외부 클릭 시 닫기 */
  useEffect(() => {
    if (openMenuRowId === null) return;
    const handle_click_outside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menu_wrapper_ref.current?.contains(target)) return;
      if (target.closest?.(`[data-dropdown-menu="payment-history-company-menu"]`)) return;
      setOpenMenuRowId(null);
      setDropdownRect(null);
    };
    document.addEventListener("mousedown", handle_click_outside);
    return () => document.removeEventListener("mousedown", handle_click_outside);
  }, [openMenuRowId]);

  /** 스크롤/리사이즈 시 드롭다운 위치를 트리거 버튼에 맞춰 갱신 (뷰포트 안으로 유지) */
  useEffect(() => {
    if (openMenuRowId === null) return;
    const trigger = menu_trigger_button_ref.current;
    if (!trigger) return;

    const update_position = () => {
      const rect = trigger.getBoundingClientRect();
      setDropdownRect(get_dropdown_position(rect));
    };

    const scroll_parents: Element[] = [];
    let el: Element | null = trigger.parentElement;
    while (el) {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = el;
      if (scrollHeight > clientHeight || scrollWidth > clientWidth) {
        el.addEventListener("scroll", update_position, { passive: true });
        scroll_parents.push(el);
      }
      el = el.parentElement;
    }
    window.addEventListener("scroll", update_position, { passive: true });
    window.addEventListener("resize", update_position);

    return () => {
      window.removeEventListener("scroll", update_position);
      window.removeEventListener("resize", update_position);
      scroll_parents.forEach((parent) => parent.removeEventListener("scroll", update_position));
    };
  }, [openMenuRowId]);

  // 컬럼별 타입 설정 (정렬을 위한 컬럼 타입 정의)
  // numeric_string: 숫자처럼 보이는 문자열 (예: "1,500,000", "999999")
  // date: 날짜 형식의 문자열 (예: "2025-08-01 18:56")
  // string: 일반 문자열
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    companyName: "string",
    businessType: "string",
    chargedPoints: "numeric_string",
    paymentStatus: "string",
    requestDate: "date",
    approvalDate: "date",
  };

  // 검색어 및 필터로 필터링된 결제 내역 목록
  const filtered_payment_history_list = paymentHistory.filter((item) => {
    // 검색어 필터
    // 학습 포인트:
    // - includes() 메서드: 문자열에 특정 문자열이 포함되어 있는지 확인합니다
    // - toLowerCase() 메서드: 문자열을 소문자로 변환하여 대소문자 구분 없이 검색합니다
    // - 검색 대상: 상호명, 입금자명, 사업자등록번호, 사업자명
    if (search_query) {
      const search_lower = search_query.toLowerCase();
      const matches_search =
        item.companyName.toLowerCase().includes(search_lower) ||
        item.depositorName.toLowerCase().includes(search_lower) ||
        item.businessInfo.registrationNumber.toLowerCase().includes(search_lower) ||
        item.businessInfo.representativeName.toLowerCase().includes(search_lower);
      if (!matches_search) return false;
    }

    // 날짜 범위 필터 (신청일 기준)
    if (selected_date_range?.from && selected_date_range?.to) {
      const item_date_str = item.requestDate.split(" ")[0]; // "2025-08-05"
      const item_date = new Date(item_date_str);
      const start_date = new Date(selected_date_range.from);
      const end_date = new Date(selected_date_range.to);
      start_date.setHours(0, 0, 0, 0);
      end_date.setHours(23, 59, 59, 999);
      item_date.setHours(0, 0, 0, 0);
      if (item_date < start_date || item_date > end_date) return false;
    }

    // 구분 필터
    if (selected_business_types.length > 0) {
      if (!selected_business_types.includes(item.businessType)) return false;
    }

    // 결제 수단 필터
    if (selected_payment_methods.length > 0) {
      if (!selected_payment_methods.includes(item.paymentMethod)) return false;
    }

    // 세금계산서 발행 필터
    // 학습 포인트:
    // - filter() 메서드: 배열을 순회하며 조건에 맞는 요소만 남깁니다
    // - taxInvoiceType 값이 선택된 유형 목록에 포함되어 있는지 확인합니다
    // - "세금계산서", "현금영수증 (소득공제)", "현금영수증 (지출증빙)", "미발행" 중 하나입니다
    if (selected_tax_invoice_types.length > 0) {
      // 선택된 유형 목록에 해당 항목의 유형이 없으면 필터링 제외
      if (!selected_tax_invoice_types.includes(item.taxInvoiceType)) {
        return false;
      }
    }

    // 결제 상태 필터
    if (selected_payment_statuses.length > 0) {
      if (!selected_payment_statuses.includes(item.paymentStatus)) return false;
    }

    // 회원 유형 필터
    // 학습 포인트:
    // - 데이터의 memberType("모범 회원", "주의 회원", "이용 제한 회원")을
    //   필터 옵션("일반 회원", "주의 회원", "이용 제한 회원")으로 매핑합니다
    // - "모범 회원"을 "일반 회원"으로 변환합니다
    if (selected_member_types.length > 0) {
      // item.memberType을 MemberType으로 변환
      // "모범 회원" -> "일반 회원"으로 매핑
      const item_member_type: MemberType | null =
        item.memberType === "모범 회원"
          ? "일반 회원"
          : item.memberType === "주의 회원"
            ? "주의 회원"
            : item.memberType === "이용 제한 회원"
              ? "이용 제한 회원"
              : null;

      // 선택된 유형 목록에 해당 항목의 유형이 없으면 필터링 제외
      if (!item_member_type || !selected_member_types.includes(item_member_type)) {
        return false;
      }
    }

    // 계정 상태 필터
    // 학습 포인트:
    // - 데이터의 accountStatus("정상", "일시정지", "영구정지", "탈퇴")를
    //   필터 옵션("정상", "일시 정지", "영구 정지", "탈퇴")으로 매핑합니다
    // - "일시정지"를 "일시 정지"로, "영구정지"를 "영구 정지"로 변환합니다
    if (selected_account_statuses.length > 0) {
      // item.accountStatus를 AccountStatus로 변환
      // 데이터에서는 띄어쓰기 없이 되어 있지만 필터에서는 띄어쓰기가 있습니다
      const item_account_status: AccountStatus | null =
        item.accountStatus === "정상"
          ? "정상"
          : item.accountStatus === "일시정지"
            ? "일시 정지"
            : item.accountStatus === "영구정지"
              ? "영구 정지"
              : item.accountStatus === "탈퇴"
                ? "탈퇴"
                : null;

      // 선택된 상태 목록에 해당 항목의 상태가 없으면 필터링 제외
      if (!item_account_status || !selected_account_statuses.includes(item_account_status)) {
        return false;
      }
    }

    return true;
  });

  // 정렬 훅 사용 (정렬 상태와 정렬된 데이터 관리)
  // useTableSort: 테이블 정렬 기능을 제공하는 커스텀 훅입니다.
  // sort_state: 현재 정렬 상태 (어떤 컬럼이 정렬되었는지, 오름차순/내림차순)
  // handle_sort: 정렬을 처리하는 함수
  // sorted_data: 정렬된 데이터 배열
  // 페이지 로드 시 "번호" 컬럼 기준 오름차순으로 기본 정렬
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_payment_history_list,
  } = useTableSort({
    data: filtered_payment_history_list,
    initial_column_key: "number", // 기본 정렬: 번호 컬럼
    initial_direction: "desc", // 번호 최신순
    column_config,
  });

  // 테이블 컬럼 정의
  // key: 데이터 필드명, label: 헤더에 표시될 텍스트, sortable: 정렬 가능 여부, className: CSS 클래스명
  const columns: TableColumn[] = [
    {
      key: "number",
      label: "번호",
      sortable: true,
      className: styles.table_cell_number,
    },
    {
      key: "companyName",
      label: "상호명",
      sortable: true,
      className: styles.table_cell_company_name,
    },
    {
      key: "depositorName",
      label: "입금자명",
      className: styles.table_cell_depositor,
    },
    {
      key: "businessType",
      label: "구분",
      sortable: false,
      className: styles.table_cell_business_type,
    },
    {
      key: "paymentMethod",
      label: "결제 수단",
      className: styles.table_cell_payment_method,
    },
    {
      key: "taxInvoiceType",
      label: "발행",
      className: styles.table_cell_tax_invoice,
    },
    {
      key: "chargedPoints",
      label: "충전 포인트",
      sortable: true,
      className: styles.table_cell_charged_points,
    },
    {
      key: "paymentStatus",
      label: "결제",

      className: styles.table_cell_payment_status,
    },
    {
      key: "requestDate",
      label: "신청일",
      sortable: true,
      className: styles.table_cell_request_date,
    },
    {
      key: "approvalDate",
      label: "승인일",
      sortable: true,
      className: styles.table_cell_approval_date,
    },
    {
      key: "memberType",
      label: "유형",
      className: styles.table_cell_member_type,
    },
    {
      key: "accountStatus",
      label: "상태",
      className: styles.table_cell_account_status,
    },
  ];

  // 커스텀 헤더 렌더링 (정렬 기능 포함)
  // SortableTableHeader 공통 컴포넌트를 사용하여 헤더 렌더링
  // 헤더에서 "충전 포인트" 텍스트와 화살표 아이콘이 가로 한 줄로 배치되도록 커스텀 클래스 적용
  const render_table_header = () => {
    // 전체 선택 상태 확인
    // sorted_payment_history_list.length: 정렬된 데이터의 길이
    // selectedIds.length === sorted_payment_history_list.length: 선택된 항목 수가 전체 항목 수와 같으면 전체 선택 상태
    const is_all_selected =
      sorted_payment_history_list.length > 0 &&
      selectedIds.length === sorted_payment_history_list.length;

    // 전체 선택/해제 핸들러
    const handle_select_all = () => {
      if (is_all_selected) {
        // 전체 해제: 빈 배열로 설정
        setSelectedIds([]);
      } else {
        // 전체 선택: 모든 항목의 ID를 배열로 설정
        // map: 배열의 각 요소를 변환하여 새로운 배열을 만드는 메서드입니다.
        setSelectedIds(sorted_payment_history_list.map((item) => item.id));
      }
    };

    // 특정 컬럼에 커스텀 헤더 클래스를 추가하는 함수
    // "충전 포인트" 컬럼에 가로 정렬 클래스 적용
    const get_custom_header_class = (column_key: string) => {
      if (column_key === "chargedPoints") {
        return styles.table_header_cell_charged_points;
      }
      return "";
    };

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={is_all_selected}
        styles={styles}
        get_custom_header_class={get_custom_header_class}
      />
    );
  };

  // 각 셀 렌더링 함수 (Render Props 패턴)
  // row: 현재 행의 데이터, column: 현재 컬럼 정의
  // Render Props 패턴: 함수를 props로 전달하여 컴포넌트의 렌더링 로직을 커스터마이징하는 패턴입니다.
  // 툴팁이 적용되는 텍스트 셀은 span으로 감싸지 않고 직접 반환 (CommonTableWithTooltip이 자동으로 처리)
  const render_cell = (row: PaymentHistoryTableRowData, column: TableColumn) => {
    // switch 문: 여러 조건에 따라 다른 코드를 실행하는 제어문입니다.
    switch (column.key) {
      case "number":
        return row.number;
      case "companyName": {
        // 상호명 열: 상호명 + ... 아이콘 (클릭 시 드롭다운은 Portal로 body에 렌더)
        const is_menu_open = openMenuRowId === row.id;
        return (
          <div className={styles.company_name_container}>
            <div
              className={styles.company_name_menu_wrapper}
              ref={(el) => {
                if (is_menu_open) menu_wrapper_ref.current = el;
              }}
            >
              <span className={styles.cell_text}>{row.companyName}</span>
              <button
                ref={(el) => {
                  if (is_menu_open) menu_trigger_button_ref.current = el;
                }}
                type="button"
                className={styles.menu_trigger_button}
                onClick={(e) => {
                  e.stopPropagation();
                  const btn = e.currentTarget as HTMLButtonElement;
                  const rect = btn.getBoundingClientRect();
                  if (openMenuRowId === row.id) {
                    setOpenMenuRowId(null);
                    setDropdownRect(null);
                  } else {
                    setDropdownRect(get_dropdown_position(rect));
                    setOpenMenuRowId(row.id);
                  }
                }}
                aria-label={`${row.companyName} 메뉴`}
                aria-expanded={is_menu_open}
                aria-haspopup="menu"
              >
                <Image
                  src="/images/management_page/table/more_icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.menu_trigger_icon}
                />
              </button>
            </div>
            <span className={styles.business_info_text}>
              {row.businessInfo.registrationNumber} · {row.businessInfo.representativeName}
            </span>
          </div>
        );
      }
      case "depositorName":
        // 입금자명 열: 입금자명만 표시
        // depositorName은 문자열 타입입니다
        return row.depositorName;
      case "businessType":
        // BusinessTypeTag 컴포넌트를 사용하여 사업자 구분 태그 표시
        return <BusinessTypeTag type={row.businessType as BusinessType} />;
      case "paymentMethod":
        // PaymentMethodTag 컴포넌트를 사용하여 결제 수단 태그 표시
        return <PaymentMethodTag method={row.paymentMethod as PaymentMethod} />;
      case "taxInvoiceType":
        // 발행 열: 세금계산서 발행 유형 표시
        // 카드 결제인 경우 "-" 표시 (카드 결제는 세금계산서 발행 불가)
        // taxInvoiceType은 "세금계산서", "현금영수증 (소득공제)", "현금영수증 (지출증빙)", "미발행" 중 하나입니다
        // 학습 포인트:
        // - includes() 메서드: 문자열에 특정 문자열이 포함되어 있는지 확인합니다
        // - 조건부 렌더링: 괄호가 있는 경우 두 줄로 표시하고, 없는 경우 한 줄로 표시합니다
        // - split() 메서드: 문자열을 특정 구분자로 나눕니다
        // - map() 메서드: 배열의 각 요소를 변환합니다
        // - fragment(<></>): 여러 요소를 그룹화합니다 (불필요한 DOM 요소 추가 없음)

        // 카드 결제 또는 포인트 충전인 경우 "-" 표시
        if (row.paymentMethod === "카드 결제" || row.paymentMethod === "포인트 충전") {
          return "-";
        }

        const has_parentheses = row.taxInvoiceType.includes("(");
        if (has_parentheses) {
          // 괄호가 있는 경우: "현금영수증"과 "(소득공제)" 또는 "(지출증빙)" 사이에서 줄바꿈
          // 예: "현금영수증 (소득공제)" -> "현금영수증" / "(소득공제)"
          const parts = row.taxInvoiceType.split(" (");
          const main_text = parts[0]; // "현금영수증" 또는 "발행"
          const parentheses_text = parts[1] ? "(" + parts[1] : ""; // "(소득공제)" 또는 "(지출증빙)" 또는 빈 문자열

          // parts[1]이 없으면 한 줄로 표시
          if (!parts[1]) {
            return row.taxInvoiceType;
          }

          return (
            <div className={styles.tax_invoice_container}>
              <span className={styles.cell_text}>{main_text}</span>
              <span className={styles.cell_text}>{parentheses_text}</span>
            </div>
          );
        }
        // 괄호가 없는 경우: 한 줄로 표시
        return row.taxInvoiceType;
      case "chargedPoints":
        // 충전 포인트 열: 충전 포인트와 보유 포인트를 세로로 표시
        return (
          <div className={styles.charged_points_container}>
            <span className={styles.cell_text}>{row.chargedPoints}</span>
            <span className={styles.cell_text_secondary}>보유 {row.heldPoints}</span>
          </div>
        );
      case "paymentStatus":
        // 결제 상태 열: 결제 상태 태그 표시
        return <PaymentStatusTag status={row.paymentStatus as PaymentStatus} />;
      case "requestDate":
        return row.requestDate;
      case "approvalDate":
        return row.approvalDate;
      case "memberType":
        return row.memberType;
      case "accountStatus":
        // 계정 상태 열: 회원 상태 태그 표시
        return <MemberStatusTag status={row.accountStatus as MemberStatus} />;
      default:
        return null;
    }
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = (is_all_selected: boolean) => {
    if (is_all_selected) {
      // 전체 선택: 모든 항목의 ID를 배열로 설정
      // sorted_payment_history_list: 정렬된 데이터를 사용
      setSelectedIds(sorted_payment_history_list.map((item) => item.id));
    } else {
      // 전체 해제: 빈 배열로 설정
      setSelectedIds([]);
    }
  };

  const tooltip_config: TooltipConfig = { column_key: "all" };

  /** 열린 메뉴의 행 데이터 (Portal 드롭다운용) */
  const menu_row =
    openMenuRowId != null
      ? (sorted_payment_history_list.find((r) => r.id === openMenuRowId) as
          | PaymentHistoryItem
          | undefined)
      : null;

  return (
    <>
      <CommonTableWithTooltip<PaymentHistoryTableRowData>
        columns={columns}
        data={sorted_payment_history_list as PaymentHistoryTableRowData[]}
        tooltip_config={tooltip_config}
        render_cell={render_cell}
        styles={styles}
        enable_checkbox={true}
        selected_ids={selectedIds}
        on_select_change={setSelectedIds}
        on_select_all={handle_select_all}
        render_header={render_table_header}
        empty_message="결제 내역이 없습니다."
      />
      {typeof document !== "undefined" &&
        openMenuRowId != null &&
        dropdownRect != null &&
        menu_row != null &&
        createPortal(
          <div
            data-dropdown-menu="payment-history-company-menu"
            className={styles.company_name_dropdown_portal}
            style={{
              position: "fixed",
              left: dropdownRect.left,
              top: dropdownRect.top,
              zIndex: 9999,
            }}
            role="menu"
          >
            <button
              type="button"
              className={styles.company_name_dropdown_item}
              role="menuitem"
              onClick={() => {
                setOpenMenuRowId(null);
                setDropdownRect(null);
                alert("아직 구현 중입니다.");
              }}
            >
              사업자등록증 다운로드
            </button>
            <button
              type="button"
              className={styles.company_name_dropdown_item}
              role="menuitem"
              onClick={() => {
                setOpenMenuRowId(null);
                setDropdownRect(null);
                setReceiptModalItem(menu_row);
              }}
            >
              거래명세서 조회
            </button>
            <button
              type="button"
              className={styles.company_name_dropdown_item}
              role="menuitem"
              onClick={() => {
                setOpenMenuRowId(null);
                setDropdownRect(null);
                setRefundAccountModalItem(menu_row);
              }}
            >
              환불 계좌 조회
            </button>
          </div>,
          document.body
        )}
      <ManagerReceiptLookupModal
        is_open={receiptModalItem !== null}
        on_close={() => setReceiptModalItem(null)}
        item={receiptModalItem}
      />
      <ManagerRefundAccountModal
        is_open={refundAccountModalItem !== null}
        on_close={() => setRefundAccountModalItem(null)}
        item={refundAccountModalItem}
      />
    </>
  );
}
