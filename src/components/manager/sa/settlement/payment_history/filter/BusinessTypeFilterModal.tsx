/* ========================================
   구분 필터 모달 컴포넌트 (결제 내역)
   ======================================== */

/**
 * BusinessTypeFilterModal
 *
 * 목적: 결제 내역 페이지에서 구분(법인/개인)을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";

// 구분 타입 정의
export type BusinessType = "법인" | "개인";

interface BusinessTypeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: BusinessType[];
  on_apply: (types: BusinessType[]) => void;
}

const BusinessTypeFilterModalComponent = createFilterModal<BusinessType>({
  options: ["법인", "개인"],
  section_title: "구분",
});

export default function BusinessTypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: BusinessTypeFilterModalProps) {
  return (
    <BusinessTypeFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
    />
  );
}
