/* ========================================
   🔍 구분 필터 모달 컴포넌트
   ======================================== */

/**
 * 구분 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 차단 이력 페이지에서 구분(파트너/리뷰어/관리자)을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - BlacklistFilterSection 컴포넌트에서 구분 필터로 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 구분 옵션: 파트너, 리뷰어, 관리자
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager/ga/common/filter/BaseFilterModal';
import type { BlacklistDivision } from '@/data/manager_ga/member/blacklist';

interface DivisionFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_divisions: BlacklistDivision[];
  on_apply: (divisions: BlacklistDivision[]) => void;
}

// 구분 필터 옵션
const division_options: BlacklistDivision[] = ['파트너', '리뷰어', '관리자'];

// 구분 옵션을 FilterOption 형태로 변환하는 함수
const get_division_options = (): FilterOption<BlacklistDivision>[] => {
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
    <BaseFilterModal<BlacklistDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={options}
      section_title="구분"
    />
  );
}
