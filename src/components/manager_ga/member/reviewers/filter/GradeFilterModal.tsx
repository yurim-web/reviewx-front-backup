/* ========================================
   🔍 등급 필터 모달 컴포넌트
   ======================================== */

/**
 * 등급 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 등급을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - ReviewerFilterSection 컴포넌트의 등급 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 등급 옵션: 모범 회원, 주의 회원, 경고 회원, 이용 제한 회원
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';
import type { ReviewerStatusType } from '@/data/manager_ga/member/reviewers';

interface GradeFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_grades: ReviewerStatusType[];
  on_apply: (grades: ReviewerStatusType[]) => void;
}

// 등급 필터 옵션
const grade_options: ReviewerStatusType[] = [
  '모범 회원',
  '주의 회원',
  '경고 회원',
  '이용 제한 회원',
];

// 등급 옵션을 FilterOption 형태로 변환하는 함수
const get_grade_options = (): FilterOption<ReviewerStatusType>[] => {
  return grade_options.map((grade) => ({
    value: grade,
    label: grade,
  }));
};

export default function GradeFilterModal({
  is_open,
  on_close,
  selected_grades,
  on_apply,
}: GradeFilterModalProps) {
  const options = get_grade_options();

  return (
    <BaseFilterModal<ReviewerStatusType>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_grades}
      on_apply={on_apply}
      options={options}
      section_title="등급"
    />
  );
}

