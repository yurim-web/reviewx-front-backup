/* ========================================
   
   ======================================== */

/**
 * 날짜 필터 섹션 컴포넌트
 *
 * 목적: 대시보드 페이지의 날짜 필터 기능을 제공하는 컴포넌트입니다.
 *
 * 📍 사용 위치:
 * - /manager_ga (GA 관리자 대시보드 메인 페이지)
 * - /manager_sa (SA 관리자 대시보드 메인 페이지)
 *
 */

"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import styles from "@/styles/manager_ga/dashboard/sections/date_filter_section.module.css";
import DateRangePickerModal, { type DateRange } from "./DateRangePickerModal";
import BaseModal from "@/components/common/modal/BaseModal";

// 날짜 필터 타입 정의
export type DateFilter = "today" | "week" | "month";

// DateFilterSection 컴포넌트의 props 타입 정의
interface DateFilterSectionProps {
  // 현재 선택된 날짜 필터
  dateFilter: DateFilter;
  // 날짜 필터 변경 함수
  onFilterChange: (filter: DateFilter) => void;
  // 커스텀 날짜 범위 변경 함수 (선택적)
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export default function DateFilterSection({
  dateFilter,
  onFilterChange,
  onDateRangeChange,
}: DateFilterSectionProps) {
  // useState: 드롭다운 열림/닫힘 상태를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [is_date_modal_open, setIsDateModalOpen] = useState(false);

  // useState: 선택된 날짜 범위를 관리하는 상태
  // 기본값: 이번 달 (오늘 날짜 기준 이번 달의 첫날 ~ 마지막날)
  // startOfMonth: 주어진 날짜의 월의 첫날을 반환합니다 (예: 2026-01-13 -> 2026-01-01)
  // endOfMonth: 주어진 날짜의 월의 마지막날을 반환합니다 (예: 2026-01-13 -> 2026-01-31)
  const [selected_date_range, setSelectedDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });

  // useState: 날짜 검증 오류 모달 상태
  const [is_error_modal_open, setIsErrorModalOpen] = useState(false);

  // useRef: 날짜 선택기 버튼의 참조를 저장하는 React Hook
  // ref는 DOM 요소에 직접 접근할 수 있게 해줍니다
  const picker_ref = useRef<HTMLDivElement>(null);

  // 날짜 필터에 따라 날짜 범위를 자동으로 업데이트하는 useEffect
  // dateFilter가 변경될 때마다 오늘 날짜 기준으로 적절한 날짜 범위를 설정합니다
  useEffect(() => {
    const today = new Date();
    let new_range: DateRange;

    switch (dateFilter) {
      case "today":
        // 오늘: 오늘 날짜만 선택 (시작일과 종료일이 동일)
        new_range = {
          from: startOfDay(today),
          to: endOfDay(today),
        };
        break;
      case "week":
        // 이번 주: 이번 주의 시작일(일요일) ~ 종료일(토요일)
        // weekStartsOn: 0은 일요일을 주의 시작으로 설정합니다
        new_range = {
          from: startOfWeek(today, { weekStartsOn: 0 }),
          to: endOfWeek(today, { weekStartsOn: 0 }),
        };
        break;
      case "month":
        // 이번 달: 이번 달의 첫날 ~ 마지막날
        new_range = {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
        break;
    }

    setSelectedDateRange(new_range);
    // 부모 컴포넌트로 날짜 범위 변경 알림
    onDateRangeChange?.(new_range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]); // onDateRangeChange는 의존성 배열에서 제외 (무한 루프 방지)

  // 외부 클릭 감지: 드롭다운 외부를 클릭하면 닫기
  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    // 드롭다운이 열려있을 때만 이벤트 리스너를 등록합니다
    if (!is_date_modal_open) return;

    // 외부 클릭을 감지하는 함수
    const handle_click_outside = (event: MouseEvent) => {
      // event.target: 클릭한 요소
      // picker_ref.current: 날짜 선택기 버튼 요소
      // contains(): 요소가 다른 요소의 자식인지 확인하는 메서드
      if (picker_ref.current && !picker_ref.current.contains(event.target as Node)) {
        // 드롭다운 외부를 클릭했으면 닫기
        setIsDateModalOpen(false);
      }
    };

    // document에 클릭 이벤트 리스너 추가
    // setTimeout을 사용하여 현재 클릭 이벤트가 처리된 후에 리스너를 추가합니다
    // 이렇게 하면 버튼을 클릭했을 때 드롭다운이 바로 닫히는 것을 방지합니다
    setTimeout(() => {
      document.addEventListener("mousedown", handle_click_outside);
    }, 0);

    // cleanup 함수: 컴포넌트가 언마운트되거나 is_date_modal_open이 변경될 때 실행됩니다
    // 이벤트 리스너를 제거하여 메모리 누수를 방지합니다
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_date_modal_open]);

