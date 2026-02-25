/* ========================================
   세금계산서 발행 유형 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * TaxInvoiceTypeFilterDropdown
 *
 * 목적: 결제 내역 페이지에서 세금계산서 발행 유형을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

// 세금계산서 발행 유형 타입 정의
// 각 유형 설명:
// - "세금계산서": 세금계산서 발행
// - "현금영수증 (소득공제)": 현금영수증 발행 (소득공제용)
// - "현금영수증 (지출증빙)": 현금영수증 발행 (지출증빙용)
// - "미발행": 세금계산서/현금영수증 미발행
export type TaxInvoiceType =
  | "세금계산서"
  | "현금영수증 (소득공제)"
  | "현금영수증 (지출증빙)"
  | "미발행";

interface TaxInvoiceTypeFilterDropdownProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 세금계산서 발행 유형 목록
  selected_types: TaxInvoiceType[];
  // 세금계산서 발행 유형 선택 적용 함수
  on_apply: (types: TaxInvoiceType[]) => void;
  // 드롭다운 컨테이너 참조 (외부 클릭 감지용)
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 세금계산서 발행 유형 필터 옵션 배열
// 학습 포인트:
// - const: 상수로 선언하여 값이 변경되지 않음을 보장합니다
// - as const: 배열을 readonly로 만들어 타입 안정성을 높입니다
const tax_invoice_type_options: TaxInvoiceType[] = [
  "세금계산서",
  "현금영수증 (소득공제)",
  "현금영수증 (지출증빙)",
  "미발행",
];

// 세금계산서 발행 유형 옵션을 FilterOption 형태로 변환
// 학습 포인트:
// - map(): 배열의 각 요소를 변환하여 새로운 배열을 생성합니다
// - 화살표 함수: (type) => ({ value: type, label: type })
// - 객체 리터럴: { value, label } 형태로 객체를 반환합니다
const filter_options: FilterOption<TaxInvoiceType>[] = tax_invoice_type_options.map((type) => ({
  value: type,
  label: type,
}));

/**
 * 세금계산서 발행 필터 드롭다운 컴포넌트
 *
 * BaseFilterDropdown을 사용하여 세금계산서 발행 유형 필터링 기능을 제공합니다.
 * 체크박스 방식의 다중 선택 필터링을 지원합니다.
 */
export default function TaxInvoiceTypeFilterDropdown({
  is_open,
  on_close,
  selected_types,
  on_apply,
  container_ref,
}: TaxInvoiceTypeFilterDropdownProps) {
  // BaseFilterDropdown 컴포넌트 사용
  // 학습 포인트:
  // - 제네릭 타입: <TaxInvoiceType>으로 타입을 지정합니다
  // - props 전달: BaseFilterDropdown에 필요한 props를 전달합니다
  // - container_ref: 외부 클릭 감지를 위해 ref를 전달합니다
  return (
    <BaseFilterDropdown<TaxInvoiceType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
