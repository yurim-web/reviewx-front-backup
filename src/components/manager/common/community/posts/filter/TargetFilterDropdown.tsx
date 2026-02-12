/* ========================================
   🔽 대상 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 대상 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 대상을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/community/posts/section/PostFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { PostTarget } from "@/data/manager_ga/community/postsData";

interface TargetFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_targets: PostTarget[];
  on_apply: (targets: PostTarget[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 대상 필터 옵션 배열 (전체, 리뷰어, 파트너만)
const target_options: { value: PostTarget; label: string }[] = [
  { value: "전체", label: "전체" },
  { value: "리뷰어", label: "리뷰어" },
  { value: "파트너", label: "파트너" },
];

// 대상 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PostTarget>[] = target_options.map(
  (option) => ({
    value: option.value,
    label: option.label,
  })
);

export default function TargetFilterDropdown({
  is_open,
  on_close,
  selected_targets,
  on_apply,
  container_ref,
}: TargetFilterDropdownProps) {
  return (
    <BaseFilterDropdown<PostTarget>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_targets || []}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

