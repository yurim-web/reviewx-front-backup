/* ========================================
   📅 날짜 범위 선택 모달 컴포넌트 (스카이스캐너 스타일)
   ======================================== */

/**
 * 날짜 범위 선택 모달 컴포넌트
 *
 * 목적: 스카이스캐너처럼 이전/다음 달의 날짜를 함께 표시하는 날짜 범위 선택 모달입니다.
 *
 * 주요 기능:
 * - 날짜 범위 선택 (시작일 ~ 종료일)
 * - 이전/다음 달 날짜 자동 표시 (회색으로 표시됨)
 * - 2개월 동시 표시
 * - 한국어 로케일 지원
 *
 *
 * 사용 라이브러리:
 * - react-day-picker: 달력 UI 라이브러리
 * - date-fns: 날짜 포맷팅 유틸리티
 */

"use client";

import { useState, useEffect } from "react";
import {
  DayPicker,
  type DateRange as DayPickerDateRange,
} from "react-day-picker";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import styles from "@/styles/manager_ga/dashboard/sections/date_range_picker_modal.module.css";

// 선택된 날짜 범위의 타입 정의
// react-day-picker의 DateRange 타입을 사용하되, 우리 프로젝트에서 사용하기 편하게 export합니다
// from: 시작일 (undefined일 수 있음 - 아직 선택 안 했을 때)
// to: 종료일 (undefined일 수 있음 - 아직 선택 안 했을 때)
export type DateRange = DayPickerDateRange;

// DateRangePickerModal 컴포넌트의 props 타입 정의
interface DateRangePickerModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 날짜 범위
  selected_range: DateRange | undefined;
  // 날짜 범위 적용 함수 (선택된 날짜 범위를 부모 컴포넌트로 전달)
  on_apply: (range: DateRange | undefined) => void;
}

/**
 * 날짜 범위 선택 모달 컴포넌트
 *
 * 스카이스캐너처럼 이전/다음 달 날짜를 함께 표시합니다.
 */
export default function DateRangePickerModal({
  is_open,
  on_close,
  selected_range,
  on_apply,
}: DateRangePickerModalProps) {
  // 모달 내부에서 관리하는 임시 선택 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [temp_range, set_temp_range] = useState<DateRange | undefined>(
    selected_range
  );

  // 모달이 열릴 때마다 임시 선택 상태를 초기화
  // useEffect는 React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  // 의존성 배열 [is_open, selected_range]: 이 값들이 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 모달이 열릴 때: 현재 선택된 날짜 범위로 초기화
      set_temp_range(selected_range);
    }
  }, [is_open, selected_range]);

  // 날짜 범위 적용 핸들러
  // "적용" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_apply = () => {
    // 부모 컴포넌트의 on_apply 함수를 호출하여 선택된 날짜 범위를 전달
    // temp_range가 undefined일 수 있으므로 기본값으로 빈 범위를 전달
    on_apply(temp_range || { from: undefined, to: undefined });
    // 모달 닫기
    on_close();
  };

  // 선택 초기화 핸들러
  // "초기화" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_reset = () => {
    // 빈 범위로 초기화
    set_temp_range(undefined);
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
          <h3 className={styles.modal_title}>날짜 선택</h3>
          <button className={styles.modal_close_button} onClick={on_close}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 - 달력 */}
        <div className={styles.modal_body}>
          {/* 
            DayPicker 컴포넌트: react-day-picker 라이브러리의 달력 컴포넌트
            
            props 설명:
            - mode="range": 날짜 범위 선택 모드 (시작일~종료일)
            - selected: 현재 선택된 날짜 범위
            - onSelect: 날짜를 선택했을 때 실행되는 함수 (set_temp_range를 전달)
            - locale={ko}: 한국어 로케일 설정 (월, 요일이 한글로 표시됨)
            - showOutsideDays={true}: 이전/다음 달의 날짜도 표시 (회색으로 표시됨) ← 핵심!
            - numberOfMonths={2}: 2개월을 동시에 표시 (스카이스캐너처럼)
            - className: CSS 클래스명 (스타일링용)
            - disabled: 선택 불가능한 날짜 설정 (예: 오늘 이전 날짜)
          */}
          <DayPicker
            mode="range"
            selected={temp_range}
            onSelect={(range) => {
              // onSelect는 DateRange | undefined를 반환합니다
              // range가 undefined일 수 있습니다 (선택 취소 시)
              set_temp_range(range);
            }}
            locale={ko}
            showOutsideDays={true} // ← 스카이스캐너 스타일: 이전/다음 달 날짜 표시!
            numberOfMonths={2} // 2개월 동시 표시
            className={styles.date_picker}
          />
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          {/* 선택된 날짜 범위 미리보기 */}
          <div className={styles.date_preview}>
            {temp_range?.from && temp_range?.to ? (
              <span>
                {format(temp_range.from, "yyyy-MM-dd")} ~{" "}
                {format(temp_range.to, "yyyy-MM-dd")}
              </span>
            ) : temp_range?.from ? (
              <span>{format(temp_range.from, "yyyy-MM-dd")} ~</span>
            ) : (
              <span className={styles.date_preview_empty}>
                날짜를 선택해주세요
              </span>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className={styles.button_group}>
            <button className={styles.reset_button} onClick={handle_reset}>
              <div
                className={styles.reset_icon}
                style={{ backgroundImage: "url('/images/filter/x_small.svg')" }}
              ></div>
              초기화
            </button>
            <button
              className={styles.apply_button}
              onClick={handle_apply}
              disabled={!temp_range?.from || !temp_range?.to}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
