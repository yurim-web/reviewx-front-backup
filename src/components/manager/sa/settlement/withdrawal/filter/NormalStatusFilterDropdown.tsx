/* ========================================
   🔽 상태 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 상태 필터 드롭다운 컴포넌트
 *
 * 목적: 출금 현황 페이지에서 정상/비정상 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/sa/settlement/withdrawal/section/WithdrawalFilterSection.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 선택 시 즉시 적용
 * - 외부 클릭으로 닫기
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

// 정상 상태 타입 정의
export type NormalStatus = "정상" | "비정상";

interface NormalStatusFilterDropdownProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 상태들
  selected_statuses: NormalStatus[];
  // 필터 적용 함수
  on_apply: (statuses: NormalStatus[]) => void;
  // 드롭다운 컨테이너 ref (위치 계산용)
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 상태 필터 옵션 배열
const normal_status_options: NormalStatus[] = ["정상", "비정상"];

// 상태 옵션을 FilterOption 형태로 변환하는 함수
const filter_options: FilterOption<NormalStatus>[] = normal_status_options.map(
  (status) => ({
    value: status,
    label: status,
  })
);

/**
 * 상태 필터 드롭다운 컴포넌트
 */
export default function NormalStatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: NormalStatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<NormalStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}

