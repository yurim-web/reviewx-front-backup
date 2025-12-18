/**
 * 상태 필터 모달 컴포넌트
 *
 * GA/SA 관리자 진행 현황 페이지에서 캠페인 상태를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 * - src/components/manager_sa/campaign/progress/section/FilterSection.tsx
 */

"use client";

import { createFilterModal } from "./createFilterModal";

export type CampaignStatus =
  | "예정"
  | "신청"
  | "진행"
  | "종료"
  | "취소"
  | "긴급";

interface StatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: CampaignStatus[];
  on_apply: (statuses: CampaignStatus[]) => void;
}

const status_options: CampaignStatus[] = [
  "예정",
  "신청",
  "진행",
  "종료",
  "취소",
  "긴급",
];

const StatusFilterModalComponent = createFilterModal<CampaignStatus>({
  options: status_options,
  section_title: "상태",
});

export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  return (
    <StatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
