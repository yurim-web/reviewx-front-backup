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
 * - src/components/manager/ga/campaign/rejected/section/CampaignRejectedFilterSection.tsx
 * - src/components/manager/ga/campaign/reported/section/CampaignReportedFilterSection.tsx
 * - src/components/manager/common/campaign/progress/ProgressPageCommon.tsx
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (파트너/리뷰어)
 * - src/components/manager/common/community/posts/section/PostFilterSection.tsx
 *
 * 📌 필터 옵션 참고:
 * - 공통 필터 옵션 (GA & SA 공통): src/data/manager/common/filterOptions.ts
 *   - Channel, CampaignStatus, CampaignType
 * - GA 관리자 전용 필터 옵션: src/data/manager_ga/common/filterOptions.ts
 *   - RejectCode, ReportCode, PartnerDivision, PartnerStatus, PartnerStatusType
 *   - ReviewerType, ReviewerStatus, ReviewerStatusType
 *   - BlacklistDivision, BlockCode, PostDivision
 *
 * 주요 기능:
 * - 검색 필터
 * - 필터 모달 버튼
 * - 활성 필터 태그 표시
 *
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "@/styles/manager/common/campaign/progress/filter_section.module.css";

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
  // 필터 초기화 함수 (선택적)
  on_filter_reset?: () => void;
  // 검색어 debounce 시간 (밀리초, 기본값: 300ms)
  search_debounce_ms?: number;
  // 필터 적용 콜백 (필터가 변경될 때 호출)
  on_filter_apply?: (filters: {
    search_query: string;
    active_filters: T[];
  }) => void;
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
  on_filter_reset,
  search_debounce_ms = 300,
  on_filter_apply,
}: BaseFilterSectionProps<T>) {
  // 내부 검색어 상태 (debounce를 위한)
  // useState: React Hook으로 컴포넌트의 검색어 상태를 관리합니다
  const [internal_search_query, set_internal_search_query] =
    useState(search_query);

  // 검색어 debounce 처리
  // useEffect: 컴포넌트가 렌더링된 후에 실행됩니다
  // 의존성 배열 [internal_search_query]: internal_search_query가 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    // 타이머 설정: search_debounce_ms 시간 후에 검색어를 부모 컴포넌트에 전달
    const timer = setTimeout(() => {
      on_search_change(internal_search_query);

      // 필터 적용 콜백 호출
      if (on_filter_apply) {
        on_filter_apply({
          search_query: internal_search_query,
          active_filters: active_filter_tags.map((tag) => tag.value),
        });
      }
    }, search_debounce_ms);

    // cleanup 함수: 컴포넌트가 언마운트되거나 검색어가 변경되기 전에 타이머를 취소합니다
    return () => {
      clearTimeout(timer);
    };
  }, [
    internal_search_query,
    search_debounce_ms,
    on_search_change,
    on_filter_apply,
    active_filter_tags,
  ]);

  // 외부에서 검색어가 변경되면 내부 상태도 업데이트
  // useEffect: 외부 search_query가 변경될 때 내부 상태를 동기화합니다
  useEffect(() => {
    set_internal_search_query(search_query);
  }, [search_query]);

  // 검색어 변경 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_search_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const new_query = e.target.value;
      set_internal_search_query(new_query);
    },
    []
  );

  // 검색어 초기화 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_search_clear = useCallback(() => {
    set_internal_search_query("");
    on_search_change("");

    // 필터 적용 콜백 호출
    if (on_filter_apply) {
      on_filter_apply({
        search_query: "",
        active_filters: active_filter_tags.map((tag) => tag.value),
      });
    }
  }, [on_search_change, on_filter_apply, active_filter_tags]);

  // 필터 태그 제거 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_filter_tag_remove_internal = useCallback(
    (value: T) => {
      if (on_filter_tag_remove) {
        on_filter_tag_remove(value);
      }

      // 필터 적용 콜백 호출
      if (on_filter_apply) {
        const remaining_filters = active_filter_tags
          .filter((tag) => tag.value !== value)
          .map((tag) => tag.value);
        on_filter_apply({
          search_query: internal_search_query,
          active_filters: remaining_filters,
        });
      }
    },
    [
      on_filter_tag_remove,
      on_filter_apply,
      active_filter_tags,
      internal_search_query,
    ]
  );

  // 필터 초기화 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_filter_reset = useCallback(() => {
    // 검색어 초기화
    set_internal_search_query("");
    on_search_change("");

    // 필터 초기화 콜백 호출
    if (on_filter_reset) {
      on_filter_reset();
    }

    // 필터 적용 콜백 호출
    if (on_filter_apply) {
      on_filter_apply({
        search_query: "",
        active_filters: [],
      });
    }
  }, [on_search_change, on_filter_reset, on_filter_apply]);

  // 활성 필터가 있는지 확인
  // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
  const has_active_filters =
    internal_search_query.trim() !== "" || active_filter_tags.length > 0;

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
              value={internal_search_query}
              onChange={handle_search_change}
              className={styles.search_input}
              aria-label="검색어 입력"
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
                  onClick={() => handle_filter_tag_remove_internal(tag.value)}
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
