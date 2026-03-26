/* ========================================
   구분 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 카테고리 목록 페이지에서 구분을 필터링하는 드롭다운입니다.
 *
 * 사용 위치:
 * - src/components/manager/common/community/categories/section/CategoryFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { CategoryDivision } from "@/lib/api/categories";

interface DivisionFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: CategoryDivision[];
  on_apply: (divisions: CategoryDivision[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
  manager_type?: "ga" | "sa";
}

// GA 구분 필터 옵션 (백엔드 enum 기준: NOTICE, QUESTIONS)
const ga_filter_options: FilterOption<CategoryDivision>[] = [
  { value: "NOTICE", label: "공지사항" },
  { value: "QUESTIONS", label: "자주 묻는 질문" },
];

// SA 구분 필터 옵션 (백엔드 enum 기준: NOTICE, FAQ, EVENT)
const sa_filter_options: FilterOption<CategoryDivision>[] = [
  { value: "NOTICE", label: "공지사항" },
  { value: "FAQ", label: "자주 묻는 질문" },
  { value: "EVENT", label: "이벤트" },
];

export default function DivisionFilterDropdown({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
  container_ref,
  manager_type = "ga",
}: DivisionFilterDropdownProps) {
  const filter_options = manager_type === "sa" ? sa_filter_options : ga_filter_options;

  return (
    <BaseFilterDropdown<CategoryDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
