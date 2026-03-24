/* ========================================
   구분 필터 모달 컴포넌트 (카테고리)
   ======================================== */

/**
 * DivisionFilterModal
 *
 * 목적: GA/SA 관리자 카테고리 목록 페이지에서 구분을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/community/categories (GA 카테고리 관리)
 * - /manager_sa/community/categories (SA 카테고리 관리)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { CategoryDivision } from "@/lib/api/categories";

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: CategoryDivision[];
  on_apply: (divisions: CategoryDivision[]) => void;
}

const DivisionFilterModalComponent = createFilterModal<CategoryDivision>({
  options: ["NOTICE", "QUESTIONS"],
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
