/* ========================================
   🔍 신고 코드 필터 모달 컴포넌트
   ======================================== */

/**
 * 신고 코드 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지에서 신고 코드를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 신고 코드 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 신고 코드 옵션: W001 ~ W013
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';
import { report_code_info, type ReportCode } from '@/data/manager_ga/reported';

interface ReportCodeFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_codes: ReportCode[]; // 현재 선택된 신고 코드들
  on_apply: (codes: ReportCode[]) => void; // 필터 적용 함수
}

// 신고 코드 필터 옵션
const report_code_options: ReportCode[] = [
  'W001',
  'W002',
  'W003',
  'W004',
  'W005',
  'W006',
  'W007',
  'W008',
  'W009',
  'W010',
  'W011',
  'W012',
  'W013',
];

// 신고 코드 정보를 FilterOption 형태로 변환하는 함수
// map 함수: 배열을 순회하며 새로운 형태의 배열을 만듭니다
const get_report_code_options = (): FilterOption<ReportCode>[] => {
  return report_code_options.map((code) => {
    // find 함수: 배열에서 조건에 맞는 첫 번째 요소를 찾습니다
    const code_info = report_code_info.find((info) => info.code === code);
    return {
      value: code,
      // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
      label: code_info ? `${code} (${code_info.reason})` : code,
    };
  });
};

export default function ReportCodeFilterModal({
  is_open,
  on_close,
  selected_codes,
  on_apply,
}: ReportCodeFilterModalProps) {
  // 신고 코드 옵션을 FilterOption 형태로 변환
  const options = get_report_code_options();

  // BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드 제거
  return (
    <BaseFilterModal<ReportCode>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_codes}
      on_apply={on_apply}
      options={options}
      section_title="신고 코드"
    />
  );
}
