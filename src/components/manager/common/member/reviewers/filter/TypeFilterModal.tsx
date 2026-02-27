/* ========================================
   유형 필터 모달 컴포넌트 (리뷰어)
   ======================================== */

/**
 * TypeFilterModal
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 유형을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 리뷰어 목록)
 * - /manager_sa/member/reviewers (SA 리뷰어 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";
import { reviewer_status_type_filter_options } from "@/data/manager_ga/common/filterOptions";

// 리뷰어 유형 타입 정의 (ReviewerStatusType을 재export)
export type ReviewerType = ReviewerStatusType;

interface TypeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: ReviewerType[];
  on_apply: (types: ReviewerType[]) => void;
}

const TypeFilterModalComponent = createFilterModal<ReviewerType>({
  options: reviewer_status_type_filter_options,
  section_title: "유형",
});

export default function TypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: TypeFilterModalProps) {
  return (
    <TypeFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
    />
  );
}
