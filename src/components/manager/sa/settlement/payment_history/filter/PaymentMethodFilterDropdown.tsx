/* ========================================
   🔽 결제 수단 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 결제 수단 필터 드롭다운 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 결제 수단을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/sa/settlement/payment_history/section/PaymentHistoryFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import { payment_method_filter_options } from "@/data/manager_sa/common/filterOptions";

interface PaymentMethodFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_methods: PaymentMethod[];
  on_apply: (methods: PaymentMethod[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 결제 수단 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PaymentMethod>[] =
  payment_method_filter_options.map((method) => ({
    value: method,
    label: method,
  }));

export default function PaymentMethodFilterDropdown({
  is_open,
  on_close,
  selected_methods,
  on_apply,
  container_ref,
}: PaymentMethodFilterDropdownProps) {
  return (
    <BaseFilterDropdown<PaymentMethod>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_methods}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

