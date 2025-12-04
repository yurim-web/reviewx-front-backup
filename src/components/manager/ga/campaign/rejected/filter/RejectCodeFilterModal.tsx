/* ========================================
   🔍 반려 코드 필터 모달 컴포넌트
   ======================================== */

/**
 * 반려 코드 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 반려 이력 페이지에서 반려 코드를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트에서 반려 코드 필터로 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 반려 코드 옵션: R001 ~ R008
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 *
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager/ga/common/filter/BaseFilterModal';
import { reject_code_info, type RejectCode } from '@/data/manager_ga/rejected';

interface RejectCodeFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_codes: RejectCode[]; // 현재 선택된 반려 코드들
  on_apply: (codes: RejectCode[]) => void; // 필터 적용 함수
}

// 반려 코드 필터 옵션
const reject_code_options: RejectCode[] = [
  'R001',
  'R002',
  'R003',
  'R004',
  'R005',
  'R006',
  'R007',
  'R008',
];

// 반려 코드 정보를 FilterOption 형태로 변환하는 함수
// map 함수: 배열을 순회하며 각 요소를 변환한 새로운 배열을 만듭니다
const get_reject_code_options = (): FilterOption<RejectCode>[] => {
  return reject_code_options.map((code) => {
    // find 함수: 배열에서 조건에 맞는 첫 번째 요소를 찾습니다
    const code_info = reject_code_info.find((info) => info.code === code);
    return {
      value: code,
      // 삼항 연산자: 조건이 참일 때 ? 참값 : 거짓값
      label: code_info ? `${code} (${code_info.reason})` : code,
    };
  });
};

export default function RejectCodeFilterModal({
  is_open,
  on_close,
  selected_codes,
  on_apply,
}: RejectCodeFilterModalProps) {
  // 반려 코드 옵션을 FilterOption 형태로 변환
  const options = get_reject_code_options();

  // BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드 제거
  return (
    <BaseFilterModal<RejectCode>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_codes}
      on_apply={on_apply}
      options={options}
      section_title="반려 코드"
    />
  );
}