  // 날짜 범위 적용 핸들러
  // 모달에서 날짜 범위를 선택하고 "적용" 버튼을 클릭했을 때 호출됩니다
  const handle_date_range_apply = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    // 부모 컴포넌트로 날짜 범위 변경 알림
    onDateRangeChange?.(range);
  };

  // 날짜 선택기 클릭 핸들러
  // 날짜 선택기를 클릭하면 모달을 엽니다
  const handle_picker_click = () => {
    setIsDateModalOpen(true);
  };

  // 날짜 범위 포맷팅 함수
  // 선택된 날짜 범위를 "YYYY-MM-DD~YYYY-MM-DD" 형식으로 변환합니다
  const format_date_range = (range: DateRange | undefined): string => {
    if (!range) {
      // 날짜 범위가 없으면 기본 텍스트 표시
      return "선택 기간 조회";
    }

    if (range.from && range.to) {
      // 시작일과 종료일이 모두 있으면 범위 형식으로 표시
      return `${format(range.from, "yyyy-MM-dd")}~${format(range.to, "yyyy-MM-dd")}`;
    } else if (range.from) {
      // 시작일만 있으면 시작일만 표시
      return `${format(range.from, "yyyy-MM-dd")}~`;
    } else {
      // 아무것도 선택하지 않았으면 기본 텍스트 표시
      return "날짜를 선택해주세요";
    }
  };

  return (
    <div className={styles.date_filter_section}>
      {/* 날짜 필터 버튼 그룹 */}
      <div className={styles.date_filter_section_button_group}>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === "today" ? styles.date_filter_section_button_active : ""
          }`}
          onClick={() => onFilterChange("today")}
        >
          오늘
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === "week" ? styles.date_filter_section_button_active : ""
          }`}
          onClick={() => onFilterChange("week")}
        >
          이번 주
        </button>
        <button
          className={`${styles.date_filter_section_button} ${
            dateFilter === "month" ? styles.date_filter_section_button_active : ""
          }`}
          onClick={() => onFilterChange("month")}
        >
          이번 달
        </button>
      </div>

      {/* 날짜 선택기 컨테이너 - relative positioning을 위해 래퍼 추가 */}
      <div className={styles.date_filter_section_picker_wrapper} ref={picker_ref}>
        {/* 날짜 선택기 - 클릭하면 드롭다운이 열립니다 */}
        <div
          className={styles.date_filter_section_picker}
          onClick={handle_picker_click}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            // 키보드 접근성: Enter나 Space 키로도 드롭다운을 열 수 있습니다
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsDateModalOpen(true);
            }
          }}
          aria-label="날짜 범위 선택"
        >
          {/* 날짜 선택 아이콘 */}
          <img
            src="/images/calendar/calendar_icon.svg"
            alt="날짜 선택"
            className={styles.date_filter_section_picker_icon}
          />
          {/* 선택된 날짜 범위를 동적으로 표시 */}
          <span>{format_date_range(selected_date_range)}</span>
        </div>

        {/* 날짜 범위 선택 드롭다운 - 버튼 바로 아래에 표시 */}
        <DateRangePickerModal
          is_open={is_date_modal_open}
          on_close={() => setIsDateModalOpen(false)}
          selected_range={selected_date_range}
          on_apply={handle_date_range_apply}
          on_validation_error={() => setIsErrorModalOpen(true)}
        />
      </div>

      {/* 날짜 검증 오류 모달 */}
      <BaseModal
        is_open={is_error_modal_open}
        on_close={() => setIsErrorModalOpen(false)}
        message="시작일과 종료일을 확인해 주세요."
        buttons={["확인"]}
        type="center"
      />
    </div>
  );
}
