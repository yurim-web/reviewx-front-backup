/* ========================================
   상태 필터 모달 컴포넌트 (관리자)
   ======================================== */

/**
 * StatusFilterModal
 *
 * 목적: SA 관리자 관리자 목록 페이지에서 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (SA 관리자 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { AdminStatus } from "@/data/manager_sa/member/admins";

interface StatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: AdminStatus[];
  on_apply: (statuses: AdminStatus[]) => void;
}

const StatusFilterModalComponent = createFilterModal<AdminStatus>({
  options: ["정상", "일시 정지", "영구 정지"],
  section_title: "상태",
});

export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  return (
    <StatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
