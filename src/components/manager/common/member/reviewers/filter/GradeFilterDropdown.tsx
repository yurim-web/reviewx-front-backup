/* ========================================
   🔽 등급 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 등급 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 등급을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (리뷰어용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";
import { reviewer_status_type_filter_options } from "@/data/manager_ga/common/filterOptions";

export type ReviewerGrade = ReviewerStatusType;

interface GradeFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_grades: ReviewerGrade[];
  on_apply: (grades: ReviewerGrade[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 등급 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<ReviewerGrade>[] =
  reviewer_status_type_filter_options.map((grade) => ({
    value: grade,
    label: grade,
  }));

export default function GradeFilterDropdown({
  is_open,
  on_close,
  selected_grades,
  on_apply,
  container_ref,
}: GradeFilterDropdownProps) {
  return (
    <BaseFilterDropdown<ReviewerGrade>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_grades}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
