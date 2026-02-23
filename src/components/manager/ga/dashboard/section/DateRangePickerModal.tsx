/* ========================================
   📅 날짜 범위 선택 드롭다운 컴포넌트 (Figma 디자인 기반)
   ======================================== */

/**
 * 날짜 범위 선택 드롭다운 컴포넌트
 *
 * 목적: Figma 디자인에 맞춘 날짜 범위 선택 드롭다운입니다.
 * 버튼을 클릭하면 버튼 바로 아래에 드롭다운이 표시됩니다.
 *
 * 주요 기능:
 * - 날짜 범위 선택 (시작일 ~ 종료일)
 * - 2개월 동시 표시
 * - 한국어 로케일 지원
 * - 날짜 선택 시 자동 적용
 * - 외부 클릭 시 자동 닫힘
 *
 * 내부적으로 RangeCalendar 컴포넌트를 사용합니다.
 */

"use client";

import { useState, useEffect } from "react";
import RangeCalendar, {
  type DateRange,
} from "@/components/common/date_range_picker/RangeCalendar";
import styles from "@/components/common/date_range_picker/range_calendar.module.css";

// DateRange 타입을 export하여 다른 컴포넌트에서도 사용 가능하도록 함
export type { DateRange };

// DateRangePickerModal 컴포넌트의 props 타입 정의
interface DateRangePickerModalProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 날짜 범위
  selected_range: DateRange | undefined;
  // 날짜 범위 적용 함수 (선택된 날짜 범위를 부모 컴포넌트로 전달)
  on_apply: (range: DateRange | undefined) => void;
  // 드롭다운 위치 정렬 (기본값: 'right')
  align?: "left" | "right";
  // 날짜 순서 오류 시 호출되는 콜백
  on_validation_error?: () => void;
}

/**
 * 날짜 범위 선택 드롭다운 컴포넌트
 *
 * Figma 디자인에 맞춘 간결한 날짜 선택 드롭다운입니다.
 * 헤더와 푸터 없이 달력만 표시하며, 날짜 선택 시 자동으로 적용됩니다.
 * 버튼 바로 아래에 위치하며, 외부 클릭 시 자동으로 닫힙니다.
 */
export default function DateRangePickerModal({
  is_open,
  on_close,
  selected_range,
  on_apply,
  align = "right",
  on_validation_error,
}: DateRangePickerModalProps) {
  // 드롭다운 내부에서 관리하는 임시 선택 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [temp_range, set_temp_range] = useState<DateRange | undefined>(
    selected_range
  );

  // 드롭다운이 열릴 때마다 임시 선택 상태를 초기화
  // useEffect는 React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  // 의존성 배열 [is_open, selected_range]: 이 값들이 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 드롭다운이 열릴 때: 현재 선택된 날짜 범위로 초기화
      set_temp_range(selected_range);
    }
  }, [is_open, selected_range]);

  // 날짜 선택 핸들러
  // 날짜를 선택했을 때 즉시 부모 컴포넌트에 반영하는 함수입니다
  // 이렇게 하면 버튼에 선택된 날짜가 실시간으로 표시됩니다
  const handle_date_select = (range: DateRange | undefined) => {
    // range가 undefined일 수 있습니다 (선택 취소 시)
    // set_temp_range: 임시 선택 상태를 업데이트합니다 (캘린더 표시용)
    set_temp_range(range);
    // on_apply: 부모 컴포넌트의 상태를 즉시 업데이트하여 버튼에 반영합니다
    // 이렇게 하면 날짜를 선택하는 즉시 버튼에 날짜가 표시됩니다
    on_apply(range);
  };

  // 외부 클릭 시 적용 및 닫기 핸들러
  // DateFilterSection에서 외부 클릭을 감지하면 이 함수를 호출합니다
  // 또는 사용자가 명시적으로 닫을 때 호출됩니다
  const handle_close_with_apply = () => {
    // 현재 선택된 임시 범위를 적용
    on_apply(temp_range);
    // 드롭다운 닫기
    on_close();
  };

  // 드롭다운이 닫혀있으면 렌더링하지 않음
  // 조건부 렌더링: 조건에 따라 컴포넌트를 렌더링하거나 렌더링하지 않습니다
  if (!is_open) return null;

  // 드롭다운 위치 스타일 - align prop에 따라 left 또는 right로 정렬
  // CSS 모듈의 right: 0을 오버라이드하기 위해 인라인 스타일 사용
  const dropdown_style: React.CSSProperties = {
    ...(align === "left"
      ? { left: "0", right: "auto" }
      : { right: "0", left: "auto" }),
  };

  return (
    <div className={styles.dropdown_content} style={dropdown_style}>
      {/* 드롭다운 바디 - 캘린더만 표시 (헤더/푸터 없음) */}
      <div className={styles.dropdown_body}>
        {/* 
          RangeCalendar 컴포넌트: 재사용 가능한 날짜 범위 선택 캘린더
          
          props 설명:
          - selected: 현재 선택된 날짜 범위 (temp_range 사용)
          - on_select: 날짜를 선택했을 때 실행되는 함수 (handle_date_select를 전달)
          - number_of_months: 기본값 2개월 (생략 가능)
          - show_outside_days: 기본값 true (생략 가능)
        */}
        <RangeCalendar
          selected={temp_range}
          on_select={handle_date_select}
          on_validation_error={on_validation_error}
        />
      </div>
    </div>
  );
}
