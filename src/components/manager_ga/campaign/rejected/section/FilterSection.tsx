/* ========================================
   🔍 반려내역 필터 섹션 컴포넌트
   ======================================== */

/**
 * 반려내역 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 반려 코드 필터
 * - 검색 필터
 * - 정렬 필터
 * - 신고 필터
 *
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';
import BaseFilterSection, {
  type FilterTag,
} from '@/components/manager_ga/common/filter/BaseFilterSection';
import RejectCodeFilterModal from '../filter/RejectCodeFilterModal';
import type { RejectCode } from '@/data/manager_ga/rejected';

interface FilterSectionProps {
  // 검색어 상태와 변경 함수를 props로 받습니다
  search_query: string;
  on_search_change: (query: string) => void;
  // 선택된 반려 코드 필터 상태와 변경 함수
  selected_reject_codes?: RejectCode[];
  on_reject_codes_change?: (codes: RejectCode[]) => void;
}

export default function FilterSection({
  search_query,
  on_search_change,
  selected_reject_codes = [],
  on_reject_codes_change,
}: FilterSectionProps) {
  // 반려 코드 필터 모달 열림/닫힘 상태
  const [is_reject_code_modal_open, set_is_reject_code_modal_open] =
    useState(false);

  // 내부에서 관리하는 선택된 반려 코드들
  const [selected_codes, set_selected_codes] = useState<RejectCode[]>(
    selected_reject_codes,
  );

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>('최신순');

  // 정렬 옵션 목록
  const sort_options = ['최신순', '오래된순'];

  // 반려 코드 필터 모달 열기
  const handle_reject_code_filter_click = () => {
    set_is_reject_code_modal_open(true);
  };

  // 반려 코드 필터 모달 닫기
  const handle_reject_code_modal_close = () => {
    set_is_reject_code_modal_open(false);
  };

  // 반려 코드 필터 적용
  const handle_reject_code_apply = (codes: RejectCode[]) => {
    set_selected_codes(codes);
    on_reject_codes_change?.(codes);
  };

  // 반려 코드 태그 제거 핸들러
  const handle_remove_reject_code = (code: RejectCode) => {
    const new_codes = selected_codes.filter((c) => c !== code);
    set_selected_codes(new_codes);
    on_reject_codes_change?.(new_codes);
  };

  // 정렬 옵션 선택 핸들러
  const handle_sort_select = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 활성 필터 태그 목록 생성
  // map 함수: 배열을 순회하며 새로운 형태의 배열을 만듭니다
  const active_filter_tags: FilterTag<RejectCode>[] = selected_codes.map(
    (code) => ({
      value: code,
      label: code,
    }),
  );

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<RejectCode>
        search_query={search_query}
        on_search_change={on_search_change}
        selected_sort={selected_sort}
        on_sort_change={handle_sort_select}
        sort_options={sort_options}
        // 날짜 필터
        date_filter={
          <div className={styles.filter_item}>
            <div className={styles.filter_icon}></div>
            <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
          </div>
        }
        // 반려 코드 필터 모달 버튼
        filter_modal_button={
          <div
            className={styles.filter_item}
            onClick={handle_reject_code_filter_click}
          >
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>반려 코드</span>
            <img
              src="/images/icons/dropdown_arrow.svg"
              alt="드롭다운"
              className={styles.dropdown_arrow}
            />
          </div>
        }
        // 오른쪽 액션 버튼 (신고 필터)
        right_action_buttons={[
          <div key="report" className={styles.filter_item}>
            <img
              src="/images/icons/rerport_icon.svg"
              alt="신고"
              className={styles.report_icon}
            />
            <span className={styles.filter_text}>신고</span>
          </div>,
        ]}
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_remove_reject_code}
      />

      {/* 반려 코드 필터 모달 */}
      <RejectCodeFilterModal
        is_open={is_reject_code_modal_open}
        on_close={handle_reject_code_modal_close}
        selected_codes={selected_codes}
        on_apply={handle_reject_code_apply}
      />
    </div>
  );
}
