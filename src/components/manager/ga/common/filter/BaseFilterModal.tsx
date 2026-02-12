/* ========================================
   🔍 공통 필터 모달 컴포넌트 (베이스)
   ======================================== */

/**
 * 공통 필터 모달 컴포넌트
 *
 * 목적: 모든 필터 모달에서 공통으로 사용하는 기본 컴포넌트입니다.
 *       체크박스 방식의 다중 선택 필터링을 제공합니다.
 *
 * 📍 사용 위치 (현재):
 * - src/components/manager_common/campaign/progress/filter/ChannelFilterModal.tsx
 * - src/components/manager_common/campaign/progress/filter/StatusFilterModal.tsx
 * - src/components/manager_common/campaign/progress/filter/TypeFilterModal.tsx
 * - src/components/manager_ga/member/partners/filter/ChannelFilterModal.tsx
 * - src/components/manager_ga/member/partners/filter/StatusFilterModal.tsx
 * - src/components/manager_ga/member/partners/filter/TypeFilterModal.tsx
 * - src/components/manager_ga/member/partners/filter/DivisionFilterModal.tsx
 * - src/components/manager_ga/member/reviewers/filter/ChannelFilterModal.tsx
 * - src/components/manager_ga/member/reviewers/filter/StatusFilterModal.tsx
 * - src/components/manager_ga/member/reviewers/filter/TypeFilterModal.tsx
 * - src/components/manager_ga/member/reviewers/filter/GradeFilterModal.tsx
 * - src/components/manager_ga/member/blacklist/filter/DivisionFilterModal.tsx
 * - src/components/manager_ga/member/blacklist/filter/BlockCodeFilterModal.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 * - 제네릭 타입으로 다양한 타입의 옵션 지원
 *
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager/common/campaign/progress/status_filter_modal.module.css";

// 필터 옵션 타입 정의
// value: 실제 값 (예: 'R001', 'Blog')
// label: 표시할 텍스트 (예: 'R001 (부적절한 내용)', '네이버 블로그')
export interface FilterOption<T> {
  value: T;
  label: string;
}

// BaseFilterModal 컴포넌트의 props 타입 정의
// <T>는 제네릭 타입으로, 어떤 타입이든 받을 수 있습니다
export interface BaseFilterModalProps<T> {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 값들
  selected_values: T[];
  // 필터 적용 함수 (선택된 값들을 부모 컴포넌트로 전달)
  on_apply: (values: T[]) => void;
  // 필터 옵션 목록
  options: FilterOption<T>[];
  // 섹션 제목 (예: '반려 코드', '채널', '상태')
  section_title: string;
  // 모달 제목 (기본값: '필터')
  modal_title?: string;
}

/**
 * 공통 필터 모달 컴포넌트
 *
 * @template T - 필터 옵션의 값 타입 (예: string, Channel, RejectCode 등)
 */
export default function BaseFilterModal<T extends string | number>({
  is_open,
  on_close,
  selected_values,
  on_apply,
  options,
  section_title,
  modal_title = "필터",
}: BaseFilterModalProps<T>) {
  // 모달 내부에서 관리하는 임시 선택 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [temp_selected, set_temp_selected] = useState<T[]>(selected_values);

  // selected_values 변경 시 항상 temp_selected 동기화
  // 필터 태그에서 항목 제거 후 모달 재오픈 시 체크박스 잔상 방지
  const values_key = JSON.stringify(selected_values ?? []);
  useEffect(() => {
    set_temp_selected(JSON.parse(values_key));
  }, [values_key]);

  // 옵션 선택/해제 핸들러
  // 체크박스를 클릭했을 때 호출되는 함수입니다
  const handle_option_change = (value: T) => {
    // 배열의 includes 메서드: 배열에 특정 값이 포함되어 있는지 확인합니다
    if (temp_selected.includes(value)) {
      // 이미 선택된 경우: 배열에서 제거
      // filter 메서드: 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
      set_temp_selected(temp_selected.filter((v) => v !== value));
    } else {
      // 선택되지 않은 경우: 배열에 추가
      // 스프레드 연산자(...): 배열의 모든 요소를 펼쳐서 새 배열을 만듭니다
      set_temp_selected([...temp_selected, value]);
    }
  };

  // 필터 적용 핸들러
  // "필터 적용하기" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_apply = () => {
    // 부모 컴포넌트의 on_apply 함수를 호출하여 선택된 값들을 전달
    on_apply(temp_selected);
    // 모달 닫기
    on_close();
  };

  // 선택 초기화 핸들러
  // "선택 초기화" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_reset = () => {
    // 빈 배열로 초기화
    set_temp_selected([]);
  };

  // 모달 오버레이 클릭 핸들러
  // 모달 배경을 클릭했을 때 모달을 닫는 함수입니다
  const handle_backdrop_click = (e: React.MouseEvent) => {
    // e.target: 클릭한 요소
    // e.currentTarget: 이벤트 핸들러가 등록된 요소
    // 두 값이 같으면 배경을 클릭한 것입니다
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  // 조건부 렌더링: 조건에 따라 컴포넌트를 렌더링하거나 렌더링하지 않습니다
  if (!is_open) return null;

  return (
    <div className={styles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>{modal_title}</h3>
          <button className={styles.modal_close_button} onClick={on_close}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          {/* 섹션 제목 */}
          <h4 className={styles.section_title}>{section_title}</h4>

          {/* 옵션 그리드 (2단 레이아웃) */}
          <div className={styles.options_grid}>
            {/* map 함수: 배열을 순회하며 JSX 요소를 생성합니다 */}
            {options.map((option) => (
              <label key={String(option.value)} className={styles.option_item}>
                <input
                  type="checkbox"
                  value={String(option.value)}
                  checked={temp_selected.includes(option.value)}
                  onChange={() => handle_option_change(option.value)}
                  className={styles.option_checkbox}
                />
                <span className={styles.option_label}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button className={styles.apply_button} onClick={handle_apply}>
            필터 적용하기
          </button>
          <button className={styles.reset_button} onClick={handle_reset}>
            <div
              className={styles.reset_icon}
              style={{ backgroundImage: "url('/images/filter/x_small.svg')" }}
            ></div>
            선택 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
