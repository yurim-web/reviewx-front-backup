/* ========================================
   📋 텍스트 입력 모달 컴포넌트
   ======================================== */

/**
 * 텍스트 입력 모달 컴포넌트
 *
 * 목적: 프로젝트 전반에서 사용할 수 있는 텍스트 입력 모달 컴포넌트입니다.
 *       textarea를 사용하여 사용자 입력을 받을 수 있습니다.
 *
 * 주요 기능:
 * - 제목과 textarea 입력 필드 제공
 * - 버튼이 하나일 때와 두 개일 때 자동 처리
 * - 스크롤바 너비 고려한 레이아웃 유지
 * - ESC 키, 오버레이 클릭으로 닫기
 * - 입력값 제어 (value, onChange)
 *
 * 사용 예시:
 * - 등록 기한 연장 요청 모달
 * - 사유 입력이 필요한 모든 모달
 */

"use client";

import { useEffect } from "react";
import styles from "@/styles/common/modal/textarea_modal.module.css";
import CommonTextarea from "@/components/common/textarea/CommonTextarea";

export type TextareaModalType = "center" | "bottom";
export type TextareaModalVariant = "default" | "reject" | "extend";

export interface TextareaModalProps {
  /** 모달 열림/닫힘 상태 */
  is_open: boolean;
  /** 모달 닫기 함수 */
  on_close: () => void;
  /** 모달 제목 */
  title: string;
  /** textarea의 현재 값 */
  value: string;
  /** textarea 값 변경 핸들러 (readOnly일 때는 선택적) */
  onChange?: (value: string) => void;
  /** textarea placeholder 텍스트 */
  placeholder?: string;
  /** 읽기 전용 모드 (기본값: false) */
  readOnly?: boolean;
  /** 제목 색상 (기본값: #444, readOnly일 때는 #ff2626) */
  titleColor?: string;
  /** 버튼 라벨 배열 (1개 또는 2개) */
  buttons?: string[];
  /** 취소 버튼 클릭 핸들러 (버튼이 두 개일 때 첫 번째 버튼, 기본값: on_close) */
  on_cancel?: () => void;
  /** 확인 버튼 클릭 핸들러 (버튼이 두 개일 때 두 번째 버튼) */
  on_confirm?: () => void;
  /** 모달 형태 (기본값: "center") */
  type?: TextareaModalType;
  /** 모달 변형 (기본값: "default", "reject"일 때 반려 모달 스타일 적용) */
  variant?: TextareaModalVariant;
  /** 오버레이 클릭으로 닫기 여부 (기본값: true) */
  close_on_overlay_click?: boolean;
  /** ESC 키로 닫기 여부 (기본값: true) */
  close_on_escape?: boolean;
  /** textarea 에러 상태 (기본값: false, true일 때 빨간 테두리 표시) */
  has_error?: boolean;
}

/**
 * 텍스트 입력 모달 컴포넌트
 */
export default function TextareaModal({
  is_open,
  on_close,
  title,
  value,
  onChange,
  placeholder = "사유 입력",
  readOnly = false,
  titleColor,
  buttons: prop_buttons,
  on_cancel,
  on_confirm,
  type = "center",
  variant = "default",
  close_on_overlay_click = true,
  close_on_escape = true,
  has_error = false,
}: TextareaModalProps) {
  const buttons =
    prop_buttons && prop_buttons.length > 0 ? prop_buttons : ["닫기"];
  const has_two_buttons = buttons.length === 2;
  const is_reject_variant = variant === "reject";
  const is_extend_variant = variant === "extend";

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

  // 취소 버튼 클릭 핸들러
  const handle_cancel = () => {
    if (on_cancel) {
      on_cancel();
    } else {
      on_close();
    }
  };

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    if (on_confirm) {
      on_confirm();
    }
    on_close();
  };

  // 오버레이 클릭 핸들러
  const handle_overlay_click = (e: React.MouseEvent) => {
    if (close_on_overlay_click && e.target === e.currentTarget) {
      on_close();
    }
  };

  // textarea 값 변경 핸들러
  const handle_textarea_change = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (onChange && !readOnly) {
      onChange(e.target.value);
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
          <h2
            className={styles.modal_title}
            style={
              titleColor
                ? { color: titleColor }
                : is_extend_variant
                ? { color: "#444444" }
                : readOnly
                ? { color: "#ff2626" }
                : undefined
            }
          >
            {title}
          </h2>

          {/* 텍스트 입력 영역 */}
          <CommonTextarea
            value={value}
            onChange={handle_textarea_change}
            placeholder={placeholder}
            rows={5}
            readOnly={readOnly}
            disabled={readOnly}
            has_error={readOnly || is_reject_variant || has_error}
            className={`${readOnly ? styles.modal_textarea_readonly : ""} ${
              is_reject_variant ? styles.modal_textarea_reject : ""
            }`.trim()}
            stop_propagation={true}
          />

          {/* 모달 푸터 버튼 */}
          <div className={styles.modal_footer}>
            {has_two_buttons ? (
              <>
                {/* 두 개 버튼: 취소/거절, 확인/승인 */}
                {is_extend_variant ? (
                  <>
                    {/* 연장 모달: 거절(빨간색), 승인(회색) */}
                    <button
                      onClick={handle_cancel}
                      className={styles.modal_footer_button_reject}
                    >
                      {buttons[0]}
                    </button>
                    <button
                      onClick={handle_confirm}
                      className={styles.modal_footer_button_confirm}
                    >
                      {buttons[1]}
                    </button>
                  </>
                ) : (
                  <>
                    {/* 일반 모달: 취소(회색), 확인(회색/빨간색) */}
                    <button
                      onClick={handle_cancel}
                      className={styles.modal_footer_button_cancel}
                    >
                      {buttons[0]}
                    </button>
                    <button
                      onClick={handle_confirm}
                      className={`${styles.modal_footer_button_confirm} ${
                        is_reject_variant
                          ? styles.modal_footer_button_reject
                          : ""
                      }`}
                    >
                      {buttons[1]}
                    </button>
                  </>
                )}
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
