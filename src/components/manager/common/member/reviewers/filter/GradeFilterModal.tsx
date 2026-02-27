/* ========================================
   등급 필터 모달 컴포넌트 (리뷰어)
   ======================================== */

/**
 * GradeFilterModal
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 등급을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 리뷰어 목록)
 * - /manager_sa/member/reviewers (SA 리뷰어 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { ReviewerType } from "@/data/manager_ga/common/filterOptions";
import { reviewer_type_filter_options } from "@/data/manager_ga/common/filterOptions";

// 리뷰어 등급 타입 정의 (ReviewerType을 재export)
export type ReviewerGrade = ReviewerType;

interface GradeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_grades: ReviewerGrade[];
  on_apply: (grades: ReviewerGrade[]) => void;
}

const GradeFilterModalComponent = createFilterModal<ReviewerGrade>({
  options: reviewer_type_filter_options,
  section_title: "등급",
});

export default function GradeFilterModal({
  is_open,
  on_close,
  selected_grades,
  on_apply,
}: GradeFilterModalProps) {
  return (
    <GradeFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_grades}
      on_apply={on_apply}
    />
  );
}
