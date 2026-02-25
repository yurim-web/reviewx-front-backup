/* ========================================
   🔽 구분 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 구분을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (리뷰어용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { ReviewerType } from "@/data/manager_ga/common/filterOptions";
import { reviewer_type_filter_options } from "@/data/manager_ga/common/filterOptions";

export type ReviewerGrade = ReviewerType;

interface GradeFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_grades?: ReviewerGrade[];
  selected_divisions?: ReviewerGrade[];
  on_apply: (grades: ReviewerGrade[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 구분 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<ReviewerGrade>[] = reviewer_type_filter_options.map((grade) => ({
  value: grade,
  label: grade,
}));

export default function GradeFilterDropdown({
  is_open,
  on_close,
  selected_grades,
  selected_divisions,
  on_apply,
  container_ref,
}: GradeFilterDropdownProps) {
  const selected_values = selected_grades ?? selected_divisions ?? [];
  return (
    <BaseFilterDropdown<ReviewerGrade>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_values}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
