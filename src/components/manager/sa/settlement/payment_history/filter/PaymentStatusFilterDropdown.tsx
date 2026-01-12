/* ========================================
   🔽 결제 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 결제 필터 드롭다운 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 결제 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/sa/settlement/payment_history/section/PaymentHistoryFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

// 결제 상태 타입 정의
export type PaymentStatus = "완료" | "대기" | "취소";

interface PaymentStatusFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: PaymentStatus[];
  on_apply: (statuses: PaymentStatus[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 결제 상태 필터 옵션 배열
const payment_status_options: PaymentStatus[] = ["완료", "대기", "취소"];

// 결제 상태 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PaymentStatus>[] =
  payment_status_options.map((status) => ({
    value: status,
    label: status,
  }));

export default function PaymentStatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: PaymentStatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<PaymentStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

