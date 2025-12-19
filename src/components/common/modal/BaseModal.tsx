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
  /** 모달에 표시할 메시지 (하드코딩 텍스트) */
  message: string;
  /** 버튼 라벨 배열 (1개 또는 2개) */
  buttons?: string[];
  /** 확인 버튼 클릭 핸들러 (버튼이 두 개일 때 두 번째 버튼) */
  on_confirm?: () => void;
  /** 모달 형태 (기본값: "center") */
  type?: ModalType;
  /** 오버레이 클릭으로 닫기 여부 (기본값: true) */
  close_on_overlay_click?: boolean;
  /** ESC 키로 닫기 여부 (기본값: true) */
  close_on_escape?: boolean;
}

/**
 * 통합 모달 컴포넌트
 */
export default function BaseModal({
  is_open,
  on_close,
  message,
  buttons: prop_buttons,
  on_confirm,
  type = "center",
  close_on_overlay_click = true,
  close_on_escape = true,
}: BaseModalProps) {
  const buttons =
    prop_buttons && prop_buttons.length > 0 ? prop_buttons : ["닫기"];
  const has_two_buttons = buttons.length === 2;

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

  // 모달이 열릴 때 body 스크롤 잠금 (스크롤바 너비 고려)
  useEffect(() => {
    if (is_open) {
      // 현재 스크롤바 너비 계산
      const scrollbar_width =
        window.innerWidth - document.documentElement.clientWidth;

      // 원래 스타일 저장
      const original_overflow = document.body.style.overflow;
      const original_padding_right = document.body.style.paddingRight;

      // 스크롤 잠금 및 스크롤바 너비만큼 padding 추가
      document.body.style.overflow = "hidden";
      if (scrollbar_width > 0) {
        document.body.style.paddingRight = `${scrollbar_width}px`;
      }

      // 정리 함수: 원래 상태로 복원
      return () => {
        document.body.style.overflow = original_overflow;
        document.body.style.paddingRight = original_padding_right;
      };
    }
  }, [is_open]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!is_open) return null;

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
        {/* 모달 메시지 */}
        <div className={styles.modal_content}>
          <div className={styles.modal_message_wrapper}>
            <p className={styles.modal_message_text}>{message}</p>
          </div>

          {/* 모달 푸터 버튼 */}
          <div className={styles.modal_footer}>
            {has_two_buttons ? (
              <>
                {/* 두 개 버튼: 취소, 확인 */}
                <button
                  onClick={on_close}
                  className={styles.modal_footer_button_cancel}
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
