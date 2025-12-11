/* ========================================
   🔍 공통 필터 섹션 컴포넌트 (베이스)
   ======================================== */

/**
 * 공통 필터 섹션 컴포넌트
 *
 * 목적: 여러 필터 섹션에서 공통으로 사용하는 기본 컴포넌트입니다.
 *       검색, 필터 모달 버튼 등을 제공합니다.
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
 * 주요 기능:
 * - 검색 필터
 * - 필터 모달 버튼
 * - 활성 필터 태그 표시
 *
 */

"use client";

import styles from "@/styles/manager_ga/campaign/progress/filter_section.module.css";

// 필터 태그 타입 정의
export interface FilterTag<T> {
  value: T;
  label: string;
}

interface BaseFilterSectionProps<T extends string | number> {
  // 검색어 상태와 변경 함수
  search_query: string;
  on_search_change: (query: string) => void;
  // 필터 모달 버튼 (선택적)
  filter_modal_button?: React.ReactNode;
  // 활성 필터 태그들
  active_filter_tags?: FilterTag<T>[];
  on_filter_tag_remove?: (value: T) => void;
  // 날짜 필터 (선택적)
  date_filter?: React.ReactNode;
  // 검색 필터 뒤에 올 버튼들 (선택적)
  search_after_buttons?: React.ReactNode;
  // 왼쪽에 위치할 버튼들 (선택적)
  left_buttons?: React.ReactNode;
  // 오른쪽에 위치할 버튼들 (선택적)
  right_buttons?: React.ReactNode;
}

export default function BaseFilterSection<T extends string | number>({
  search_query,
  on_search_change,
  filter_modal_button,
  active_filter_tags = [],
  on_filter_tag_remove,
  date_filter,
  search_after_buttons,
  left_buttons,
  right_buttons,
}: BaseFilterSectionProps<T>) {
  return (
    <div>
      <div className={styles.filter_section}>
        {/* 왼쪽 그룹: 왼쪽 버튼, 날짜, 필터 모달, 검색 */}
        <div className={styles.filter_group_left}>
          {/* 왼쪽에 위치할 버튼들 (선택적) */}
          {left_buttons && left_buttons}

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

        {/* 오른쪽 그룹: 오른쪽에 위치할 버튼들 (선택적) */}
        {right_buttons && (
          <div className={styles.filter_group_right}>{right_buttons}</div>
        )}
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
