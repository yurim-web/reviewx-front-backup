/* ========================================
   📅 단일 날짜 입력 필드 컴포넌트
   ======================================== */

/**
 * 단일 날짜 입력 필드 컴포넌트
 *
 * 목적: 하나의 날짜를 선택할 수 있는 입력 필드입니다.
 *       입력 필드를 클릭하면 SingleCalendar가 열립니다.
 *
 * 주요 기능:
 * - 단일 날짜 선택 (하나의 날짜만 선택)
 * - 입력 필드 클릭 시 캘린더 열기/닫기
 * - 선택된 날짜 표시 (YYYY-MM-DD 형식)
 * - 외부 클릭 시 자동 닫기
 *
 * 📌 DateRangeField와의 차이점:
 * - DateRangeField: 날짜 범위 선택 (시작일 ~ 종료일), 달력 2개 표시
 * - DateField: 단일 날짜 선택, 달력 1개 표시
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import SingleCalendar from "@/components/common/date_range_picker/SingleCalendar";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import styles from "@/styles/partner/campaign_create/date_range_field.module.css";

/**
 * 단일 날짜 입력 필드 Props
 *
 * 설명:
 * - value: 현재 선택된 날짜 문자열 (YYYY-MM-DD 형식)
 * - onChange: 날짜 변경 시 호출되는 콜백 함수
 * - placeholder: 입력 필드 플레이스홀더
 * - isEditMode: 수정 모드 여부
 * - isEditable: 필드 편집 가능 여부
 */
interface DateFieldProps {
  /** 현재 선택된 날짜 문자열 */
  value: string;
  /** 날짜 변경 시 호출되는 콜백 함수 */
  onChange: (value: string) => void;
  /** 입력 필드 플레이스홀더 */
  placeholder?: string;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부 */
  isEditable?: boolean;
}

/**
 * 단일 날짜 입력 필드 컴포넌트
 *
 * 설명:
 * - 입력 필드를 클릭하면 SingleCalendar가 열립니다.
 * - 날짜를 선택하면 "YYYY-MM-DD" 형식으로 표시됩니다.
 * - 외부를 클릭하면 캘린더가 자동으로 닫힙니다.
 *
 */
