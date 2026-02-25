/* ========================================
   🔽 상태 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 상태 필터 드롭다운 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 현황 페이지에서 캠페인 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치 (임시):
 * - src/components/manager/common/campaign/progress/section/CampaignProgressFilterSection.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 선택 시 즉시 적용
 * - 외부 클릭으로 닫기
 *
 * React 핵심 개념:
 * - props: 부모 컴포넌트에서 전달받는 데이터
 * - 제네릭 타입: BaseFilterDropdown에서 사용하는 제네릭 타입
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

export type CampaignStatus = "예정" | "신청" | "진행" | "종료" | "취소" | "긴급";

interface StatusFilterDropdownProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 상태들
  selected_statuses: CampaignStatus[];
  // 필터 적용 함수
  on_apply: (statuses: CampaignStatus[]) => void;
  // 드롭다운 컨테이너 ref (위치 계산용)
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 상태 옵션 목록
const status_options: CampaignStatus[] = ["예정", "긴급", "신청", "진행", "종료"];

// FilterOption 배열로 변환
// map 함수: 배열을 순회하며 각 요소를 FilterOption 형태로 변환합니다
const filter_options: FilterOption<CampaignStatus>[] = status_options.map((status) => ({
  value: status,
  label: status,
}));

/**
 * 상태 필터 드롭다운 컴포넌트
 *
 * @param props - StatusFilterDropdownProps 타입의 props
 * @returns 상태 필터 드롭다운 JSX 요소
 */
export default function StatusFilterDropdown({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
  container_ref,
}: StatusFilterDropdownProps) {
  return (
    <BaseFilterDropdown<CampaignStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
