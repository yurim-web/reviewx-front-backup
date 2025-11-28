/* ========================================
   🔍 상태 필터 모달 컴포넌트
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 상태를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트의 상태 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 상태 옵션: 정상, 일시 정지, 영구 정지
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';
import type { PartnerStatus } from '@/data/manager_ga/member/partners';

interface StatusFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_statuses: PartnerStatus[];
  on_apply: (statuses: PartnerStatus[]) => void;
}

// 상태 필터 옵션
const status_options: PartnerStatus[] = ['정상', '일시 정지', '영구 정지'];

// 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_status_options = (): FilterOption<PartnerStatus>[] => {
  return status_options.map((status) => ({
    value: status,
    label: status,
  }));
};

export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  const options = get_status_options();

  return (
    <BaseFilterModal<PartnerStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="상태"
    />
  );
}

