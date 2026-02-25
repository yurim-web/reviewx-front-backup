/* ========================================
   계정 상태 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * AccountStatusFilterDropdown
 *
 * 목적: 결제 내역 페이지에서 계정 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

// 계정 상태 타입 정의
// 각 상태 설명:
// - "정상": 정상 상태
// - "일시 정지": 일시적으로 정지된 상태
// - "영구 정지": 영구적으로 정지된 상태
// - "탈퇴": 탈퇴한 상태
export type AccountStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

interface AccountStatusFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: AccountStatus[];
  on_apply: (statuses: AccountStatus[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 계정 상태 필터 옵션 배열
const account_status_options: AccountStatus[] = ["정상", "일시 정지", "영구 정지", "탈퇴"];

// 계정 상태 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<AccountStatus>[] = account_status_options.map((status) => ({
  value: status,
  label: status,
}));

export default function AccountStatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: AccountStatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<AccountStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
