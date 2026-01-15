/* ========================================
   🔽 차단 코드 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 차단 코드 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 이력 페이지에서 차단 코드를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/blacklist/BlacklistFilterSection.tsx
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { BlockCode } from "@/data/manager_ga/member/blacklist";

interface BlockCodeFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_block_codes: BlockCode[];
  on_apply: (block_codes: BlockCode[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 차단 코드 필터 옵션
const block_code_options: BlockCode[] = [
  "B001",
  "B002",
  "B003",
  "B004",
  "B005",
  "B006",
  "B007",
  "B008",
  "B009",
  "B010",
];

// 차단 코드 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<BlockCode>[] = block_code_options.map(
  (code) => ({
    value: code,
    label: code,
  })
);

export default function BlockCodeFilterDropdown({
  is_open,
  on_close,
  selected_block_codes,
  on_apply,
  container_ref,
}: BlockCodeFilterDropdownProps) {
  return (
    <BaseFilterDropdown<BlockCode>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_block_codes}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
      options_list_class_name="block_code_options_list_scroll"
    />
  );
}

