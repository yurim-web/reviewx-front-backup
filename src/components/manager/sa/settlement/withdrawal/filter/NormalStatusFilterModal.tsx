/* ========================================
   🔍 상태 필터 모달 컴포넌트
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트
 *
 * 목적: 출금 현황 페이지에서 정상/비정상 상태를 필터링하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황 페이지)
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

// 정상 상태 타입 정의
export type NormalStatus = "정상" | "비정상";

interface NormalStatusFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 상태들
  selected_statuses: NormalStatus[];
  // 필터 적용 함수 (선택된 상태들을 부모 컴포넌트로 전달)
  on_apply: (statuses: NormalStatus[]) => void;
}

// 상태 필터 옵션 배열
const normal_status_options: NormalStatus[] = ["정상", "비정상"];

// 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_normal_status_options = (): FilterOption<NormalStatus>[] => {
  return normal_status_options.map((status) => ({
    value: status,
    label: status,
  }));
};

export default function NormalStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: NormalStatusFilterModalProps) {
  const options = get_normal_status_options();

  return (
    <BaseFilterModal<NormalStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="상태"
    />
  );
}
