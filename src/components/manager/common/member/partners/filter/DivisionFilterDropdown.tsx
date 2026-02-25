/* ========================================
   🔽 구분 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 구분(법인/개인)을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (파트너용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { PartnerDivision } from "@/data/manager_ga/member/partners";

interface DivisionFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: PartnerDivision[];
  on_apply: (divisions: PartnerDivision[]) => void;
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 구분 필터 옵션 배열
const division_options: PartnerDivision[] = ["법인", "개인"];

// 구분 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PartnerDivision>[] = division_options.map((division) => ({
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
    <BaseFilterDropdown<PartnerDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
