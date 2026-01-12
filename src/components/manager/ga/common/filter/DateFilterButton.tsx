/* ========================================
   📅 필터 섹션용 날짜 필터 버튼 컴포넌트
   ======================================== */

/**
 * 필터 섹션용 날짜 필터 버튼 컴포넌트
 *
 * 목적: BaseFilterSection에서 사용할 날짜 필터 버튼 컴포넌트입니다.
 *       대시보드의 DateFilterSection과 동일한 방식으로 작동하지만,
 *       필터 섹션의 스타일에 맞춰 왼쪽 정렬로 위치합니다.
 *
 * 주요 기능:
 * - 날짜 범위 선택 버튼
 * - RangeCalendar를 사용한 날짜 범위 선택 모달
 * - 버튼 클릭 시 드롭다운 열기/닫기
 * - 외부 클릭 시 자동 닫기
 * - 선택된 날짜 범위 표시
 *
 * 사용 위치:
 * - BaseFilterSection의 date_filter prop
 * - FilterSection 컴포넌트들
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Image from "next/image";
import styles from "@/styles/manager/common/campaign/progress/filter_section.module.css";
import date_filter_styles from "@/styles/manager_ga/common/filter/date_filter.module.css";
import DateRangePickerModal, {
  type DateRange,
} from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import BaseModal from "@/components/common/modal/BaseModal";

// DateFilterButton 컴포넌트의 props 타입 정의
interface DateFilterButtonProps {
  // 현재 선택된 날짜 범위
  selected_range?: DateRange;
  // 날짜 범위 변경 함수
  on_range_change?: (range: DateRange | undefined) => void;
}

/**
 * 필터 섹션용 날짜 필터 버튼 컴포넌트
 *
 * 필터 섹션의 스타일에 맞춰 왼쪽 정렬로 위치하는 날짜 필터 버튼입니다.
 * 버튼을 클릭하면 버튼 왼쪽 아래에 드롭다운이 표시됩니다.
 */
