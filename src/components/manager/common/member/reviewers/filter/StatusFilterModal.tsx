/* ========================================
   상태 필터 모달 컴포넌트 (리뷰어)
   ======================================== */

/**
 * StatusFilterModal
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 상태를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 리뷰어 목록)
 * - /manager_sa/member/reviewers (SA 리뷰어 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { ReviewerStatus } from "@/data/manager_ga/member/reviewers";
import { reviewer_status_filter_options } from "@/data/manager_ga/common/filterOptions";

interface StatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: ReviewerStatus[];
  on_apply: (statuses: ReviewerStatus[]) => void;
}

const StatusFilterModalComponent = createFilterModal<ReviewerStatus>({
  options: reviewer_status_filter_options,
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
