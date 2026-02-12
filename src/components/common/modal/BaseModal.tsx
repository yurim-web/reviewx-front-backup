/* ========================================
   📋 통합 모달 컴포넌트
   ======================================== */

/**
 * 통합 모달 컴포넌트
 *
 * 목적: 프로젝트 전반에서 사용할 수 있는 통합 모달 컴포넌트입니다.
 *       메시지 코드를 사용하여 메시지와 버튼을 자동으로 구성합니다.
 *
 * 주요 기능:
 * - 메시지 코드 기반 모달 (A_M 코드 사용)
 * - 버튼이 하나일 때와 두 개일 때 자동 처리
 * - 스크롤바 너비 고려한 레이아웃 유지
 * - ESC 키, 오버레이 클릭으로 닫기
 *
 */

"use client";

import { useEffect } from "react";
import styles from "@/styles/common/modal/base_modal.module.css";

export type ModalType = "center" | "bottom";

export interface BaseModalProps {
  /** 모달 열림/닫힘 상태 */
  is_open: boolean;
  /** 모달 닫기 함수 */
  on_close: () => void;
  /** 모달에 표시할 메시지 (HTML 태그 지원, 예: <br> 태그 사용 가능) */
  message: string;
  /** 버튼 라벨 배열 (1개 또는 2개) */
  buttons?: string[];
  /** 취소 버튼 클릭 핸들러 (버튼이 두 개일 때 첫 번째 버튼, 기본값: on_close) */
  on_cancel?: () => void;
  /** 확인 버튼 클릭 핸들러 (버튼이 두 개일 때 두 번째 버튼) */
  on_confirm?: () => void;
  /** 버튼 영역 레이아웃 (기본값: "row") */
  button_layout?: "row" | "column";
  /**
   * 버튼이 2개이고 button_layout이 "column"일 때,
   * 확인(핑크) 버튼을 위로 올릴지 여부 (기본값: false)
   */
  confirm_first?: boolean;
  /** 모달 형태 (기본값: "center") */
  type?: ModalType;
  /** 오버레이 클릭으로 닫기 여부 (기본값: true) */
  close_on_overlay_click?: boolean;
  /** ESC 키로 닫기 여부 (기본값: true) */
  close_on_escape?: boolean;
  /** 확인 버튼 색상 변형 (기본값: "pink") */
  button_variant?: "pink" | "red";
}

/**
 * 통합 모달 컴포넌트
 */
export default function BaseModal({
  is_open,
  on_close,
  message,
  buttons: prop_buttons,
  on_cancel,
  on_confirm,
  button_layout = "row",
  confirm_first = false,
  type = "center",
  close_on_overlay_click = true,
  close_on_escape = true,
  button_variant = "pink",
}: BaseModalProps) {
  const buttons =
    prop_buttons && prop_buttons.length > 0 ? prop_buttons : ["닫기"];
  const has_two_buttons = buttons.length === 2;
  const is_column_layout = button_layout === "column";
  const should_confirm_first = is_column_layout && confirm_first;

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

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    if (on_confirm) {
      on_confirm();
    }
    on_close();
  };

  // 취소 버튼 클릭 핸들러
  const handle_cancel = () => {
    if (on_cancel) {
      on_cancel();
      return;
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
  const footer_class = is_column_layout
    ? `${styles.modal_footer} ${styles.modal_footer_column}`
    : styles.modal_footer;
  
  // 확인 버튼 색상 클래스 결정
  const confirm_button_class = button_variant === "red"
    ? styles.modal_footer_button_confirm_red
    : styles.modal_footer_button_confirm_pink;

  return (
    <div
      className={overlay_class}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
    >
      <div className={container_class} onClick={(e) => e.stopPropagation()}>
        {/* 모달 메시지 */}
        <div className={styles.modal_content}>
          <div className={styles.modal_message_wrapper}>
            <p
              className={styles.modal_message_text}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>

          {/* 모달 푸터 버튼 */}
          <div className={footer_class}>
            {has_two_buttons ? (
              <>
                {should_confirm_first ? (
                  <>
                    {/* 두 개 버튼(세로): 확인(위), 취소(아래) */}
                    <button
                      onClick={handle_confirm}
                      className={confirm_button_class}
                    >
                      {buttons[1]}
                    </button>
                    <button
                      onClick={handle_cancel}
                      className={styles.modal_footer_button_cancel}
                    >
                      {buttons[0]}
                    </button>
                  </>
                ) : (
                  <>
                    {/* 두 개 버튼: 취소, 확인 */}
                    <button
                      onClick={handle_cancel}
                      className={styles.modal_footer_button_cancel}
                    >
                      {buttons[0]}
                    </button>
                    <button
                      onClick={handle_confirm}
                      className={confirm_button_class}
                    >
                      {buttons[1]}
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {/* 하나 버튼: 닫기 또는 확인 (전체 너비) */}
                <button
                  onClick={on_confirm ? handle_confirm : on_close}
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
