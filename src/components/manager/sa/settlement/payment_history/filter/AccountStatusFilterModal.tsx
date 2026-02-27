/* ========================================
   계정 상태 필터 모달 컴포넌트 (결제 내역)
   ======================================== */

/**
 * AccountStatusFilterModal
 *
 * 목적: 결제 내역 페이지에서 계정 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";

// 계정 상태 타입 정의
export type AccountStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

interface AccountStatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: AccountStatus[];
  on_apply: (statuses: AccountStatus[]) => void;
}

const AccountStatusFilterModalComponent = createFilterModal<AccountStatus>({
  options: ["정상", "일시 정지", "영구 정지", "탈퇴"],
  section_title: "상태",
});

export default function AccountStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: AccountStatusFilterModalProps) {
  return (
    <AccountStatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
