/* ========================================
   🚨 신고 모달 컴포넌트
   ======================================== */

/**
 * 신고 모달 컴포넌트
 *
 * 목적: 콘텐츠 신고 시 사용하는 모달 컴포넌트입니다.
 *       라디오 버튼으로 신고 사유를 선택하고, "기타" 옵션 선택 시 추가 사유를 입력할 수 있습니다.
 *
 * 주요 기능:
 * - 라디오 버튼으로 신고 사유 선택
 * - "기타" 옵션 선택 시 textarea 표시
 * - 스크롤바 너비 고려한 레이아웃 유지
 * - ESC 키, 오버레이 클릭으로 닫기
 *
 * 사용 예시:
 * - 콘텐츠 신고 모달
 * - 신고 사유 선택이 필요한 모든 모달
 */

"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/common/modal/report_modal.module.css";

export type ReportModalType = "center" | "bottom";

export interface ReportOption {
  /** 옵션 값 (고유 식별자) */
  value: string;
  /** 옵션 라벨 (표시 텍스트) */
  label: string;
  /** 기타 옵션 여부 (true일 때 선택 시 textarea 표시) */
  isOther?: boolean;
}

export interface ReportModalProps {
  /** 모달 열림/닫힘 상태 */
  is_open: boolean;
  /** 모달 닫기 함수 */
  on_close: () => void;
  /** 모달 제목 */
  title?: string;
  /** 신고 사유 옵션 배열 */
  options: ReportOption[];
  /** 선택된 옵션 값 */
  selectedOption?: string;
  /** 옵션 선택 핸들러 */
  onOptionChange?: (value: string) => void;
  /** 기타 사유 입력값 */
  otherReason?: string;
  /** 기타 사유 변경 핸들러 */
  onOtherReasonChange?: (value: string) => void;
  /** 버튼 라벨 배열 (1개 또는 2개) */
  buttons?: string[];
  /** 확인 버튼 클릭 핸들러 (버튼이 두 개일 때 두 번째 버튼) */
  on_confirm?: (selectedOption: string, otherReason?: string) => void;
  /** 모달 형태 (기본값: "center") */
  type?: ReportModalType;
  /** 오버레이 클릭으로 닫기 여부 (기본값: true) */
  close_on_overlay_click?: boolean;
  /** ESC 키로 닫기 여부 (기본값: true) */
  close_on_escape?: boolean;
}

/**
 * 신고 모달 컴포넌트
 */
export default function ReportModal({
  is_open,
  on_close,
  title = "콘텐츠 신고",
  options,
  selectedOption: prop_selectedOption,
  onOptionChange,
  otherReason: prop_otherReason,
  onOtherReasonChange,
  buttons: prop_buttons,
  on_confirm,
  type = "center",
  close_on_overlay_click = true,
  close_on_escape = true,
}: ReportModalProps) {
  const buttons =
    prop_buttons && prop_buttons.length > 0 ? prop_buttons : ["취소", "신고"];
  const has_two_buttons = buttons.length === 2;

  // 내부 상태 관리 (제어되지 않는 경우)
  const [internal_selectedOption, setInternal_selectedOption] =
    useState<string>(options[0]?.value || "");
  const [internal_otherReason, setInternal_otherReason] = useState<string>("");

  // 제어/비제어 컴포넌트 처리
  const is_controlled = prop_selectedOption !== undefined;
  const selectedOption = is_controlled
    ? prop_selectedOption
    : internal_selectedOption;
  const otherReason = is_controlled
    ? prop_otherReason || ""
    : internal_otherReason;

  // 선택된 옵션이 "기타" 옵션인지 확인
  const selectedOptionData = options.find(
    (opt) => opt.value === selectedOption,
  );
  const showOtherReason = selectedOptionData?.isOther === true;

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!is_open || !close_on_escape) return;

    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        on_close();
      }
    };

    window.addEventListener("keydown", handle_escape);
    return () => window.removeEventListener("keydown", handle_escape);
  }, [is_open, close_on_escape, on_close]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!is_open) return null;

  // 옵션 변경 핸들러
  const handle_option_change = (value: string) => {
    if (is_controlled) {
      onOptionChange?.(value);
    } else {
      setInternal_selectedOption(value);
    }
  };

  // 기타 사유 변경 핸들러
  const handle_other_reason_change = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    if (is_controlled) {
      onOtherReasonChange?.(value);
    } else {
      setInternal_otherReason(value);
    }
  };

  // 확인 버튼 클릭 핸들러 (기타 사유 미입력 시에는 버튼이 비활성화되어 호출되지 않음)
  const handle_confirm = () => {
    if (on_confirm) {
      on_confirm(selectedOption, showOtherReason ? otherReason : undefined);
    }
    on_close();
  };

  // 오버레이 클릭 핸들러
  const handle_overlay_click = (e: React.MouseEvent) => {
    if (close_on_overlay_click && e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모달 타입에 따른 클래스명 결정
  const overlay_class =
    type === "center"
      ? styles.modal_overlay_center
      : styles.modal_overlay_bottom;
  const container_class =
    type === "center"
      ? styles.modal_container_center
      : styles.modal_container_bottom;

  return (
    <div
      className={overlay_class}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
    >
      <div className={container_class} onClick={(e) => e.stopPropagation()}>
        {/* 모달 콘텐츠 */}
        <div className={styles.modal_content}>
          {/* 모달 제목 */}
          <h2 className={styles.modal_title}>{title}</h2>

          {/* 신고 사유 옵션 리스트 */}
          <div className={styles.options_list}>
            {options.map((option) => (
              <label key={option.value} className={styles.option_item}>
                <input
                  type="radio"
                  name="report-reason"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={() => handle_option_change(option.value)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>{option.label}</span>
              </label>
            ))}
          </div>

          {/* 기타 사유 입력 영역 (기타 옵션 선택 시 표시) */}
          {showOtherReason && (
            <div className={styles.other_reason_wrapper}>
              <textarea
                className={styles.other_reason_textarea}
                value={otherReason}
                onChange={handle_other_reason_change}
                placeholder="사유 입력"
                rows={5}
              />
            </div>
          )}

          {/* 모달 푸터 버튼 */}
          <div className={styles.modal_footer}>
            {has_two_buttons ? (
              <>
                {/* 두 개 버튼: 취소, 신고 */}
                <button
                  onClick={on_close}
                  className={styles.modal_footer_button_cancel}
                >
                  {buttons[0]}
                </button>
                <button
                  type="button"
                  onClick={handle_confirm}
                  className={styles.modal_footer_button_confirm}
                  disabled={showOtherReason && !otherReason.trim()}
                >
                  {buttons[1]}
                </button>
              </>
            ) : (
              <>
                {/* 하나 버튼: 닫기 (전체 너비) */}
                <button
                  onClick={on_close}
                  className={styles.modal_footer_button_single}
                >
                  {buttons[0]}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
