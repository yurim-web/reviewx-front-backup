/* ========================================
   구분(법인/개인) 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * BusinessTypeFilterDropdown
 *
 * 목적: 결제 내역 페이지에서 구분(법인/개인)을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

// 구분 타입 정의
export type BusinessType = "법인" | "개인";

interface BusinessTypeFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: BusinessType[];
  on_apply: (types: BusinessType[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 구분 필터 옵션 배열
const business_type_options: BusinessType[] = ["법인", "개인"];

// 구분 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<BusinessType>[] = business_type_options.map((type) => ({
  value: type,
  label: type,
}));

export default function BusinessTypeFilterDropdown({
  is_open,
  on_close,
  selected_types,
  on_apply,
  container_ref,
}: BusinessTypeFilterDropdownProps) {
  return (
    <BaseFilterDropdown<BusinessType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
