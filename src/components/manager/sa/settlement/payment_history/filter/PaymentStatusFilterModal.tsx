/* ========================================
   결제 상태 필터 모달 컴포넌트 (결제 내역)
   ======================================== */

/**
 * PaymentStatusFilterModal
 *
 * 목적: 결제 내역 페이지에서 결제 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";

// 결제 상태 타입 정의
export type PaymentStatus = "완료" | "대기" | "취소";

interface PaymentStatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: PaymentStatus[];
  on_apply: (statuses: PaymentStatus[]) => void;
}

const PaymentStatusFilterModalComponent = createFilterModal<PaymentStatus>({
  options: ["완료", "대기", "취소"],
  section_title: "결제",
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
