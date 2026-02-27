/* ========================================
   상태 필터 모달 컴포넌트 (출금 현황)
   ======================================== */

/**
 * NormalStatusFilterModal
 *
 * 목적: 출금 현황 페이지에서 정상/비정상 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";

// 정상 상태 타입 정의
export type NormalStatus = "정상" | "비정상";

interface NormalStatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: NormalStatus[];
  on_apply: (statuses: NormalStatus[]) => void;
}

const NormalStatusFilterModalComponent = createFilterModal<NormalStatus>({
  options: ["정상", "비정상"],
  section_title: "상태",
});

export default function NormalStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: NormalStatusFilterModalProps) {
  return (
    <NormalStatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
