/* ========================================
   🔽 상태 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 상태 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (리뷰어용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { ReviewerStatus } from "@/data/manager_ga/member/reviewers";
import { reviewer_status_filter_options } from "@/data/manager_ga/common/filterOptions";

interface StatusFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: ReviewerStatus[];
  on_apply: (statuses: ReviewerStatus[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 상태 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<ReviewerStatus>[] = reviewer_status_filter_options.map(
  (status) => ({
    value: status,
    label: status,
  })
);

export default function StatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: StatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<ReviewerStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
