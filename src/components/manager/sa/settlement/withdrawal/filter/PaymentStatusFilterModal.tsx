/* ========================================
   🔍 지급 필터 모달 컴포넌트
   ======================================== */

/**
 * 지급 필터 모달 컴포넌트
 *
 * 목적: 출금 현황 페이지에서 지급 상태를 필터링하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import {
  withdrawal_payment_status_filter_options,
  withdrawal_payment_status_label_map,
} from "@/data/manager_sa/common/filterOptions";

interface PaymentStatusFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 지급 상태들
  selected_statuses: WithdrawalPaymentStatus[];
  // 필터 적용 함수 (선택된 지급 상태들을 부모 컴포넌트로 전달)
  on_apply: (statuses: WithdrawalPaymentStatus[]) => void;
}

// 지급 상태 옵션을 FilterOption 형태로 변환하는 함수
// withdrawal_payment_status_filter_options를 사용하여 필터 옵션을 가져옵니다
const get_payment_status_options = (): FilterOption<WithdrawalPaymentStatus>[] => {
  return withdrawal_payment_status_filter_options.map((status) => ({
    value: status,
    label: withdrawal_payment_status_label_map[status],
  }));
};

export default function PaymentStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: PaymentStatusFilterModalProps) {
  const options = get_payment_status_options();

  return (
    <BaseFilterModal<WithdrawalPaymentStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="지급"
    />
  );
}
