/* ========================================
   🔽 유형 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 유형 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 유형을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (파트너용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { PartnerStatusType } from "@/data/manager_ga/common/filterOptions";
import { partner_status_type_filter_options } from "@/data/manager_ga/common/filterOptions";

// 파트너 유형 타입 정의 (PartnerStatusType을 재export)
export type PartnerType = PartnerStatusType;

interface TypeFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: PartnerType[];
  on_apply: (types: PartnerType[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 유형 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<PartnerType>[] =
  partner_status_type_filter_options.map((type) => ({
    value: type,
    label: type,
  }));

export default function TypeFilterDropdown({
  is_open,
  on_close,
  selected_types,
  on_apply,
  container_ref,
}: TypeFilterDropdownProps) {
  return (
    <BaseFilterDropdown<PartnerType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

