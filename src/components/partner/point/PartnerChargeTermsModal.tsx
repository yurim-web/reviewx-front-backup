/* ========================================
   파트너 포인트 충전 - 결제·환불 및 이용약관 보기 모달
   ========================================
   사용처: /partner/point/charge 페이지 "약관 보기" 버튼
   Figma: https://www.figma.com/design/R1Ih7ESDc1aHKw2NYjGQkI?node-id=4906-26514
   스타일: terms_view_modal.module.css 동일 적용
   ======================================== */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import baseModalStyles from "@/styles/common/modal/base_modal.module.css";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";

export interface PartnerChargeTermsModalProps {
  is_open: boolean;
  on_close: () => void;
}

const MODAL_TITLE = "결제 · 환불 및 이용약관 동의";

const CHARGE_TERMS_CONTENT = {
  intro:
    "본 약관은 회사와 파트너 간의 결제, 포인트 충전, 환불 등에 관한 사항을 규정합니다.",
  payment_method: {
    desc: "파트너는 캠페인 등록, 콘텐츠 배치, 포인트 충전 등을 위해 다음의 결제 방법을 이용할 수 있습니다.",
    items: ["무통장 입금", "카드 결제"],
    note: "회사는 보안 및 정책상 필요시 결제 수단을 제한할 수 있습니다.",
  },
  payment_info: [
    "파트너가 제공한 결제 정보 및 그로 인해 발생한 모든 책임은 파트너가 부담합니다.",
    "결제 정보는 암호화되어 안전하게 관리되며, 회사는 최신 보안 기준을 준수합니다.",
    "파트너는 본인의 결제 정보를 타인에게 공개하지 않을 책임이 있습니다.",
  ],
  point_charge: {
    items: [
      "파트너는 회사가 정한 운영정책과 절차에 따라 일정 금액 이상의 포인트를 충전할 수 있습니다.",
      "포인트 충전은 사전 결제 방식으로, 결제 즉시 포인트로 환산되어 파트너 계정에 적립됩니다.",
      "포인트는 다음의 용도로 사용됩니다.",
    ],
    purposes: ["캠페인 등록", "상품 구매", "광고 비용"],
  },
  cancel_refund: {
    title: "결제 취소 및 환불",
    desc: "취소 가능 기간: 충전 후 24시간 이내 취소 요청 가능 (충전 직후 미사용 상태일 때)",
  },
  no_refund: {
    title: "환불 불가 사항",
    desc: "다음의 경우 환불이 불가합니다.",
    items: [
      "포인트가 이미 캠페인에 배치된 경우",
      "리뷰어가 캠페인에 신청한 이후",
    ],
  },
};

export default function PartnerChargeTermsModal({
  is_open,
  on_close,
}: PartnerChargeTermsModalProps) {
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
  }, [is_open]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  const { payment_method, payment_info, point_charge, cancel_refund, no_refund } =
    CHARGE_TERMS_CONTENT;

  return (
    <div
      className={baseModalStyles.modal_overlay_center}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner_charge_terms_modal_title"
    >
      <div
        className={modalStyles.terms_modal_wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modalStyles.terms_modal_card}>
          <div
            className={modalStyles.terms_modal_header}
            role="banner"
            aria-label={MODAL_TITLE}
          >
            <h2
              id="partner_charge_terms_modal_title"
              className={modalStyles.terms_modal_title}
            >
              {MODAL_TITLE}
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
              <div className={modalStyles.terms_modal_body_inner}>
                <p>{CHARGE_TERMS_CONTENT.intro}</p>
                <br />

                <p className={modalStyles.terms_modal_heading}>결제 방법</p>
                <p>{payment_method.desc}</p>
                {payment_method.items.map((item, i) => (
                  <p key={i}>- {item}</p>
                ))}
                <p>{payment_method.note}</p>
                <br />

                <p className={modalStyles.terms_modal_heading}>
                  결제 정보 관리
                </p>
                {payment_info.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                <br />

                <p className={modalStyles.terms_modal_heading}>포인트 충전</p>
                {point_charge.items.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                {point_charge.purposes.map((item, i) => (
                  <p key={i}>- {item}</p>
                ))}
                <br />

                <p className={modalStyles.terms_modal_heading}>
                  {cancel_refund.title}
                </p>
                <p>{cancel_refund.desc}</p>
                <br />

                <p className={modalStyles.terms_modal_heading}>
                  {no_refund.title}
                </p>
                <p>{no_refund.desc}</p>
                {no_refund.items.map((item, i) => (
                  <p key={i}>- {item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
