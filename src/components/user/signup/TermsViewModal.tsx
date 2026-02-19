/* ========================================
   약관 보기 모달
   ========================================
   회원가입 페이지 동의 약관 "보기" 클릭 시 노출.
   Figma: https://www.figma.com/design/R1Ih7ESDc1aHKw2NYjGQkI?node-id=4781-18323
   ======================================== */

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import baseModalStyles from "@/styles/common/modal/base_modal.module.css";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";

export type TermsViewModalType = "terms" | "privacy" | "marketing" | null;

export interface TermsViewModalProps {
  is_open: boolean;
  on_close: () => void;
  type: TermsViewModalType;
}

const TERMS_CONTENT = `약관 내용

제1조(목적)
이 약관은 주식회사 마크엑스(이하 '회사'라 함)가 제공하는 리뷰X 서비스 및 관련 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조(정의) 주요 용어
- '서비스'란 회사가 제공하는 리뷰X 플랫폼과 이에 관련된 모든 기능을 말합니다.
- '리뷰어'란 서비스에 가입하여 캠페인에 참여하고 콘텐츠를 등록하는 개인 회원을 말합니다.
- '회원'이란 서비스를 이용하는 리뷰어를 말합니다.
- '캠페인'이란 광고주(파트너)로부터 제공받은 마케팅, 상품 홍보 등을 목적으로 리뷰어가 참여할 수 있도록 제공되는 서비스를 말합니다.
- '콘텐츠'란 리뷰어가 캠페인 참여 결과로 등록한 이미지, 텍스트, 링크, 동영상 등 일체의 자료를 말합니다.
- '포인트'란 현금화할 수 있는 무형의 자산으로, 회사가 리뷰어에게 제공하거나 캠페인 완료 시 적립되는 것을 말합니다.

제4조(이용계약 체결)
이용계약은 회원이 되고자 하는 자가 회사가 제공하는 네이버, 카카오 등 외부 인증 계정을 통해 본인 인증 절차를 완료하고, 본 약관 및 개인정보처리방침에 동의한 후 회사가 이를 승낙함으로써 체결됩니다.
회사는 회원 등록을 신청한 사람이 만 14세 미만일 경우 회원 승낙을 하지 않습니다.

제9조(회원의 의무) 금지 행위
회원은 다음 각 호에 해당하는 행위를 하여서는 안 됩니다.

계정 및 개인정보 관련
- 회원정보에 허위 내용을 등록하는 행위
- 다수의 리뷰X 계정으로 동일한 캠페인에 참여하여 부정한 방법으로 혜택을 수령하는 행위
- 타인의 개인정보를 도용하거나 사칭하는 행위

서비스 운영 방해 관련`;

const PRIVACY_THIRD_PARTY_ITEMS = [
  {
    recipient: "광고주(파트너)",
    purpose: "캠페인 제안, 신청자 관리, 캠페인 진행",
    items: "회원 정보(이름, 생년월일, 성별, 휴대폰 번호), 배송 정보",
    retention: "캠페인 완료 후 파기",
  },
  {
    recipient: "배송업체",
    purpose: "배송형 캠페인 물품 배송",
    items: "배송정보(이름, 휴대폰 번호, 배송 주소)",
    retention: "배송 완료 후 1개월",
  },
  {
    recipient: "NICE평가정보(주)",
    purpose: "본인확인 및 중복가입 확인",
    items: "이름, 휴대폰번호, 생년월일",
    retention: "목적 달성 후 즉시 파기",
  },
  {
    recipient: "문자 및 이메일 발송 서비스 업체",
    purpose: "알림톡, SMS, 이메일 발송",
    items: "휴대폰번호, 이메일주소, 기본 회원정보",
    retention: "목적 달성 시까지",
  },
  {
    recipient: "Google LLC 및 Google Ireland Limited",
    purpose: "맞춤형 광고 제공, 광고 성과 분석",
    items: "ID, ADID, IDFA, IP 주소, 기기 정보",
    retention: "목적 달성 시까지",
  },
  {
    recipient: "세무당국",
    purpose: "원천징수(소득세 3.3%) 신고 및 납부를 위한 세무 처리",
    items: null,
    retention: null,
  },
];

const MARKETING_CONTENT = {
  purposes: [
    "신규 서비스 및 기능 안내",
    "맞춤형 캠페인 추천",
    "프로모션 및 할인 정보",
    "통계 및 트렌드 정보",
  ],
  channels: ["이메일", "문자 메시지 (SMS)", "카카오톡", "서비스 내 알림"],
  retention: "동의가 유효한 동안 보유되며, 동의 철회 시 즉시 파기됩니다.",
};

const TITLES: Record<NonNullable<TermsViewModalType>, string> = {
  terms: "이용약관 및 개인정보 관련 동의",
  privacy: "개인정보 제3자 제공 동의",
  marketing: "마케팅 목적의 개인정보 수집 및 이용 동의",
};

/** 약관 본문에서 제목 라인인지 판별 (제1조, 1. ..., 계정 및 개인정보 관련 등) */
function is_terms_heading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  if (line.trim() === "계정 및 개인정보 관련") return true;
  if (line.trim() === "서비스 운영 방해 관련") return true;
  return false;
}

export default function TermsViewModal({
  is_open,
  on_close,
  type,
}: TermsViewModalProps) {
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

  /* 본문이 스크롤 가능할 때만 오른쪽 여백 적용 */
  useEffect(() => {
    if (!is_open || !type) {
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
  }, [is_open, type]);

  if (!is_open || !type) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  const title = TITLES[type];

  return (
    <div
      className={baseModalStyles.modal_overlay_center}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms_view_modal_title"
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
              id="terms_view_modal_title"
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
            {type === "terms" && (
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
            )}

            {type === "privacy" && (
              <div className={modalStyles.terms_modal_body_inner}>
                <p className={modalStyles.terms_modal_heading}>
                  정보 제공 대상 및 목적
                </p>
                {PRIVACY_THIRD_PARTY_ITEMS.map((item, i) => (
                  <Fragment key={i}>
                    <p>제공받는 자: {item.recipient}</p>
                    <p>제공 목적: {item.purpose}</p>
                    {item.items != null && (
                      <p>제공 항목: {item.items}</p>
                    )}
                    {item.retention != null && (
                      <p>보유 기간: {item.retention}</p>
                    )}
                    {i < PRIVACY_THIRD_PARTY_ITEMS.length - 1 && <br />}
                  </Fragment>
                ))}
              </div>
            )}

            {type === "marketing" && (
              <div className={modalStyles.terms_modal_body_inner}>
                <p className={modalStyles.terms_modal_heading}>
                  마케팅 정보 제공 목적
                </p>
                {MARKETING_CONTENT.purposes.map((text, i) => (
                  <p key={i}>- {text}</p>
                ))}
                <br />
                <p className={modalStyles.terms_modal_heading}>
                  정보 전달 수단
                </p>
                {MARKETING_CONTENT.channels.map((text, i) => (
                  <p key={i}>- {text}</p>
                ))}
                <br />
                <p className={modalStyles.terms_modal_heading}>
                  보유 기간
                </p>
                <p>{MARKETING_CONTENT.retention}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
