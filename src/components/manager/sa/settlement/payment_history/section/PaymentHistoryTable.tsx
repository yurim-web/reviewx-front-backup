/* ========================================
   📋 결제 내역 테이블 컴포넌트
   ======================================== */

/**
 * 결제 내역 테이블 컴포넌트
 *
 * 목적: 결제 내역 페이지의 결제 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 *
 * 주요 기능:
 * - 체크박스로 결제 항목 선택/해제
 * - 전체 선택/해제 기능
 * - 결제 정보 표시 (번호, 상호명, 입금자명, 구분, 결제 수단, 세금계산서, 충전 포인트, 결제, 신청일, 승인일, 유형, 상태)
 *
 * 기술 스택:
 * - CommonTable: 범용 테이블 컴포넌트를 사용하여 테이블 구조 제공
 * - Render Props 패턴: render_cell 함수를 통해 각 셀을 커스텀 렌더링
 */

"use client";

import { useState, useEffect } from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
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
  // 선택된 항목 ID 배열 관리
  // useState: React의 상태 관리 훅입니다. 컴포넌트의 상태를 관리하고 상태가 변경되면 컴포넌트를 다시 렌더링합니다.
  // string[]: 문자열 배열 타입입니다. 선택된 항목의 ID들을 배열로 저장합니다.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 결제 내역 데이터 상태
  // 초기값은 Mock 데이터(paymentHistoryList)를 사용하여 서버와 클라이언트의 초기 렌더링을 일치시킵니다.
  // 클라이언트 마운트 후 useEffect에서 LocalStorage 데이터를 병합한 실제 리스트로 교체합니다.
  const [paymentHistory, setPaymentHistory] =
    useState<PaymentHistoryItem[]>(paymentHistoryList);

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
    initial_direction: "asc", // 오름차순
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
  // row: 현재 행의 데이터, column: 현재 컬럼 정보, index: 행 인덱스
  // Render Props 패턴: 함수를 props로 전달하여 컴포넌트의 렌더링 로직을 커스터마이징하는 패턴입니다.
  const render_cell = (
    row: PaymentHistoryTableRowData,
    column: TableColumn
  ) => {
    // switch 문: 여러 조건에 따라 다른 코드를 실행하는 제어문입니다.
    switch (column.key) {
      case "number":
        return <span className={styles.cell_text}>{row.number}</span>;
      case "companyName":
        // 상호명 열: 두 줄로 표시
        // 첫 번째 줄: 상호명 + 다운로드 아이콘
        // 두 번째 줄: 사업자등록번호 · 사업자명
        // 학습 포인트:
        // - flexbox 레이아웃: display: flex를 사용하여 요소들을 가로로 배치합니다
        // - flex-direction: column: 요소들을 세로로 배치합니다
        // - button: 클릭 가능한 버튼 요소입니다
        // - img: 이미지 요소입니다
        // - onClick 이벤트 핸들러: 버튼 클릭 시 실행할 함수를 지정합니다
        // - stopPropagation(): 이벤트 버블링을 방지하여 부모 요소의 이벤트가 실행되지 않도록 합니다
        // - aria-label: 접근성을 위한 레이블입니다
        return (
          <div className={styles.company_name_container}>
            <div className={styles.company_name_row}>
              <span className={styles.cell_text}>{row.companyName}</span>
              <button
                className={styles.download_button}
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: 사업자 정보 다운로드 기능 구현
                  // alert: 브라우저에서 제공하는 기본 알림 창을 띄우는 함수입니다
                  alert("사업자 정보 다운로드 기능은 준비 중입니다.");
                }}
                aria-label={`${row.companyName} 사업자 정보 다운로드`}
              >
                <img
                  // 구분(businessType)에 따라 다른 아이콘 표시
                  // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
                  // row.businessType이 "법인"이면 table_download.svg, "개인"이면 table_download_grey.svg 사용
                  src={
                    row.businessType === "법인"
                      ? "/images/management_page/table/table_download.svg"
                      : "/images/management_page/table/table_download_grey.svg"
                  }
                  alt="다운로드"
                  className={styles.download_icon}
                />
              </button>
            </div>
            <span className={styles.business_info_text}>
              {row.businessInfo.registrationNumber} · {row.businessInfo.representativeName}
            </span>
          </div>
        );
      case "depositorName":
        // 입금자명 열: 입금자명만 표시
        // depositorName은 문자열 타입입니다
        return <span className={styles.cell_text}>{row.depositorName}</span>;
      case "businessType":
        // BusinessTypeTag 컴포넌트를 사용하여 사업자 구분 태그 표시
        return (
          <BusinessTypeTag type={row.businessType as BusinessType} />
        );
      case "paymentMethod":
        // PaymentMethodTag 컴포넌트를 사용하여 결제 수단 태그 표시
        return (
          <PaymentMethodTag method={row.paymentMethod as PaymentMethod} />
        );
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
        
        // 카드 결제인 경우 "-" 표시
        if (row.paymentMethod === "카드 결제") {
          return <span className={styles.cell_text}>-</span>;
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
            return <span className={styles.cell_text}>{row.taxInvoiceType}</span>;
          }

          return (
            <div className={styles.tax_invoice_container}>
              <span className={styles.cell_text}>{main_text}</span>
              <span className={styles.cell_text}>{parentheses_text}</span>
            </div>
          );
        }
        // 괄호가 없는 경우: 한 줄로 표시
        return <span className={styles.cell_text}>{row.taxInvoiceType}</span>;
      case "chargedPoints":
        // 충전 포인트 열: 충전 포인트와 보유 포인트를 세로로 표시
        return (
          <div className={styles.charged_points_container}>
            <span className={styles.cell_text}>{row.chargedPoints}</span>
            <span className={styles.cell_text_secondary}>
              보유 {row.heldPoints}
            </span>
          </div>
        );
      case "paymentStatus":
        // 결제 상태 열: 결제 상태 태그 표시
        return (
          <PaymentStatusTag status={row.paymentStatus as PaymentStatus} />
        );
      case "requestDate":
        return <span className={styles.cell_text}>{row.requestDate}</span>;
      case "approvalDate":
        return <span className={styles.cell_text}>{row.approvalDate}</span>;
      case "memberType":
        return <span className={styles.cell_text}>{row.memberType}</span>;
      case "accountStatus":
        // 계정 상태 열: 회원 상태 태그 표시
        return (
          <MemberStatusTag
            status={row.accountStatus as MemberStatus}
          />
        );
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

  return (
    <CommonTable<PaymentHistoryTableRowData>
      columns={columns}
      data={sorted_payment_history_list as PaymentHistoryTableRowData[]}
      render_cell={render_cell}
      styles={styles}
      enable_checkbox={true}
      selected_ids={selectedIds}
      on_select_change={setSelectedIds}
      on_select_all={handle_select_all}
      render_header={render_table_header}
      empty_message="결제 내역이 없습니다."
    />
  );
}
