/* ========================================
   🔽 공통 필터 드롭다운 컴포넌트 (베이스)
   ======================================== */

/**
 * 공통 필터 드롭다운 컴포넌트
 *
 * 목적: 모든 필터 드롭다운에서 공통으로 사용하는 기본 컴포넌트입니다.
 *       체크박스 방식의 다중 선택 필터링을 제공합니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치 (임시로 캠페인 진행 상황 필터에서만):
 * - src/components/manager/common/campaign/progress/filter/StatusFilterDropdown.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 필터 적용 기능 (선택 시 즉시 적용)
 * - 외부 클릭으로 닫기
 * - 제네릭 타입으로 다양한 타입의 옵션 지원
 *
 * React 핵심 개념:
 * - useState: 컴포넌트 내부 상태 관리 (임시 선택 상태)
 * - useEffect: 외부 클릭 감지를 위한 이벤트 리스너 등록
 * - useRef: DOM 요소 참조 (외부 클릭 감지용)
 * - 제네릭 타입: 다양한 타입의 옵션 지원
 */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/manager_ga/common/filter/filter_button.module.css";

// 필터 옵션 타입 정의
// value: 실제 값 (예: '예정', '진행')
// label: 표시할 텍스트 (예: '예정', '진행')
export interface FilterOption<T> {
  value: T;
  label: string;
}

// BaseFilterDropdown 컴포넌트의 props 타입 정의
// <T>는 제네릭 타입으로, 어떤 타입이든 받을 수 있습니다
export interface BaseFilterDropdownProps<T> {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 값들
  selected_values: T[];
  // 필터 적용 함수 (선택된 값들을 부모 컴포넌트로 전달)
  on_apply: (values: T[]) => void;
  // 필터 옵션 목록
  options: FilterOption<T>[];
  // 드롭다운 컨테이너 ref (위치 계산용)
  container_ref?: React.RefObject<HTMLDivElement | null>;
  // 옵션 리스트에 추가할 클래스명 (스크롤 등 스타일 적용용)
  options_list_class_name?: string;
}

/**
 * 공통 필터 드롭다운 컴포넌트
 *
 * @template T - 필터 옵션의 값 타입 (예: string, CampaignStatus 등)
 */
export default function BaseFilterDropdown<T extends string | number>({
  is_open,
  on_close,
  selected_values,
  on_apply,
  options,
  container_ref,
  options_list_class_name,
}: BaseFilterDropdownProps<T>) {
  // 드롭다운 DOM 요소 참조
  // useRef: DOM 요소에 직접 접근하기 위한 React Hook
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // 모달 내부에서 관리하는 임시 선택 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [temp_selected, set_temp_selected] = useState<T[]>(selected_values);

  // 드롭다운이 열릴 때마다 임시 선택 상태를 초기화
  // useEffect는 React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  // 의존성 배열 [is_open, selected_values]: 이 값들이 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 드롭다운이 열릴 때: 현재 선택된 값으로 초기화
      set_temp_selected(selected_values);
    }
  }, [is_open, selected_values]);

  // 외부 클릭 감지 (드롭다운 외부를 클릭하면 닫기)
  // useEffect로 이벤트 리스너를 등록하고, 컴포넌트가 unmount될 때 제거합니다
  useEffect(() => {
    // 드롭다운이 열려있지 않으면 이벤트 리스너를 등록하지 않음
    if (!is_open) return;

    // 외부 클릭 감지 함수
    const handle_click_outside = (event: MouseEvent) => {
      // event.target: 클릭한 요소
      // dropdown_ref.current: 드롭다운 DOM 요소
      // container_ref?.current: 필터 버튼 컨테이너 DOM 요소
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node) &&
        container_ref?.current &&
        !container_ref.current.contains(event.target as Node)
      ) {
        // 드롭다운 외부를 클릭한 경우: 닫기만 (선택은 이미 즉시 적용됨)
        on_close();
      }
    };

    // 이벤트 리스너 등록
    // document에 클릭 이벤트를 등록하여 어디를 클릭해도 감지할 수 있습니다
    document.addEventListener("mousedown", handle_click_outside);

    // cleanup 함수: 컴포넌트가 unmount되거나 is_open이 변경될 때 실행
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_open, on_close, container_ref]);

  // 옵션 선택/해제 핸들러
  // 체크박스를 클릭했을 때 호출되는 함수입니다
  const handle_option_change = (value: T) => {
    // 배열의 includes 메서드: 배열에 특정 값이 포함되어 있는지 확인합니다
    if (temp_selected.includes(value)) {
      // 이미 선택된 경우: 배열에서 제거
      // filter 메서드: 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
      const new_selected = temp_selected.filter((v) => v !== value);
      set_temp_selected(new_selected);
      // 즉시 적용 (드롭다운은 모달과 다르게 즉시 적용)
      on_apply(new_selected);
    } else {
      // 선택되지 않은 경우: 배열에 추가
      // 스프레드 연산자(...): 배열의 모든 요소를 펼쳐서 새 배열을 만듭니다
      const new_selected = [...temp_selected, value];
      set_temp_selected(new_selected);
      // 즉시 적용
      on_apply(new_selected);
    }
  };

  // 드롭다운이 닫혀있으면 렌더링하지 않음
  // 조건부 렌더링: 조건에 따라 컴포넌트를 렌더링하거나 렌더링하지 않습니다
  if (!is_open) return null;

  return (
    <div ref={dropdown_ref} className={styles.dropdown_container}>
      {/* 옵션 리스트 */}
      <div
        className={`${styles.options_list} ${
          options_list_class_name ? styles[options_list_class_name] || "" : ""
        }`}
      >
        {/* map 함수: 배열을 순회하며 JSX 요소를 생성합니다 */}
        {options.map((option) => {
          // 옵션이 선택되었는지 확인
          const is_checked = temp_selected.includes(option.value);

          return (
            <label key={String(option.value)} className={styles.option_item}>
              <input
                type="checkbox"
                value={String(option.value)}
                checked={is_checked}
                onChange={() => handle_option_change(option.value)}
                className={styles.option_checkbox}
              />
              <span className={styles.option_label}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
