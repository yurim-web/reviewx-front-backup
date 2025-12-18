/* ========================================
   🔍 차단 코드 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 차단 코드 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 이력 페이지에서 차단 코드를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - BlacklistFilterSection 컴포넌트에서 차단 코드 필터로 사용
 * - /manager_ga/member/blacklist (GA 관리자 차단 이력 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 이력 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 차단 코드 옵션: B001 ~ B010
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { BlockCode } from "@/data/manager_ga/member/blacklist";

interface BlockCodeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_block_codes: BlockCode[];
  on_apply: (block_codes: BlockCode[]) => void;
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

// 차단 코드 옵션을 FilterOption 형태로 변환하는 함수
const get_block_code_options = (): FilterOption<BlockCode>[] => {
  return block_code_options.map((code) => ({
    value: code,
    label: code,
  }));
};

export default function BlockCodeFilterModal({
  is_open,
  on_close,
  selected_block_codes,
  on_apply,
}: BlockCodeFilterModalProps) {
  const options = get_block_code_options();

  return (
    <BaseFilterModal<BlockCode>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_block_codes}
      on_apply={on_apply}
      options={options}
      section_title="차단 코드"
    />
  );
}
