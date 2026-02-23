/* ========================================
   약관 보기 모달
   ========================================
   회원가입 페이지 동의 약관 "보기" 클릭 시 노출.

   사용처:
   - src/components/user/signup/TermsAgreement.tsx (리뷰어 회원가입 약관 동의)
   - src/app/user/signup/page.tsx (리뷰어 회원가입 페이지)
   - src/components/user/signup/TermsAgreement.stories.tsx (스토리북)
   ======================================== */

"use client";

import { Fragment } from "react";
import AgreementTermsModalShell from "@/components/common/modal/AgreementTermsModalShell";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";
import {
  TERMS_CONTENT,
  PRIVACY_THIRD_PARTY_ITEMS,
  PRIVACY_THIRD_PARTY_NOTICE,
  MARKETING_CONTENT,
  TITLES,
} from "@/data/user/signup/termsViewModalData";

export type TermsViewModalType = "terms" | "privacy" | "marketing" | null;

export interface TermsViewModalProps {
  is_open: boolean;
  on_close: () => void;
  type: TermsViewModalType;
}

/** 약관 본문에서 제목 라인인지 판별 (제1조, 1. 2. ..., 섹션 제목 등) */
const TERMS_HEADING_STRINGS = [
  "계정 및 개인정보 관련",
  "서비스 운영 방해 관련",
  "캠페인 참여 관련",
  "수집하는 개인정보",
  "회원가입 시",
  "캠페인 참여 시",
  "수집 및 이용 목적",
  "개인정보 보유 기간",
  "수탁업체 및 위탁업무",
  "주요 안내사항",
  "수집하는 개인정보 항목",
  "본인인증 시",
  "출금 서비스 이용 시",
];

function is_terms_heading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  return TERMS_HEADING_STRINGS.includes(line.trim());
}

export default function TermsViewModal({
  is_open,
  on_close,
  type,
}: TermsViewModalProps) {
  if (!type) return null;

  const title = TITLES[type];

  const content =
    type === "terms" ? (
      <div className={modalStyles.terms_modal_body_inner}>
        {TERMS_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (is_terms_heading(line)) {
            return (
              <div key={i} className={modalStyles.terms_modal_heading}>
                {line}
              </div>
            );
          }
          return <div key={i}>{line}</div>;
        })}
      </div>
    ) : type === "privacy" ? (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>
          정보 제공 대상 및 목적
        </p>
        {PRIVACY_THIRD_PARTY_ITEMS.map((item, i) => (
          <Fragment key={i}>
            <p>제공받는 자: {item.recipient}</p>
            <p>제공 목적: {item.purpose}</p>
            <p>제공 항목: {item.items}</p>
            <p>보유 기간: {item.retention}</p>
            {i < PRIVACY_THIRD_PARTY_ITEMS.length - 1 && <br />}
          </Fragment>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>주요 안내 사항</p>
        {PRIVACY_THIRD_PARTY_NOTICE.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    ) : (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>
          마케팅 정보 제공 목적
        </p>
        {MARKETING_CONTENT.purposes.map((text, i) => (
          <p key={i}>- {text}</p>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>정보 전달 수단</p>
        {MARKETING_CONTENT.channels.map((text, i) => (
          <p key={i}>- {text}</p>
        ))}
        <br />
        <p className={modalStyles.terms_modal_heading}>보유 기간</p>
        <p>{MARKETING_CONTENT.retention}</p>
      </div>
    );

  return (
    <AgreementTermsModalShell
      is_open={is_open}
      on_close={on_close}
      title={title}
      title_id="terms_view_modal_title"
    >
      {content}
    </AgreementTermsModalShell>
  );
}
