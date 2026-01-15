/* ========================================
   🔽 구분 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 구분을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/community/posts/section/PostFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { PostDivision } from "@/data/manager_ga/community/postsData";

interface DivisionFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: PostDivision[];
  on_apply: (divisions: PostDivision[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 구분 필터 옵션 배열
const division_options: { value: PostDivision; label: string }[] = [
  { value: "공지사항", label: "공지사항" },
  { value: "자주 묻는 질문", label: "자주 묻는 질문" },
  { value: "이벤트", label: "이벤트" },
];

// 구분 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PostDivision>[] = division_options.map(
  (option) => ({
    value: option.value,
    label: option.label,
  })
);

export default function DivisionFilterDropdown({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
  container_ref,
}: DivisionFilterDropdownProps) {
  return (
    <BaseFilterDropdown<PostDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

