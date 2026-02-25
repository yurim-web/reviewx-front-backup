/* ========================================
   약관 보기 모달 (유저/파트너 공통)
   ======================================== */

/**
 * TermsViewModal
 *
 * 목적: 유저/파트너 회원가입 시 동의 약관 내용을 모달로 표시합니다.
 *
 * 사용 페이지:
 * - /user/signup (유저 약관: "보기" 버튼 클릭 시)
 * - /partner/signup (파트너 약관: "보기" 버튼 클릭 시)
 */

"use client";

import { Fragment, type ReactNode } from "react";
import AgreementTermsModalShell from "@/components/common/modal/AgreementTermsModalShell";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";

// 유저 약관 데이터
import {
  TERMS_CONTENT,
  PRIVACY_THIRD_PARTY_ITEMS,
  PRIVACY_THIRD_PARTY_NOTICE,
  MARKETING_CONTENT,
  TITLES as USER_TITLES,
} from "@/data/user/signup/termsViewModalData";

// 파트너 약관 데이터
import {
  PARTNER_SERVICE_TERMS_CONTENT,
  PARTNER_PRIVACY_CONTENT,
  PARTNER_THIRD_PARTY_ITEMS,
  PARTNER_THIRD_PARTY_NOTICE,
  PARTNER_ADVERTISING_CONTENT,
  PARTNER_MARKETING_CONTENT,
  PARTNER_THIRD_PARTY_MARKETING_CONTENT,
  TITLES as PARTNER_TITLES,
  PARTNER_TERMS_HEADINGS,
  PARTNER_PRIVACY_HEADINGS,
  PARTNER_ADVERTISING_HEADINGS,
} from "@/data/partner/signup/partnerTermsViewModalData";

// 유저 약관 타입
export type UserTermsType = "terms" | "privacy" | "marketing";

// 파트너 약관 타입
export type PartnerTermsType =
  | "partner_service_terms"
  | "partner_privacy"
  | "partner_third_party"
  | "partner_advertising"
  | "partner_marketing"
  | "partner_third_party_marketing";

// 통합 약관 타입
export type TermsViewModalType = UserTermsType | PartnerTermsType | null;

export interface TermsViewModalProps {
  is_open: boolean;
  on_close: () => void;
  type: TermsViewModalType;
}

/* ---- 유저 약관 헤딩 판별 ---- */
const USER_TERMS_HEADING_STRINGS = [
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

function isUserTermsHeading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  return USER_TERMS_HEADING_STRINGS.includes(line.trim());
}

/* ---- 파트너 약관 헤딩 판별 ---- */
function isPartnerTermsHeading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  return PARTNER_TERMS_HEADINGS.includes(line.trim());
}

function isPartnerPrivacyHeading(line: string): boolean {
  return line.trim() !== "" && PARTNER_PRIVACY_HEADINGS.includes(line.trim());
}

function isPartnerAdvertisingHeading(line: string): boolean {
  return line.trim() !== "" && PARTNER_ADVERTISING_HEADINGS.includes(line.trim());
}

/* ---- 콘텐츠 렌더링 ---- */
function renderContent(type: NonNullable<TermsViewModalType>): ReactNode {
  // 유저 약관
  if (type === "terms") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        {TERMS_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (isUserTermsHeading(line)) {
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

  if (type === "privacy") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>정보 제공 대상 및 목적</p>
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
    );
  }

  if (type === "marketing") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        <p className={modalStyles.terms_modal_heading}>마케팅 정보 제공 목적</p>
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
  }

  // 파트너 약관
  if (type === "partner_service_terms") {
    return (
      <div className={modalStyles.terms_modal_body_inner}>
        {PARTNER_SERVICE_TERMS_CONTENT.split("\n").map((line, i) => {
          if (line === "") return <br key={i} />;
          if (isPartnerTermsHeading(line)) {
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
          if (isPartnerPrivacyHeading(line)) {
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
        <p className={modalStyles.terms_modal_heading}>정보 제공 대상 및 목적</p>
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
          if (isPartnerAdvertisingHeading(line)) {
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
        <p className={modalStyles.terms_modal_heading}>마케팅 정보 제공 목적</p>
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

function getTitle(type: NonNullable<TermsViewModalType>): string {
  if (type in USER_TITLES) {
    return USER_TITLES[type as UserTermsType];
  }
  return PARTNER_TITLES[type as PartnerTermsType];
}

export default function TermsViewModal({ is_open, on_close, type }: TermsViewModalProps) {
  if (!type) return null;

  return (
    <AgreementTermsModalShell
      is_open={is_open}
      on_close={on_close}
      title={getTitle(type)}
      title_id="terms_view_modal_title"
    >
      {renderContent(type)}
    </AgreementTermsModalShell>
  );
}
