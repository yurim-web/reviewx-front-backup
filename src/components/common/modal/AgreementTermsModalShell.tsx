/* ========================================
   약관 보기 모달 공통 레이아웃 (셸)
   ========================================
   리뷰어/파트너 약관 모달 공통: 오버레이, 헤더(제목+닫기), 스크롤 본문.
   내용은 각 모달에서 children으로 주입.

   사용처:
   - src/components/user/signup/TermsViewModal.tsx
   - src/components/partner/signup/PartnerTermsViewModal.tsx
   ======================================== */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import baseModalStyles from "@/styles/common/modal/base_modal.module.css";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";

export interface AgreementTermsModalShellProps {
  is_open: boolean;
  on_close: () => void;
  title: string;
  /** 헤더 제목 id (aria-labelledby용) */
  title_id: string;
  children: ReactNode;
}

export default function AgreementTermsModalShell({
  is_open,
  on_close,
  title,
  title_id,
  children,
}: AgreementTermsModalShellProps) {
  const body_ref = useRef<HTMLDivElement>(null);
  const [has_scroll, set_has_scroll] = useState(false);

  useEffect(() => {
    if (!is_open) return;
    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") on_close();
    };
    window.addEventListener("keydown", handle_escape);
    return () => window.removeEventListener("keydown", handle_escape);
  }, [is_open, on_close]);

  useEffect(() => {
    if (!is_open) {
      set_has_scroll(false);
      return;
    }
    const el = body_ref.current;
    if (!el) return;
    const check = () => {
      set_has_scroll(el.scrollHeight > el.clientHeight);
    };
    const id = requestAnimationFrame(() => check());
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [is_open, children]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  return (
    <div
      className={baseModalStyles.modal_overlay_center}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title_id}
    >
      <div
        className={modalStyles.terms_modal_wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.terms_modal_card}>
          <div
            className={modalStyles.terms_modal_header}
            role="banner"
            aria-label={title}
          >
            <h2
              id={title_id}
              className={modalStyles.terms_modal_title}
            >
              {title}
            </h2>
            <button
              type="button"
              className={modalStyles.terms_modal_close_btn}
              onClick={on_close}
              aria-label="닫기"
            >
              <Image
                src="/images/filter/x_icon.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </div>

          <div
            className={`${modalStyles.terms_modal_body} ${has_scroll ? modalStyles.terms_modal_body_has_scroll : ""}`.trim()}
          >
            <div
              ref={body_ref}
              className={`${modalStyles.terms_modal_body_scroll} ${has_scroll ? modalStyles.terms_modal_body_scroll_has_scroll : ""}`.trim()}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
