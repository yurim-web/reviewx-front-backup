/* ========================================
   🔍 구분 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 구분 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 구분을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PostFilterSection 컴포넌트에서 구분 필터로 사용
 * - /manager_ga/community/posts (GA 관리자 게시글 목록 페이지)
 * - /manager_sa/community/posts (SA 관리자 게시글 목록 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 구분 옵션: 공지사항, 자주 묻는 질문, 이벤트
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { PostDivision } from "@/data/manager_ga/community/postsData";

interface DivisionFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 구분들
  selected_divisions: PostDivision[];
  // 필터 적용 함수 (선택된 구분들을 부모 컴포넌트로 전달)
  on_apply: (divisions: PostDivision[]) => void;
}

// 구분 필터 옵션 배열
// value: 실제 값 (예: "공지사항")
// label: 표시할 텍스트 (예: "공지사항")
const division_options: { value: PostDivision; label: string }[] = [
  { value: "공지사항", label: "공지사항" },
  { value: "자주 묻는 질문", label: "자주 묻는 질문" },
  { value: "이벤트", label: "이벤트" },
];

// 구분 옵션을 FilterOption 형태로 변환하는 함수
// map 메서드: 배열의 각 요소를 변환하여 새로운 배열을 만듭니다
const get_division_options = (): FilterOption<PostDivision>[] => {
  return division_options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
};

export default function DivisionFilterModal({
  is_open,
  on_close,
  selected_divisions,
  on_apply,
}: DivisionFilterModalProps) {
  // 구분 옵션을 FilterOption 형태로 변환
  const options = get_division_options();

  return (
    <BaseFilterModal<PostDivision>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_divisions}
      on_apply={on_apply}
      options={options}
      section_title="구분"
    />
  );
}

