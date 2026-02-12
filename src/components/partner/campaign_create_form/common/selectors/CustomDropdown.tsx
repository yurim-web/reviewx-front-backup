/* ========================================
   📋 커스텀 드롭다운 컴포넌트
   ======================================== */

/**
 * 커스텀 드롭다운 컴포넌트
 *
 * 목적: Figma 디자인에 맞는 커스텀 드롭다운 UI를 제공합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/create (캠페인 생성 페이지)
 * - /partner/campaign_application/edit (캠페인 수정 페이지)
 *
 * 주요 기능:
 * - 클릭 시 옵션 리스트 표시/숨김
 * - 옵션 선택 시 드롭다운 자동 닫기
 * - 외부 클릭 시 드롭다운 닫기
 * - 화면 하단에 공간이 부족하면 위쪽으로 열림
 * - 키보드 접근성 지원 (aria 속성)
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import dropdown_styles from '@/styles/partner/campaign_create/custom_dropdown.module.css';

/**
 * 커스텀 드롭다운 컴포넌트 Props
 *
 * 설명:
 * - value: 현재 선택된 값
 * - options: 드롭다운에 표시될 옵션 배열
 * - onChange: 옵션이 선택될 때 호출되는 콜백 함수
 * - placeholder: 값이 없을 때 표시할 플레이스홀더 텍스트
 * - disabled: 드롭다운 비활성화 여부
 */
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * 커스텀 드롭다운 컴포넌트
 *
 * 설명:
 * - React의 useState 훅을 사용하여 드롭다운 열림/닫힘 상태를 관리합니다.
 * - useRef 훅을 사용하여 DOM 요소에 직접 접근합니다.
 * - useEffect 훅을 사용하여 외부 클릭을 감지합니다.
 */
export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
}: CustomDropdownProps) {
  // 드롭다운 열림/닫힘 상태 관리
  // 설명: useState를 사용하여 컴포넌트 내부 상태를 관리합니다.
  const [is_open, setIsOpen] = useState(false);

  // 드롭다운이 위쪽으로 열릴지 아래쪽으로 열릴지 결정하는 상태
  // 설명: 화면 하단에 공간이 부족할 때 위쪽으로 열리도록 합니다.
  const [is_open_upward, setIsOpenUpward] = useState(false);

  // 드롭다운 컨테이너 참조
  // 설명: useRef를 사용하여 DOM 요소에 직접 접근할 수 있습니다.
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // 선택된 옵션의 표시 텍스트
  // 설명: 값이 없으면 플레이스홀더를 표시합니다.
  const display_text = value || placeholder;

  /**
   * 옵션 선택 핸들러
   *
   * 설명:
   * - 선택된 옵션을 부모 컴포넌트에 전달합니다.
   * - 선택 후 드롭다운을 자동으로 닫습니다.
   */
  const handle_option_select = (option: string) => {
    onChange(option);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  /**
   * 드롭다운 토글 핸들러
   *
   * 설명:
   * - 드롭다운을 열거나 닫습니다.
   * - 화면 위치를 계산하여 위쪽/아래쪽으로 열리는 방향을 결정합니다.
   */
  const toggle_dropdown = () => {
    if (disabled) return;
    const new_is_open = !is_open;
    setIsOpen(new_is_open);

    // 드롭다운이 열릴 때 화면 위치 계산
    if (new_is_open && dropdown_ref.current) {
      const rect = dropdown_ref.current.getBoundingClientRect();
      const viewport_height = window.innerHeight;
      const dropdown_height = 400; // 드롭다운 최대 높이

      // 화면 하단에서 드롭다운 높이만큼의 여유 공간이 있는지 확인
      const space_below = viewport_height - rect.bottom;
      const space_above = rect.top;

      // 아래쪽 공간이 부족하고 위쪽 공간이 충분하면 위쪽으로 열기
      if (space_below < dropdown_height && space_above > dropdown_height) {
        setIsOpenUpward(true);
      } else {
        setIsOpenUpward(false);
      }

      // 드롭다운이 열릴 때 해당 요소로 스크롤 (위쪽으로 열릴 때만)
      if (!is_open_upward) {
        setTimeout(() => {
          dropdown_ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }, 100);
      }
    }
  };

  /**
   * 드롭다운 옵션 리스트 스크롤 전파 방지 핸들러
   *
   * 설명:
   * - 드롭다운 내부 스크롤이 끝에 도달했을 때 페이지 스크롤로 전파되는 것을 방지합니다.
   * - 스크롤이 최상단/최하단에 도달했을 때만 이벤트 전파를 막습니다.
   */
  const handle_options_scroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // 스크롤이 맨 위에 있고 위로 스크롤하려는 경우
    const is_scrolling_up = e.deltaY < 0;
    const is_at_top = scrollTop === 0;

    // 스크롤이 맨 아래에 있고 아래로 스크롤하려는 경우
    const is_scrolling_down = e.deltaY > 0;
    const is_at_bottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px 오차 허용

    // 스크롤이 끝에 도달했을 때 이벤트 전파 방지
    if ((is_at_top && is_scrolling_up) || (is_at_bottom && is_scrolling_down)) {
      e.preventDefault();
    }
  };

  /**
   * 외부 클릭 감지
   *
   * 설명:
   * - useEffect 훅을 사용하여 컴포넌트 마운트/언마운트 시 이벤트 리스너를 추가/제거합니다.
   * - 드롭다운 외부를 클릭하면 드롭다운을 닫습니다.
   */
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // 드롭다운이 열려있을 때만 이벤트 리스너 추가
    if (is_open) {
      document.addEventListener('mousedown', handle_click_outside);
    }

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
    // 설명: 메모리 누수를 방지하기 위해 반드시 이벤트 리스너를 제거해야 합니다.
    return () => {
      document.removeEventListener('mousedown', handle_click_outside);
    };
  }, [is_open]);

  return (
    <div ref={dropdown_ref} className={dropdown_styles.custom_dropdown}>
      {/* 드롭다운 버튼 (선택된 값 표시) */}
      <button
        type="button"
        className={`${dropdown_styles.dropdown_button} ${
          is_open ? dropdown_styles.open : ''
        } ${disabled ? dropdown_styles.disabled : ''}`}
        onClick={toggle_dropdown}
        aria-expanded={is_open}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={dropdown_styles.dropdown_text}>{display_text}</span>
        {/* 화살표 아이콘 */}
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt="드롭다운 화살표"
          className={`${dropdown_styles.dropdown_arrow} ${
            is_open ? dropdown_styles.rotated : ''
          }`}
        />
      </button>

      {/* 드롭다운 옵션 리스트 */}
      {is_open && (
        <div
          className={`${dropdown_styles.dropdown_options} ${
            is_open_upward ? dropdown_styles.dropdown_options_upward : ''
          }`}
          onWheel={handle_options_scroll}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${dropdown_styles.dropdown_option} ${
                value === option ? dropdown_styles.selected : ''
              }`}
              onClick={() => handle_option_select(option)}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
