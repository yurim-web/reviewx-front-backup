/* ========================================
   구분 필터 모달 컴포넌트 (게시글)
   ======================================== */

/**
 * DivisionFilterModal
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 구분을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (GA 게시글 목록)
 * - /manager_sa/community/posts (SA 게시글 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { PostDivision } from "@/data/manager_ga/community/postsData";

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: PostDivision[];
  on_apply: (divisions: PostDivision[]) => void;
}

const DivisionFilterModalComponent = createFilterModal<PostDivision>({
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
