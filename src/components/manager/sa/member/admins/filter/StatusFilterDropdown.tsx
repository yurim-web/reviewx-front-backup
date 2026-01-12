/* ========================================
   🔽 상태 필터 드롭다운 컴포넌트 (관리자)
   ======================================== */

/**
 * 상태 필터 드롭다운 컴포넌트 (관리자)
 *
 * 목적: SA 관리자 관리자 목록 페이지에서 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/sa/member/admins/section/AdminFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { AdminStatus } from "@/data/manager_sa/member/admins";

interface StatusFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: AdminStatus[];
  on_apply: (statuses: AdminStatus[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 상태 필터 옵션 배열
const status_options: AdminStatus[] = ["정상", "일시 정지", "영구 정지"];

// 상태 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<AdminStatus>[] = status_options.map(
  (status) => ({
    value: status,
    label: status,
  })
);

export default function StatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: StatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<AdminStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

