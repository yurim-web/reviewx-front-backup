/* ========================================
   🔍 결제 수단 필터 모달 컴포넌트
   ======================================== */

/**
 * 결제 수단 필터 모달 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 결제 수단을 필터링하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import { payment_method_filter_options } from "@/data/manager_sa/common/filterOptions";

interface PaymentMethodFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 결제 수단들
  selected_methods: PaymentMethod[];
  // 필터 적용 함수 (선택된 결제 수단들을 부모 컴포넌트로 전달)
  on_apply: (methods: PaymentMethod[]) => void;
}

// 결제 수단 옵션을 FilterOption 형태로 변환하는 함수
const get_payment_method_options = (): FilterOption<PaymentMethod>[] => {
  return payment_method_filter_options.map((method) => ({
    value: method,
    label: method,
  }));
};

export default function PaymentMethodFilterModal({
  is_open,
  on_close,
  selected_methods,
  on_apply,
}: PaymentMethodFilterModalProps) {
  const options = get_payment_method_options();

  return (
    <BaseFilterModal<PaymentMethod>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_methods}
      on_apply={on_apply}
      options={options}
      section_title="결제 수단"
    />
  );
}
