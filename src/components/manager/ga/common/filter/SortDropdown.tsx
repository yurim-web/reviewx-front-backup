/* ========================================
   🔽 정렬 드롭다운 공통 컴포넌트
   ======================================== */

/**
 * 정렬 드롭다운 공통 컴포넌트
 *
 * 목적: 여러 필터 섹션에서 공통으로 사용하는 정렬 드롭다운 컴포넌트입니다.
 *
 * 📍 사용 위치 (현재):
 * - src/components/manager_ga/common/filter/BaseFilterSection.tsx
 *   (BaseFilterSection 내부에서 사용)
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 *   (직접 import하여 사용)
 * - src/components/manager_ga/campaign/rejected/section/FilterSection.tsx
 *   (BaseFilterSection을 통해 간접 사용)
 * - src/components/manager_ga/campaign/reported/section/FilterSection.tsx
 *   (BaseFilterSection을 통해 간접 사용)
 * - src/components/manager_ga/member/partners/section/PartnerFilterSection.tsx
 *   (직접 import하여 사용)
 * - src/components/manager_ga/member/reviewers/section/ReviewerFilterSection.tsx
 *   (직접 import하여 사용)
 * - src/components/manager_ga/member/blacklist/section/BlacklistFilterSection.tsx
 *   (직접 import하여 사용)
 * - src/components/manager_ga/community/posts/section/PostFilterSection.tsx
 *   (직접 import하여 사용)
 *
 * 주요 기능:
 * - 정렬 옵션 선택
 * - 외부 클릭 시 드롭다운 닫기
 * - 선택된 옵션 표시
 *
 */

"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/manager/common/campaign/progress/filter_section.module.css";

interface SortDropdownProps {
  // 선택된 정렬 옵션
  selected_sort: string;
  // 정렬 옵션 선택 핸들러
  on_sort_change: (sort: string) => void;
  // 정렬 옵션 목록
  sort_options?: string[];
  // 기본 정렬 옵션 목록 (기본값)
  default_sort_options?: string[];
}

export default function SortDropdown({
  selected_sort,
  on_sort_change,
  sort_options,
  default_sort_options = ["최신순", "인기순", "마감임박순", "포인트높은순"],
}: SortDropdownProps) {
  // 드롭다운 열림/닫힘 상태
  const [is_open, set_is_open] = useState(false);

  // 드롭다운 컨테이너 참조
  // useRef는 DOM 요소에 직접 접근할 수 있게 해주는 React Hook입니다
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지 (드롭다운 닫기)
  // useEffect는 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      // dropdown_ref.current: 참조한 DOM 요소
      // contains: DOM 요소가 특정 노드를 포함하는지 확인합니다
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        set_is_open(false);
      }
    };

    // 드롭다운이 열려있을 때만 이벤트 리스너 등록
    if (is_open) {
      document.addEventListener("mousedown", handle_click_outside);
    }

    // cleanup 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행됩니다
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_open]);

  // 드롭다운 토글 핸들러
  const handle_toggle = () => {
    set_is_open(!is_open);
  };

  // 정렬 옵션 선택 핸들러
  const handle_select = (sort: string) => {
    on_sort_change(sort);
    set_is_open(false);
  };

  // 사용할 정렬 옵션 목록 (props로 전달받거나 기본값 사용)
  const options = sort_options || default_sort_options;

  return (
    <div ref={dropdown_ref} className={styles.sort_dropdown_container}>
      <div className={styles.filter_item} onClick={handle_toggle}>
        <span className={styles.filter_text}>{selected_sort}</span>
        {/* 드롭다운 화살표 아이콘 */}
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt="드롭다운"
          className={`${styles.dropdown_arrow} ${
            is_open ? styles.dropdown_arrow_rotated : ""
          }`}
        />
      </div>

      {/* 드롭다운 메뉴 - 조건부 렌더링 */}
      {is_open && (
        <div className={styles.sort_dropdown_menu}>
          {options.map((option) => (
            <button
              key={option}
              className={`${styles.sort_dropdown_item} ${
                selected_sort === option
                  ? styles.sort_dropdown_item_selected
                  : ""
              }`}
              onClick={() => handle_select(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
