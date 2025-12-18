/* ========================================
   🔍 등급 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 등급 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 등급을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - ReviewerFilterSection 컴포넌트에서 등급 필터로 사용
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 등급 옵션: 서포터즈, 일반, 인플루언서
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 * 
 * ⚠️ 참고:
 * - 등급 옵션은 src/data/manager_ga/common/filterOptions.ts의
 *   reviewer_type_filter_options를 사용합니다.
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { ReviewerType } from "@/data/manager_ga/common/filterOptions";
import { reviewer_type_filter_options } from "@/data/manager_ga/common/filterOptions";

// 리뷰어 등급 타입 정의 (ReviewerType을 재export)
export type ReviewerGrade = ReviewerType;

interface GradeFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 등급들
  selected_grades: ReviewerGrade[];
  // 필터 적용 함수 (선택된 등급들을 부모 컴포넌트로 전달)
  on_apply: (grades: ReviewerGrade[]) => void;
}

// 등급 옵션을 FilterOption 형태로 변환하는 함수
// reviewer_type_filter_options를 사용하여 필터 옵션을 가져옵니다
const get_grade_options = (): FilterOption<ReviewerGrade>[] => {
  return reviewer_type_filter_options.map((grade) => ({
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
    <BaseFilterModal<ReviewerGrade>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_grades}
      on_apply={on_apply}
      options={options}
      section_title="등급"
    />
  );
}

