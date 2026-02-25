/* ========================================
   🔽 지급 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 지급 필터 드롭다운 컴포넌트
 *
 * 목적: 출금 현황 페이지에서 지급 상태를 필터링하는 드롭다운입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { WithdrawalPaymentStatus } from "@/data/manager_sa/common/filterOptions";
import {
  withdrawal_payment_status_filter_options,
  withdrawal_payment_status_label_map,
} from "@/data/manager_sa/common/filterOptions";

interface PaymentStatusFilterDropdownProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 지급 상태들
  selected_statuses: WithdrawalPaymentStatus[];
  // 필터 적용 함수
  on_apply: (statuses: WithdrawalPaymentStatus[]) => void;
  // 드롭다운 컨테이너 ref (위치 계산용)
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 지급 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_payment_status_options = (): FilterOption<WithdrawalPaymentStatus>[] => {
  return withdrawal_payment_status_filter_options.map((status) => ({
    value: status,
    label: withdrawal_payment_status_label_map[status],
  }));
};

/**
 * 지급 필터 드롭다운 컴포넌트
 */
export default function PaymentStatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: PaymentStatusFilterDropdownProps) {
  const options = get_payment_status_options();

  return (
    <BaseFilterDropdown<WithdrawalPaymentStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      container_ref={container_ref}
    />
  );
}
