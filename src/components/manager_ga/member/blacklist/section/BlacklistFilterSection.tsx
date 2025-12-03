/* ========================================
   🔍 차단 내역 필터 섹션 컴포넌트
   ======================================== */

/**
 * 차단 내역 필터 섹션 컴포넌트
 *
 * 목적: 차단 내역 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (차단 내역 페이지)
 *
 * 주요 기능:
 * - 선택 기간 조회 필터
 * - 구분 필터 (파트너/리뷰어/관리자)
 * - 차단 코드 필터
 * - 검색 필터
 * - 정렬 필터 (최신순)
 * - 해제 버튼
 *
 * 학습 포인트:
 * - 이벤트 핸들러: onClick으로 버튼 클릭 이벤트를 처리합니다
 * - 상태 관리: useState를 사용하여 필터 상태를 관리합니다
 * - 조건부 렌더링: 선택된 필터에 따라 UI를 변경합니다
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/member/blacklist/blacklist_filter_section.module.css';
import BaseFilterSection, {
  type FilterTag,
} from '@/components/manager_ga/common/filter/BaseFilterSection';
import DivisionFilterModal from '@/components/manager_ga/member/blacklist/filter/DivisionFilterModal';
import BlockCodeFilterModal from '@/components/manager_ga/member/blacklist/filter/BlockCodeFilterModal';
import type {
  BlacklistDivision,
  BlockCode,
} from '@/data/manager_ga/member/blacklist';

interface BlacklistFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
}

export default function BlacklistFilterSection({
  search_query,
  on_search_change,
}: BlacklistFilterSectionProps) {
  // 모달 열림/닫힘 상태 관리
  const [is_division_modal_open, set_is_division_modal_open] = useState(false);
  const [is_block_code_modal_open, set_is_block_code_modal_open] =
    useState(false);
  const [is_period_checkbox_checked, set_is_period_checkbox_checked] =
    useState(false);

  // 선택된 필터 상태 관리
  const [selected_divisions, set_selected_divisions] = useState<
    BlacklistDivision[]
  >([]);
  const [selected_block_codes, set_selected_block_codes] = useState<
    BlockCode[]
  >([]);
  const [selected_sort, set_selected_sort] = useState('최신순');

  // 구분 필터 핸들러
  const handle_division_apply = (divisions: BlacklistDivision[]) => {
    set_selected_divisions(divisions);
  };

  const handle_remove_division = (division: BlacklistDivision) => {
    set_selected_divisions(selected_divisions.filter((d) => d !== division));
  };

  // 차단 코드 필터 핸들러
  const handle_block_code_apply = (block_codes: BlockCode[]) => {
    set_selected_block_codes(block_codes);
  };

  const handle_remove_block_code = (block_code: BlockCode) => {
    set_selected_block_codes(
      selected_block_codes.filter((c) => c !== block_code),
    );
  };

  // 해제 버튼 핸들러
  const handle_unblock = () => {
    // TODO: 선택된 차단 내역 해제 기능 구현
  };

  // 정렬 옵션
  const sort_options = ['최신순', '오래된순'];

  // 정렬 옵션 선택 핸들러
  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_divisions.map((division) => ({
      value: division,
      label: `구분: ${division}`,
    })),
    ...selected_block_codes.map((block_code) => ({
      value: block_code,
      label: `차단 코드: ${block_code}`,
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    if (selected_divisions.includes(value as BlacklistDivision)) {
      handle_remove_division(value as BlacklistDivision);
    } else if (selected_block_codes.includes(value as BlockCode)) {
      handle_remove_block_code(value as BlockCode);
    }
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        selected_sort={selected_sort}
        on_sort_change={handle_sort_change}
        sort_options={sort_options}
        // 선택 기간 조회 필터 (date_filter로 전달)
        date_filter={
          <div className={styles.period_filter_item}>
            <input
              type="checkbox"
              checked={is_period_checkbox_checked}
              onChange={(e) => set_is_period_checkbox_checked(e.target.checked)}
              className={styles.period_checkbox}
            />
            <span className={styles.filter_text}>선택 기간 조회</span>
          </div>
        }
        // 필터 모달 버튼들
        filter_modal_button={
          <>
            {/* 구분 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_division_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_divisions.length > 0
                    ? styles.checkbox_icon_checked
                    : ''
                }`}
              ></div>
              <span className={styles.filter_text}>구분</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            {/* 차단 코드 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_block_code_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_block_codes.length > 0
                    ? styles.checkbox_icon_checked
                    : ''
                }`}
              ></div>
              <span className={styles.filter_text}>차단 코드</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>
          </>
        }
        // 오른쪽 액션 버튼 (해제)
        right_action_buttons={[
          <div
            key="unblock"
            className={styles.filter_item}
            onClick={handle_unblock}
          >
            <img
              src="/images/icons/clear_icon.svg"
              alt="해제"
              className={styles.unblock_icon}
            />
            <span className={styles.filter_text}>해제</span>
          </div>,
        ]}
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 필터 모달들 */}
      <DivisionFilterModal
        is_open={is_division_modal_open}
        on_close={() => set_is_division_modal_open(false)}
        selected_divisions={selected_divisions}
        on_apply={handle_division_apply}
      />

      <BlockCodeFilterModal
        is_open={is_block_code_modal_open}
        on_close={() => set_is_block_code_modal_open(false)}
        selected_block_codes={selected_block_codes}
        on_apply={handle_block_code_apply}
      />
    </div>
  );
}
