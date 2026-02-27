/* ========================================
   지급 상태 필터 모달 컴포넌트 (출금 현황)
   ======================================== */

/**
 * PaymentStatusFilterModal
 *
 * 목적: 출금 현황 페이지에서 지급 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import {
  withdrawal_payment_status_filter_options,
  withdrawal_payment_status_label_map,
} from "@/data/manager_sa/common/filterOptions";

interface PaymentStatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: WithdrawalPaymentStatus[];
  on_apply: (statuses: WithdrawalPaymentStatus[]) => void;
}

const PaymentStatusFilterModalComponent = createFilterModal<WithdrawalPaymentStatus>({
  options: withdrawal_payment_status_filter_options,
  section_title: "지급",
  label_map: withdrawal_payment_status_label_map,
});

export default function PaymentStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: PaymentStatusFilterModalProps) {
  return (
    <PaymentStatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
