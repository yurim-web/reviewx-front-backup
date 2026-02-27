/* ========================================
   구분 필터 모달 컴포넌트 (차단 이력)
   ======================================== */

/**
 * DivisionFilterModal
 *
 * 목적: GA/SA 관리자 차단 이력 페이지에서 구분(리뷰어/파트너/관리자)을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (GA 차단 이력)
 * - /manager_sa/member/blacklist (SA 차단 이력)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { BlacklistDivision } from "@/data/manager_ga/common/filterOptions";

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: BlacklistDivision[];
  on_apply: (divisions: BlacklistDivision[]) => void;
}

const DivisionFilterModalComponent = createFilterModal<BlacklistDivision>({
  options: ["리뷰어", "파트너", "관리자"],
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
