/* ========================================
   결제 수단 필터 모달 컴포넌트 (결제 내역)
   ======================================== */

/**
 * PaymentMethodFilterModal
 *
 * 목적: 결제 내역 페이지에서 결제 수단을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { PaymentMethod } from "@/data/manager_sa/common/filterOptions";
import { payment_method_filter_options } from "@/data/manager_sa/common/filterOptions";

interface PaymentMethodFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_methods: PaymentMethod[];
  on_apply: (methods: PaymentMethod[]) => void;
}

const PaymentMethodFilterModalComponent = createFilterModal<PaymentMethod>({
  options: payment_method_filter_options,
  section_title: "결제 수단",
});

export default function PaymentMethodFilterModal({
  is_open,
  on_close,
  selected_methods,
  on_apply,
}: PaymentMethodFilterModalProps) {
  return (
    <PaymentMethodFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_methods}
      on_apply={on_apply}
    />
  );
}
