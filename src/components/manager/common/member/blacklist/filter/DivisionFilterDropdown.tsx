/* ========================================
   🔽 구분 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 이력 페이지에서 구분(파트너/리뷰어/관리자)을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/blacklist/BlacklistFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { BlacklistDivision } from "@/data/manager_ga/common/filterOptions";

interface DivisionFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: BlacklistDivision[];
  on_apply: (divisions: BlacklistDivision[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 구분 필터 옵션
const division_options: BlacklistDivision[] = ["파트너", "리뷰어", "관리자"];

// 구분 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<BlacklistDivision>[] =
  division_options.map((division) => ({
    value: division,
    label: division,
  }));

export default function DivisionFilterDropdown({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
  container_ref,
}: DivisionFilterDropdownProps) {
  return (
    <BaseFilterDropdown<BlacklistDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

