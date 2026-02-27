/* ========================================
   차단 코드 필터 모달 컴포넌트 (차단 이력)
   ======================================== */

/**
 * BlockCodeFilterModal
 *
 * 목적: GA/SA 관리자 차단 이력 페이지에서 차단 코드를 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (GA 차단 이력)
 * - /manager_sa/member/blacklist (SA 차단 이력)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { BlockCode } from "@/data/manager_ga/member/blacklist";

interface BlockCodeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_block_codes: BlockCode[];
  on_apply: (block_codes: BlockCode[]) => void;
}

const BlockCodeFilterModalComponent = createFilterModal<BlockCode>({
  options: ["B001", "B002", "B003", "B004", "B005", "B006", "B007", "B008", "B009", "B010"],
  section_title: "차단 코드",
});

export default function BlockCodeFilterModal({
  is_open,
  on_close,
  selected_block_codes,
  on_apply,
}: BlockCodeFilterModalProps) {
  return (
    <BlockCodeFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_block_codes}
      on_apply={on_apply}
    />
  );
}
