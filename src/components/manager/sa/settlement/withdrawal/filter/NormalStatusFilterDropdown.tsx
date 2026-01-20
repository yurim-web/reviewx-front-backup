/* ========================================
   🔽 상태 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 상태 필터 드롭다운 컴포넌트
 *
 * 목적: 출금 현황 페이지에서 회원 상태를 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/sa/settlement/withdrawal/section/WithdrawalFilterSection.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 선택 시 즉시 적용
 * - 외부 클릭으로 닫기
 *
 * React 학습 포인트:
 * - 제네릭 타입을 사용한 재사용 가능한 컴포넌트 구조
 * - BaseFilterDropdown 공통 컴포넌트 활용
 * - 타입 안정성을 위한 TypeScript 타입 정의
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

/**
 * 회원 상태 타입 정의
 * 
 * 설명:
 * - 출금 현황 페이지에서 사용하는 회원 상태입니다.
 * - 정상, 일시 정지, 영구 정지, 탈퇴 4가지 옵션을 제공합니다.
 */
export type NormalStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

/**
 * 상태 필터 드롭다운 컴포넌트의 props 타입 정의
 * 
 * 설명:
 * - is_open: 드롭다운이 열려있는지 여부
 * - on_close: 드롭다운을 닫는 함수
 * - selected_statuses: 현재 선택된 회원 상태 배열
 * - on_apply: 필터를 적용하는 함수 (선택된 상태들을 부모 컴포넌트로 전달)
 * - container_ref: 드롭다운 위치 계산을 위한 컨테이너 ref
 */
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
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

/**
 * 상태 필터 옵션 배열
 * 
 * 설명:
 * - 출금 현황 페이지에서 필터링할 수 있는 회원 상태 목록입니다.
 * - 정상, 일시 정지, 영구 정지, 탈퇴 4가지 옵션을 제공합니다.
 */
const normal_status_options: NormalStatus[] = [
  "정상",
  "일시 정지",
  "영구 정지",
  "탈퇴",
];

/**
 * 상태 옵션을 FilterOption 형태로 변환
 * 
 * 설명:
 * - BaseFilterDropdown 컴포넌트에서 사용할 수 있는 형태로 변환합니다.
 * - value와 label이 동일한 값입니다.
 */
const filter_options: FilterOption<NormalStatus>[] = normal_status_options.map(
  (status) => ({
    value: status,
    label: status,
  })
);

/**
 * 상태 필터 드롭다운 컴포넌트
 * 
 * 설명:
 * - BaseFilterDropdown 공통 컴포넌트를 사용하여 구현합니다.
 * - 체크박스 방식으로 여러 회원 상태를 선택할 수 있습니다.
 * - 선택 시 즉시 필터가 적용됩니다.
 * 
 * React 학습 포인트:
 * - 컴포넌트 재사용: BaseFilterDropdown을 활용하여 중복 코드를 줄입니다.
 * - Props 전달: 부모 컴포넌트로부터 받은 props를 하위 컴포넌트에 전달합니다.
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

