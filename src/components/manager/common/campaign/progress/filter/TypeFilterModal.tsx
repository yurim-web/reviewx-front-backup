/**
 * 유형 필터 모달 컴포넌트
 *
 * GA/SA 관리자 진행 현황 페이지에서 캠페인 유형을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 * - src/components/manager_sa/campaign/progress/section/FilterSection.tsx
 */

"use client";

import { createFilterModal } from "./createFilterModal";

export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

interface TypeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: CampaignType[];
  on_apply: (types: CampaignType[]) => void;
}

const type_options: CampaignType[] = [
  "배송형",
  "방문형",
  "구매평",
  "기자단",
  "미션형",
];

const TypeFilterModalComponent = createFilterModal<CampaignType>({
  options: type_options,
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