export function DateField({
  value,
  onChange,
  placeholder = "",
  isEditMode = false,
  isEditable = true,
}: DateFieldProps) {
  /**
   * useState: 캘린더 열림/닫힘 상태를 관리하는 React Hook
   *
   * 설명:
   * - [상태값, 상태를 변경하는 함수] = useState(초기값)
   * - is_calendar_open: 캘린더가 열려있는지 여부를 나타내는 boolean 값
   * - setIsCalendarOpen: 캘린더 열림/닫힘 상태를 변경하는 함수
   */
  const [is_calendar_open, setIsCalendarOpen] = useState(false);

  /**
   * useState: 선택된 날짜를 Date 타입으로 관리
   *
   * 설명:
   * - value 문자열을 파싱하여 Date 객체로 변환합니다.
   * - "2025-09-30" 형식에서 날짜를 추출합니다.
   */
  const [selected_date, setSelectedDate] = useState<Date | undefined>(() => {
    // value 문자열을 파싱하여 Date 객체로 변환
    if (!value) return undefined;

    // "YYYY-MM-DD" 형식을 파싱 (시간대 문제 방지)
    const parts = value.split("-");
    if (parts.length !== 3) return undefined;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 월은 0부터 시작
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) return undefined;

    return date;
  });

  /**
   * useRef: 입력 필드 컨테이너의 참조를 저장하는 React Hook
   *
   * 설명:
   * - ref는 DOM 요소에 직접 접근할 수 있게 해줍니다.
   * - 외부 클릭을 감지하기 위해 사용합니다.
   */
  const container_ref = useRef<HTMLDivElement>(null);

  /**
   * useEffect: value prop이 변경되면 내부 상태도 업데이트
   *
   * 설명:
   * - useEffect는 컴포넌트가 렌더링된 후에 실행됩니다.
   * - value prop이 변경되면 selected_date 상태도 업데이트합니다.
   *

   */
  useEffect(() => {
    if (!value) {
      setSelectedDate(undefined);
      return;
    }

    // "YYYY-MM-DD" 형식을 파싱 (시간대 문제 방지)
    const parts = value.split("-");
    if (parts.length !== 3) {
      setSelectedDate(undefined);
      return;
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 월은 0부터 시작
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setSelectedDate(undefined);
      return;
    }

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    if (isNaN(date.getTime())) {
      setSelectedDate(undefined);
      return;
    }

    setSelectedDate(date);
  }, [value]);

  /**
   * useEffect: 외부 클릭 감지 - 캘린더 외부를 클릭하면 닫기
   *
   * 설명:
   * - 캘린더가 열려있을 때만 이벤트 리스너를 등록합니다.
   * - 외부를 클릭하면 캘린더를 닫습니다.
   *
   */
  useEffect(() => {
    // 캘린더가 열려있을 때만 이벤트 리스너를 등록합니다
    if (!is_calendar_open) return;

    // 외부 클릭을 감지하는 함수
    const handle_click_outside = (event: MouseEvent) => {
      // event.target: 클릭한 요소
      // container_ref.current: 입력 필드 컨테이너 요소
      // contains(): 요소가 다른 요소의 자식인지 확인하는 메서드
      if (
        container_ref.current &&
        !container_ref.current.contains(event.target as Node)
      ) {
        // 캘린더 외부를 클릭했으면 닫기
        setIsCalendarOpen(false);
      }
    };

    // document에 클릭 이벤트 리스너 추가
    // setTimeout을 사용하여 현재 클릭 이벤트가 처리된 후에 리스너를 추가합니다
    // 이렇게 하면 입력 필드를 클릭했을 때 캘린더가 바로 닫히는 것을 방지합니다
    setTimeout(() => {
      document.addEventListener("mousedown", handle_click_outside);
    }, 0);

    // cleanup 함수: 컴포넌트가 언마운트되거나 is_calendar_open이 변경될 때 실행됩니다
    // 이벤트 리스너를 제거하여 메모리 누수를 방지합니다
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_calendar_open]);

  /**
   * 날짜 선택 핸들러
   *
   * 설명:
   * - SingleCalendar에서 날짜를 선택했을 때 호출됩니다.
   * - 날짜를 "YYYY-MM-DD" 형식의 문자열로 변환하여 onChange 콜백에 전달합니다.
   *

   */
  const handle_date_select = (date: Date | undefined) => {
    setSelectedDate(date);

    // 날짜를 문자열로 변환
    if (!date) {
      onChange("");
      return;
    }

    // 날짜를 "YYYY-MM-DD" 형식으로 변환
    const formatted_date = format(date, "yyyy-MM-dd");
    onChange(formatted_date);
  };

  /**
   * 입력 필드 클릭 핸들러
   *
   * 설명:
   * - 입력 필드를 클릭하면 캘린더를 엽니다.
   * - 수정 모드이고 편집 불가능하면 클릭을 무시합니다.
   */
  const handle_input_click = () => {
    if (isEditMode && !isEditable) return; // 수정 모드이고 편집 불가능하면 클릭 무시
    setIsCalendarOpen(!is_calendar_open);
  };

  /**
   * 필드 편집 가능 여부 확인
   *
   * 설명:
   * - 수정 모드가 아니거나 편집 가능한 경우 true를 반환합니다.
   */
  const can_edit = !isEditMode || isEditable;

  return (
    <div className={styles.date_range_field_container} ref={container_ref}>
      {/* 단일 날짜 입력 필드 */}
      <input
        type="text"
        className={infoStyles.form_input}
        value={value}
        onChange={() => {}} // 입력 필드는 직접 수정 불가 (캘린더로만 선택)
        onClick={handle_input_click}
        placeholder={placeholder}
        readOnly={!can_edit} // 수정 가능할 때는 readOnly 해제하여 원래 스타일 유지
        disabled={!can_edit}
      />

      {/* 단일 날짜 선택 캘린더 - 입력 필드 아래에 표시 */}
      {is_calendar_open && can_edit && (
        <div className={styles.single_calendar_dropdown}>
          <SingleCalendar
            selected={selected_date}
            on_select={handle_date_select}
          />
        </div>
      )}
    </div>
  );
}
