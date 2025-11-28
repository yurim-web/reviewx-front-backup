/* ========================================
   🔍 유형 필터 모달 컴포넌트
   ======================================== */

/**
 * 유형 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 유형을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트의 유형 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 유형 옵션: 서포터즈, 일반, 인플루언서
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';

// 파트너 유형 타입 정의 (리뷰어와 동일하게 사용)
export type PartnerType = '서포터즈' | '일반' | '인플루언서';

interface TypeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_types: PartnerType[];
  on_apply: (types: PartnerType[]) => void;
}

// 유형 필터 옵션
const type_options: PartnerType[] = ['서포터즈', '일반', '인플루언서'];

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
