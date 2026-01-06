/* ========================================
   📅 날짜 범위 입력 필드 컴포넌트
   ======================================== */

/**
 * 날짜 범위 입력 필드 컴포넌트
 *
 * 목적: 날짜 범위를 선택할 수 있는 입력 필드입니다.
 *       입력 필드를 클릭하면 RangeCalendar가 열립니다.
 *
 * 주요 기능:
 * - 날짜 범위 선택 (시작일 ~ 종료일)
 * - 입력 필드 클릭 시 캘린더 열기/닫기
 * - 선택된 날짜 범위 표시 (YYYY-MM-DD ~ YYYY-MM-DD 형식)
 * - 외부 클릭 시 자동 닫기
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import RangeCalendar, {
  type DateRange,
} from "@/components/common/date_range_picker/RangeCalendar";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import styles from "./date_range_field.module.css";

/**
 * 날짜 범위 입력 필드 Props
 *
 * 설명:
 * - value: 현재 선택된 날짜 범위 문자열 (YYYY-MM-DD ~ YYYY-MM-DD 형식)
 * - onChange: 날짜 범위 변경 시 호출되는 콜백 함수
 * - placeholder: 입력 필드 플레이스홀더
 * - isEditMode: 수정 모드 여부
 * - isEditable: 필드 편집 가능 여부
 */
interface DateRangeFieldProps {
  /** 현재 선택된 날짜 범위 문자열 */
  value: string;
  /** 날짜 범위 변경 시 호출되는 콜백 함수 */
  onChange: (value: string) => void;
  /** 입력 필드 플레이스홀더 */
  placeholder?: string;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부 */
  isEditable?: boolean;
}

/**
 * 날짜 범위 입력 필드 컴포넌트
 *
 * 설명:
 * - 입력 필드를 클릭하면 RangeCalendar가 열립니다.
 * - 날짜 범위를 선택하면 "YYYY-MM-DD ~ YYYY-MM-DD" 형식으로 표시됩니다.
 * - 외부를 클릭하면 캘린더가 자동으로 닫힙니다.
 */
export function DateRangeField({
  value,
  onChange,
  placeholder = "",
  isEditMode = false,
  isEditable = true,
}: DateRangeFieldProps) {
  // useState: 캘린더 열림/닫힘 상태를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [is_calendar_open, setIsCalendarOpen] = useState(false);

  // useState: 선택된 날짜 범위를 DateRange 타입으로 관리
  // value 문자열을 파싱하여 DateRange 객체로 변환
  const [selected_range, setSelectedRange] = useState<DateRange | undefined>(
    () => {
      // value 문자열을 파싱하여 DateRange 객체로 변환
      // "2025-09-30 ~ 2025-10-06" 형식에서 날짜 추출
      if (!value || !value.includes("~")) return undefined;

      const parts = value.split("~").map((part) => part.trim());
      if (parts.length !== 2) return undefined;

      const from_date = parts[0] ? new Date(parts[0]) : undefined;
      const to_date = parts[1] ? new Date(parts[1]) : undefined;

      // 유효한 날짜인지 확인
      if (from_date && isNaN(from_date.getTime())) return undefined;
      if (to_date && isNaN(to_date.getTime())) return undefined;

      return {
        from: from_date,
        to: to_date,
      };
    }
  );

  // useRef: 입력 필드 컨테이너의 참조를 저장하는 React Hook
  // ref는 DOM 요소에 직접 접근할 수 있게 해줍니다
  const container_ref = useRef<HTMLDivElement>(null);

  // value prop이 변경되면 내부 상태도 업데이트
  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    if (!value || !value.includes("~")) {
      setSelectedRange(undefined);
      return;
    }

    const parts = value.split("~").map((part) => part.trim());
    if (parts.length !== 2) {
      setSelectedRange(undefined);
      return;
    }

    const from_date = parts[0] ? new Date(parts[0]) : undefined;
    const to_date = parts[1] ? new Date(parts[1]) : undefined;

    if (from_date && isNaN(from_date.getTime())) {
      setSelectedRange(undefined);
      return;
    }
    if (to_date && isNaN(to_date.getTime())) {
      setSelectedRange(undefined);
      return;
    }

    setSelectedRange({
      from: from_date,
      to: to_date,
    });
  }, [value]);

  // 외부 클릭 감지: 캘린더 외부를 클릭하면 닫기
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

  // 날짜 범위 선택 핸들러
  // RangeCalendar에서 날짜 범위를 선택했을 때 호출됩니다
  const handle_date_range_select = (range: DateRange | undefined) => {
    setSelectedRange(range);

    // 날짜 범위를 문자열로 변환
    if (!range || !range.from) {
      onChange("");
      return;
    }

    if (range.from && range.to) {
      // 시작일과 종료일이 모두 있으면 범위 형식으로 변환
      // format 함수: date-fns 라이브러리의 함수로, 날짜를 원하는 형식으로 변환합니다
      // "yyyy-MM-dd": 년도 4자리-월 2자리-일 2자리 형식
      const formatted_range = `${format(range.from, "yyyy-MM-dd")} ~ ${format(
        range.to,
        "yyyy-MM-dd"
      )}`;
      onChange(formatted_range);
    } else if (range.from) {
      // 시작일만 있으면 시작일만 표시
      const formatted_date = format(range.from, "yyyy-MM-dd");
      onChange(`${formatted_date} ~`);
    } else {
      onChange("");
    }
  };

  // 입력 필드 클릭 핸들러
  // 입력 필드를 클릭하면 캘린더를 엽니다
  const handle_input_click = () => {
    if (isEditMode && !isEditable) return; // 수정 모드이고 편집 불가능하면 클릭 무시
    setIsCalendarOpen(!is_calendar_open);
  };

  // 필드 편집 가능 여부 확인
  const can_edit = !isEditMode || isEditable;

  return (
    <div className={styles.date_range_field_container} ref={container_ref}>
      {/* 날짜 범위 입력 필드 */}
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

      {/* 날짜 범위 선택 캘린더 - 입력 필드 아래에 표시 */}
      {is_calendar_open && can_edit && (
        <div className={styles.calendar_dropdown}>
          <RangeCalendar
            selected={selected_range}
            on_select={handle_date_range_select}
          />
        </div>
      )}
    </div>
  );
}
