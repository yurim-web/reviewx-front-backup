/* ========================================
   🔍 유형 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 유형 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 유형을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트에서 유형 필터로 사용
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 유형 옵션: 프로모즈, 일반, 인플루언서
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

// 파트너 유형 타입 정의
export type PartnerType = "프로모즈" | "일반" | "인플루언서";

interface TypeFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 유형들
  selected_types: PartnerType[];
  // 필터 적용 함수 (선택된 유형들을 부모 컴포넌트로 전달)
  on_apply: (types: PartnerType[]) => void;
}

// 유형 필터 옵션 배열
const type_options: PartnerType[] = ["프로모즈", "일반", "인플루언서"];

// 유형 옵션을 FilterOption 형태로 변환하는 함수
const get_type_options = (): FilterOption<PartnerType>[] => {
  return type_options.map((type) => ({
    value: type,
    label: type,
  }));
};

export default function TypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: TypeFilterModalProps) {
  const options = get_type_options();

  return (
    <BaseFilterModal<PartnerType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={options}
      section_title="유형"
    />
  );
}
