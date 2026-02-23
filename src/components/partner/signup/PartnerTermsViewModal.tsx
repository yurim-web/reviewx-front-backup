/* ========================================
   파트너 약관 보기 모달
   ========================================
   파트너 회원가입 페이지 동의 약관 "보기" 클릭 시 노출.
   형태/스타일은 유저 약관 모달과 동일 (공통 셸 사용).

   사용처:
   - src/components/partner/signup/PartnerTermsAgreement.tsx (파트너 회원가입 약관 동의)
   - src/app/partner/signup/page.tsx (파트너 회원가입 페이지)
   - src/components/partner/signup/PartnerTermsAgreement.stories.tsx (스토리북)
   ======================================== */

"use client";

import { Fragment, type ReactNode } from "react";
import AgreementTermsModalShell from "@/components/common/modal/AgreementTermsModalShell";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";
import {
  PARTNER_SERVICE_TERMS_CONTENT,
  PARTNER_PRIVACY_CONTENT,
  PARTNER_THIRD_PARTY_ITEMS,
  PARTNER_THIRD_PARTY_NOTICE,
  PARTNER_ADVERTISING_CONTENT,
  PARTNER_MARKETING_CONTENT,
  PARTNER_THIRD_PARTY_MARKETING_CONTENT,
  TITLES,
  PARTNER_TERMS_HEADINGS,
  PARTNER_PRIVACY_HEADINGS,
  PARTNER_ADVERTISING_HEADINGS,
} from "@/data/partner/signup/partnerTermsViewModalData";

export type PartnerTermsViewModalType =
  | "partner_service_terms"
  | "partner_privacy"
  | "partner_third_party"
  | "partner_advertising"
  | "partner_marketing"
  | "partner_third_party_marketing"
  | null;

export interface PartnerTermsViewModalProps {
  is_open: boolean;
  on_close: () => void;
  type: PartnerTermsViewModalType;
}

function is_partner_terms_heading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  return PARTNER_TERMS_HEADINGS.includes(line.trim());
}

function is_partner_privacy_heading(line: string): boolean {
  return line.trim() !== "" && PARTNER_PRIVACY_HEADINGS.includes(line.trim());
}

function is_partner_advertising_heading(line: string): boolean {
  return line.trim() !== "" && PARTNER_ADVERTISING_HEADINGS.includes(line.trim());
}

function render_partner_content(
  type: NonNullable<PartnerTermsViewModalType>,
): ReactNode {
  if (type === "partner_service_terms") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        {PARTNER_SERVICE_TERMS_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (is_partner_terms_heading(line)) {
            return (
              <div key={i} className={modalStyles.terms_modal_heading}>
                {line}
              </div>
            );
          }
          return <div key={i}>{line}</div>;
        })}
      </div>
    );
  }

  if (type === "partner_privacy") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        {PARTNER_PRIVACY_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (is_partner_privacy_heading(line)) {
            return (
              <p key={i} className={modalStyles.terms_modal_heading}>
                {line}
              </p>
            );
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  }

  if (type === "partner_third_party") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>
          정보 제공 대상 및 목적
        </p>
        {PARTNER_THIRD_PARTY_ITEMS.map((item, i) => (
          <Fragment key={i}>
            <p>제공받는 자: {item.recipient}</p>
            <p>제공 목적: {item.purpose}</p>
            <p>제공 항목: {item.items}</p>
            <p>보유 기간: {item.retention}</p>
            {i < PARTNER_THIRD_PARTY_ITEMS.length - 1 && <br />}
          </Fragment>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>주요 안내사항</p>
        {PARTNER_THIRD_PARTY_NOTICE.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    );
  }

  if (type === "partner_advertising") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        {PARTNER_ADVERTISING_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (is_partner_advertising_heading(line)) {
            return (
              <p key={i} className={modalStyles.terms_modal_heading}>
                {line}
              </p>
            );
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  }

  if (type === "partner_marketing") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>
          마케팅 정보 제공 목적
        </p>
        {PARTNER_MARKETING_CONTENT.purposes.map((text, i) => (
          <p key={i}>- {text}</p>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>정보 전달 수단</p>
        <p>{PARTNER_MARKETING_CONTENT.channels}</p>
        <br />
        <p className={modalStyles.terms_modal_heading}>보유 기간</p>
        <p>{PARTNER_MARKETING_CONTENT.retention}</p>
      </div>
    );
  }

  if (type === "partner_third_party_marketing") {
    const data = PARTNER_THIRD_PARTY_MARKETING_CONTENT;
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>정보 제공 목적</p>
        {data.purposes.map((text, i) => (
          <p key={i}>- {text}</p>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>정보 제공 대상</p>
        <p>{data.providers}</p>
        <br />
        <p className={modalStyles.terms_modal_heading}>제공 정보</p>
        {data.items.map((text, i) => (
          <p key={i}>- {text}</p>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>보유 기간</p>
        <p>{data.retention}</p>
      </div>
    );
  }

  return null;
}

export default function PartnerTermsViewModal({
  is_open,
  on_close,
  type,
}: PartnerTermsViewModalProps) {
  if (!type) return null;

  const title = TITLES[type];

  return (
    <AgreementTermsModalShell
      is_open={is_open}
      on_close={on_close}
      title={title}
      title_id="partner_terms_view_modal_title"
    >
      {render_partner_content(type)}
    </AgreementTermsModalShell>
  );
}
