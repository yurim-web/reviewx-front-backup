/* ========================================
   🔍 유형 필터 모달 컴포넌트
   ======================================== */

/**
 * 유형 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인 유형을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 유형 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 유형 옵션: 배송형, 방문형, 구매평, 기자단, 미션형
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 학습 포인트:
 * - 컴포넌트 재사용: BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드를 제거합니다
 * - 데이터 변환: type_options를 FilterOption 형태로 변환하여 공통 컴포넌트에 전달합니다
 * - 컴포지션(Composition): 작은 컴포넌트들을 조합하여 더 큰 컴포넌트를 만드는 패턴입니다
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';

// 캠페인 유형 타입 정의
export type CampaignType = '배송형' | '방문형' | '구매평' | '기자단' | '미션형';

interface TypeFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_types: CampaignType[]; // 현재 선택된 유형들
  on_apply: (types: CampaignType[]) => void; // 필터 적용 함수
}

// 유형 필터 옵션
const type_options: CampaignType[] = [
  '배송형',
  '방문형',
  '구매평',
  '기자단',
  '미션형',
];

// 유형 옵션을 FilterOption 형태로 변환하는 함수
// map 함수: 배열을 순회하며 새로운 형태의 배열을 만듭니다
const get_type_options = (): FilterOption<CampaignType>[] => {
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
  // 유형 옵션을 FilterOption 형태로 변환
  const options = get_type_options();

  // BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드 제거
  return (
    <BaseFilterModal<CampaignType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_types}
      on_apply={on_apply}
      options={options}
      section_title="유형"
    />
  );
}
