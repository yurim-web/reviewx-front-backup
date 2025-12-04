/* ========================================
   🔍 구분 필터 모달 컴포넌트
   ======================================== */

/**
 * 구분 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 구분(법인/개인)을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트에서 구분 필터로 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 구분 옵션: 법인, 개인
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager/ga/common/filter/BaseFilterModal';
import type { PartnerDivision } from '@/data/manager_ga/member/partners';

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: PartnerDivision[];
  on_apply: (divisions: PartnerDivision[]) => void;
}

// 구분 필터 옵션
const division_options: PartnerDivision[] = ['법인', '개인'];

// 구분 옵션을 FilterOption 형태로 변환하는 함수
const get_division_options = (): FilterOption<PartnerDivision>[] => {
  return division_options.map((division) => ({
    value: division,
    label: division,
  }));
};

export default function DivisionFilterModal({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
}: DivisionFilterModalProps) {
  const options = get_division_options();

  return (
    <BaseFilterModal<PartnerDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={options}
      section_title="구분"
    />
  );
}
