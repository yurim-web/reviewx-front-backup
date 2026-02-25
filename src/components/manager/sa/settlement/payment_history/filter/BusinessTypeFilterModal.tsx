/* ========================================
   🔍 구분 필터 모달 컴포넌트
   ======================================== */

/**
 * 구분 필터 모달 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 구분(법인/개인)을 필터링하는 모달입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

// 구분 타입 정의
export type BusinessType = "법인" | "개인";

interface BusinessTypeFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 구분들
  selected_types: BusinessType[];
  // 필터 적용 함수 (선택된 구분들을 부모 컴포넌트로 전달)
  on_apply: (types: BusinessType[]) => void;
}

// 구분 필터 옵션 배열
const business_type_options: BusinessType[] = ["법인", "개인"];

// 구분 옵션을 FilterOption 형태로 변환하는 함수
const get_business_type_options = (): FilterOption<BusinessType>[] => {
  return business_type_options.map((type) => ({
    value: type,
    label: type,
  }));
};

export default function BusinessTypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: BusinessTypeFilterModalProps) {
  const options = get_business_type_options();

  return (
    <BaseFilterModal<BusinessType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={options}
      section_title="구분"
    />
  );
}
