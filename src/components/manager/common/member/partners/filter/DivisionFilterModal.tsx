/* ========================================
   구분 필터 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * DivisionFilterModal
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 구분(법인/개인)을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 파트너 목록)
 * - /manager_sa/member/partners (SA 파트너 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { PartnerDivision } from "@/data/manager_ga/member/partners";

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: PartnerDivision[];
  on_apply: (divisions: PartnerDivision[]) => void;
}

const DivisionFilterModalComponent = createFilterModal<PartnerDivision>({
  options: ["법인", "개인"],
  section_title: "구분",
});

export default function DivisionFilterModal({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
}: DivisionFilterModalProps) {
  return (
    <DivisionFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
    />
  );
}
