/* ========================================
   🔍 공통 필터 섹션 컴포넌트 (베이스)
   ======================================== */

/**
 * 공통 필터 섹션 컴포넌트
 *
 * 목적: 여러 필터 섹션에서 공통으로 사용하는 기본 컴포넌트입니다.
 *       검색, 정렬, 필터 모달 버튼 등을 제공합니다.
 *
 * 📍 사용 위치 (현재):
 * - src/components/manager_ga/campaign/rejected/section/FilterSection.tsx
 * - src/components/manager_ga/campaign/reported/section/FilterSection.tsx
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 * - src/components/manager_ga/member/partners/section/PartnerFilterSection.tsx
 * - src/components/manager_ga/member/reviewers/section/ReviewerFilterSection.tsx
 * - src/components/manager_ga/member/blacklist/section/BlacklistFilterSection.tsx
 * - src/components/manager_ga/community/posts/section/PostFilterSection.tsx
 *
 * 📦 내부 사용 컴포넌트:
 * - src/components/manager_ga/common/filter/SortDropdown.tsx
 *
 * 주요 기능:
 * - 검색 필터
 * - 정렬 드롭다운
 * - 필터 모달 버튼
 * - 활성 필터 태그 표시
 *
 */

'use client';

import SortDropdown from './SortDropdown';
import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';

// 필터 태그 타입 정의
export interface FilterTag<T> {
  value: T;
  label: string;
}

interface BaseFilterSectionProps<T extends string | number> {
  // 검색어 상태와 변경 함수
  search_query: string;
  on_search_change: (query: string) => void;
  // 정렬 옵션
  selected_sort: string;
  on_sort_change: (sort: string) => void;
  sort_options?: string[];
  // 필터 모달 버튼 (선택적)
  filter_modal_button?: React.ReactNode;
  // 활성 필터 태그들
  active_filter_tags?: FilterTag<T>[];
  on_filter_tag_remove?: (value: T) => void;
  // 날짜 필터 (선택적)
  date_filter?: React.ReactNode;
  // 검색 필터 뒤에 올 버튼들 (선택적)
  search_after_buttons?: React.ReactNode;
  // 오른쪽 액션 버튼들 (선택적)
  right_action_buttons?: React.ReactNode[];
}

export default function BaseFilterSection<T extends string | number>({
  search_query,
  on_search_change,
  selected_sort,
  on_sort_change,
  sort_options,
  filter_modal_button,
  active_filter_tags = [],
  on_filter_tag_remove,
  date_filter,
  search_after_buttons,
  right_action_buttons = [],
}: BaseFilterSectionProps<T>) {
  return (
    <div>
      <div className={styles.filter_section}>
        {/* 왼쪽 그룹: 날짜, 필터 모달, 검색 */}
        <div className={styles.filter_group_left}>
          {/* 날짜 필터 (선택적) */}
          {date_filter && date_filter}

          {/* 필터 모달 버튼 (선택적) - 여러 개의 버튼을 Fragment로 묶어서 전달 가능 */}
          {filter_modal_button && filter_modal_button}

          {/* 검색 필터 */}
          <div className={styles.search_filter_item}>
            <img
              src="/images/icons/search_icon.svg"
              alt="검색"
              className={styles.search_icon}
            />
            <input
              type="text"
              placeholder="검색"
              value={search_query}
              onChange={(e) => on_search_change(e.target.value)}
              className={styles.search_input}
            />
          </div>

          {/* 검색 필터 뒤에 올 버튼들 (선택적) */}
          {search_after_buttons && search_after_buttons}
        </div>

        {/* 오른쪽 그룹: 액션 버튼들, 정렬 */}
        <div className={styles.filter_group_right}>
          {/* 오른쪽 액션 버튼들 */}
          {right_action_buttons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}

          {/* 정렬 드롭다운 (sort_options가 있을 때만 표시) */}
          {sort_options && sort_options.length > 0 && (
            <SortDropdown
              selected_sort={selected_sort}
              on_sort_change={on_sort_change}
              sort_options={sort_options}
            />
          )}
        </div>
      </div>

      {/* 활성 필터 태그 영역 */}
      {active_filter_tags.length > 0 && (
        <div className={styles.active_filters}>
          {active_filter_tags.map((tag) => (
            <div key={String(tag.value)} className={styles.filter_tag}>
              <span className={styles.filter_tag_text}>{tag.label}</span>
              {on_filter_tag_remove && (
                <button
                  className={styles.remove_tag}
                  onClick={() => on_filter_tag_remove(tag.value)}
                  aria-label={`${tag.label} 필터 제거`}
                >
                  <img
                    src="/images/filter/x_small.svg"
                    alt="제거"
                    className={styles.remove_icon}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
