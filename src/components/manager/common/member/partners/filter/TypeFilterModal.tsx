/* ========================================
   유형 필터 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * TypeFilterModal
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 유형을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 파트너 목록)
 * - /manager_sa/member/partners (SA 파트너 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { PartnerStatusType } from "@/data/manager_ga/common/filterOptions";
import { partner_status_type_filter_options } from "@/data/manager_ga/common/filterOptions";

// 파트너 유형 타입 정의 (PartnerStatusType을 재export)
export type PartnerType = PartnerStatusType;

interface TypeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: PartnerType[];
  on_apply: (types: PartnerType[]) => void;
}

const TypeFilterModalComponent = createFilterModal<PartnerType>({
  options: partner_status_type_filter_options,
  section_title: "유형",
});

export default function TypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: TypeFilterModalProps) {
  return (
    <TypeFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
    />
  );
}
