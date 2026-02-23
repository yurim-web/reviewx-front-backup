/* ========================================
   인증번호를 받지 못 하셨나요? 도움말 모달
   ======================================== */

/**
 * Figma 기획: 인증번호 미수신 시 클릭하면 노출되는 모달
 * - 제목: "인증번호를 받지 못 하셨나요?"
 * - 안내 문구 3가지 (불릿)
 * - 버튼: 인증번호 재발송, 다른 전화번호로 변경, 닫기
 */

"use client";

import { useEffect } from "react";
import baseModalStyles from "@/styles/common/modal/base_modal.module.css";
import helpModalStyles from "@/styles/common/phone_verification/verification_help_modal.module.css";

export interface VerificationHelpModalProps {
  is_open: boolean;
  on_close: () => void;
  /** 인증번호 재발송 클릭 시 */
  on_resend: () => void | Promise<void>;
  /** 다른 전화번호로 변경 클릭 시 (기본: 모달만 닫기) */
  on_change_phone?: () => void;
}

const HELP_ITEMS = [
  "인증을 요청한 전화번호가 정확한지 확인해 주세요.",
  "통신사에 따라 인증번호 발송이 늦어질 수 있습니다.",
  "인증번호를 재발송해도 계속 받지 못했다면 고객센터로 문의해 주세요.",
];

export default function VerificationHelpModal({
  is_open,
  on_close,
  on_resend,
  on_change_phone,
}: VerificationHelpModalProps) {
  useEffect(() => {
    if (!is_open) return;
    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") on_close();
    };
    window.addEventListener("keydown", handle_escape);
    return () => window.removeEventListener("keydown", handle_escape);
  }, [is_open, on_close]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  const handle_resend = async () => {
    await on_resend();
    on_close();
  };

  const handle_change_phone = () => {
    on_change_phone?.();
    on_close();
  };

  return (
    <div
      className={baseModalStyles.modal_overlay_center}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification_help_modal_title"
    >
      <div
        className={baseModalStyles.modal_container_center}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={baseModalStyles.modal_content}>
          <h2
            id="verification_help_modal_title"
            className={helpModalStyles.verification_help_modal_title}
          >
            인증번호를 받지 못 하셨나요?
          </h2>
          <ul className={helpModalStyles.verification_help_modal_list}>
            {HELP_ITEMS.map((text, i) => (
              <li
                key={i}
                className={helpModalStyles.verification_help_modal_list_item}
              >
                {text}
              </li>
            ))}
          </ul>
          <div
            className={`${baseModalStyles.modal_footer} ${baseModalStyles.modal_footer_column}`}
          >
            <button
              type="button"
              className={baseModalStyles.modal_footer_button_confirm_pink}
              onClick={handle_resend}
            >
              인증번호 재발송
            </button>
            <button
              type="button"
              className={
                helpModalStyles.verification_help_modal_button_secondary
              }
              onClick={handle_change_phone}
            >
              다른 전화번호로 변경
            </button>
            <button
              type="button"
              className={baseModalStyles.modal_footer_button_single}
              onClick={on_close}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