export default function DateFilterButton({
  selected_range,
  on_range_change,
}: DateFilterButtonProps) {
  // useState: 드롭다운 열림/닫힘 상태를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [is_date_modal_open, setIsDateModalOpen] = useState(false);

  // useState: 선택된 날짜 범위를 관리하는 상태
  // 📌 Hydration 오류 방지:
  // - 초기값을 undefined로 설정하여 서버와 클라이언트가 동일한 초기값을 사용합니다
  // - 클라이언트에서만 실제 날짜 범위를 설정합니다
  const [selected_date_range, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  // useState: 클라이언트 마운트 여부 (Hydration 오류 방지용)
  // 서버 사이드에서는 false, 클라이언트에서 마운트되면 true가 됩니다
  const [is_mounted, setIsMounted] = useState(false);

  // useState: 날짜 검증 오류 모달 상태
  const [is_error_modal_open, setIsErrorModalOpen] = useState(false);

  // useRef: 날짜 선택기 버튼의 참조를 저장하는 React Hook
  // ref는 DOM 요소에 직접 접근할 수 있게 해줍니다
  const picker_ref = useRef<HTMLDivElement>(null);

  // useEffect: 클라이언트에서만 실행되어 마운트 상태를 true로 설정
  // 📌 Hydration 오류 방지:
  // - 서버 사이드에서는 실행되지 않으므로 서버와 클라이언트의 초기 렌더링 결과가 동일합니다
  // - 클라이언트에서 마운트된 후에만 날짜 범위를 표시합니다
  useEffect(() => {
    setIsMounted(true);
    // props로 받은 selected_range를 내부 상태에 설정
    setSelectedDateRange(selected_range);
  }, [selected_range]);

  // props로 받은 selected_range가 변경되면 내부 상태도 업데이트
  // is_mounted가 true인 경우에만 업데이트 (Hydration 오류 방지)
  useEffect(() => {
    if (is_mounted) {
      setSelectedDateRange(selected_range);
    }
  }, [selected_range, is_mounted]);

  // 외부 클릭 감지: 드롭다운 외부를 클릭하면 닫기
  useEffect(() => {
    // 드롭다운이 열려있을 때만 이벤트 리스너를 등록합니다
    if (!is_date_modal_open) return;

    // 외부 클릭을 감지하는 함수
    const handle_click_outside = (event: MouseEvent) => {
      // event.target: 클릭한 요소
      // picker_ref.current: 날짜 선택기 버튼 요소
      // contains(): 요소가 다른 요소의 자식인지 확인하는 메서드
      if (
        picker_ref.current &&
        !picker_ref.current.contains(event.target as Node)
      ) {
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

  // 날짜 범위 검증 함수
  // 시작일이 종료일보다 늦거나 종료일이 시작일보다 빠른지 확인합니다
  const validate_date_range = (range: DateRange | undefined): boolean => {
    // 날짜 범위가 없으면 통과 (초기화 시)
    if (!range || !range.from || !range.to) {
      return true;
    }

    // 시작일과 종료일을 Date 객체로 변환
    const from_date = new Date(range.from);
    const to_date = new Date(range.to);

    // 시간 부분을 제거하여 날짜만 비교
    from_date.setHours(0, 0, 0, 0);
    to_date.setHours(0, 0, 0, 0);

    // 시작일이 종료일보다 늦으면 오류
    if (from_date > to_date) {
      return false;
    }

    return true;
  };

  // 날짜 범위 적용 핸들러
  // 모달에서 날짜 범위를 선택했을 때 호출됩니다
  const handle_date_range_apply = (range: DateRange | undefined) => {
    // 날짜 범위 검증
    if (!validate_date_range(range)) {
      // 검증 실패 시 오류 모달 표시
      setIsErrorModalOpen(true);
      return;
    }

    // 검증 통과 시 날짜 범위 적용
    setSelectedDateRange(range);
    // 부모 컴포넌트로 날짜 범위 변경 알림
    on_range_change?.(range);
  };

  // 날짜 선택기 클릭 핸들러
  // 날짜 선택기를 클릭하면 모달을 엽니다
  const handle_picker_click = () => {
    setIsDateModalOpen(!is_date_modal_open);
  };

  // 날짜 범위 포맷팅 함수
  // 선택된 날짜 범위를 "YYYY-MM-DD ~ YYYY-MM-DD" 형식으로 변환합니다
  // 📌 Hydration 오류 방지:
  // - is_mounted가 false인 경우 (서버 사이드 또는 초기 렌더링) 항상 "선택 기간 조회"를 반환합니다
  // - 클라이언트에서 마운트된 후에만 실제 날짜 범위를 표시합니다
  const format_date_range = (range: DateRange | undefined): string => {
    // 클라이언트에서 마운트되지 않았으면 기본 텍스트 표시 (Hydration 오류 방지)
    if (!is_mounted) {
      return "선택 기간 조회";
    }

    if (!range) {
      // 날짜 범위가 없으면 기본 텍스트 표시
      return "선택 기간 조회";
    }

    if (range.from && range.to) {
      // 시작일과 종료일이 모두 있으면 범위 형식으로 표시
      // format 함수: date-fns 라이브러리의 함수로, 날짜를 원하는 형식으로 변환합니다
      // "yyyy-MM-dd": 년도 4자리-월 2자리-일 2자리 형식
      return `${format(range.from, "yyyy-MM-dd")} ~ ${format(
        range.to,
        "yyyy-MM-dd"
      )}`;
    } else if (range.from) {
      // 시작일만 있으면 시작일만 표시
      return `${format(range.from, "yyyy-MM-dd")} ~`;
    } else {
      // 아무것도 선택하지 않았으면 기본 텍스트 표시
      return "선택 기간 조회";
    }
  };

  return (
    <div
      className={date_filter_styles.date_filter_button_wrapper}
      ref={picker_ref}
    >
      {/* 날짜 선택기 버튼 - 필터 아이템 스타일 사용 */}
      <div
        className={styles.filter_item}
        onClick={handle_picker_click}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          // 키보드 접근성: Enter나 Space 키로도 드롭다운을 열 수 있습니다
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDateModalOpen(!is_date_modal_open);
          }
        }}
        aria-label="날짜 범위 선택"
      >
        {/* 날짜 선택 아이콘 - 캘린더 아이콘 SVG 사용 */}
        <div className={styles.filter_icon}>
          <Image
            src="/images/calendar/calendar_icon.svg"
            alt="날짜 선택"
            width={16}
            height={16}
          />
        </div>
        {/* 선택된 날짜 범위를 동적으로 표시 */}
        <span className={styles.filter_text}>
          {format_date_range(selected_date_range)}
        </span>
      </div>

      {/* 날짜 범위 선택 드롭다운 - 버튼 왼쪽 아래에 표시 */}
      <DateRangePickerModal
        is_open={is_date_modal_open}
        on_close={() => setIsDateModalOpen(false)}
        selected_range={selected_date_range}
        on_apply={handle_date_range_apply}
        align="left"
      />

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
