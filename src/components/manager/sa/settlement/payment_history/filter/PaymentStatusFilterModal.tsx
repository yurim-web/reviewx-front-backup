/* ========================================
   🔍 결제 필터 모달 컴포넌트
   ======================================== */

/**
 * 결제 필터 모달 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 결제 상태를 필터링하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

// 결제 상태 타입 정의
export type PaymentStatus = "완료" | "대기" | "취소";

interface PaymentStatusFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 결제 상태들
  selected_statuses: PaymentStatus[];
  // 필터 적용 함수 (선택된 결제 상태들을 부모 컴포넌트로 전달)
  on_apply: (statuses: PaymentStatus[]) => void;
}

// 결제 상태 필터 옵션 배열
const payment_status_options: PaymentStatus[] = ["완료", "대기", "취소"];

// 결제 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_payment_status_options = (): FilterOption<PaymentStatus>[] => {
  return payment_status_options.map((status) => ({
    value: status,
    label: status,
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
    <BaseFilterModal<PaymentStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="결제"
    />
  );
}
