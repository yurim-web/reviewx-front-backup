/* ========================================
   파트너 약관 보기 모달
   ========================================
   파트너 회원가입 페이지 동의 약관 "보기" 클릭 시 노출.
   형태/스타일은 유저 약관 모달과 동일.
   ======================================== */

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import baseModalStyles from "@/styles/common/modal/base_modal.module.css";
import modalStyles from "@/styles/user/signup/terms_view_modal.module.css";

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

const PARTNER_SERVICE_TERMS_CONTENT = `제1조(목적)
이 약관은 주식회사 마크엑스(이하 '회사'라 함)가 제공하는 리뷰X 서비스 및 관련 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조(정의) 주요 용어
- '서비스'란 회사가 제공하는 리뷰X 플랫폼과 이에 관련된 모든 기능을 말합니다.
- '파트너'란 서비스를 통해 캠페인을 등록하고 진행하는 광고주 또는 판매자를 말합니다.
- '계정'이란 이메일 기반 인증 계정을 말합니다.
- '캠페인'이란 파트너가 마케팅, 상품 홍보 등을 목적으로 등록하여 리뷰어가 참여할 수 있도록 제공하는 서비스를 말합니다.
- '콘텐츠'란 리뷰어가 캠페인 참여 결과로 등록한 이미지, 텍스트, 링크, 동영상 등을 말합니다.
- '포인트'란 현금화할 수 있는 무형의 자산으로, 캠페인 등록이나 광고 비용 결제 시 사용되는 것을 말합니다.

제4조(이용계약 체결)
이용계약은 파트너가 되고자 하는 자가 이메일과 비밀번호로 계정을 생성하고, 사업자등록증 검증을 완료한 후 본 약관 및 개인정보처리방침에 동의하고 회사가 이를 승낙함으로써 체결됩니다.
회사는 사업자등록증 검증에 실패하거나 제출하지 않은 경우 회원 승낙을 하지 않습니다.

제9조(회원의 의무) 금지 행위
파트너는 다음 각 호에 해당하는 행위를 하여서는 안 됩니다.

계정 및 개인정보 관련
- 회원정보에 허위 내용을 등록하는 행위
- 타인의 개인정보를 도용하거나 사칭하는 행위
- 회사의 동의 없이 회원의 이용 권한을 타인에게 양도, 증여하거나 이를 담보로 제공하는 행위

캠페인 등록 및 진행 관련
- 등록된 캠페인 정보 및 계약 조건과 실제 제공 내용이 다른 행위
- 캠페인 진행 중 기한 없이 연락이 두절되는 행위`;

const PARTNER_PRIVACY_CONTENT = `수집하는 개인정보

회원가입 시(필수)
아이디(이메일), 비밀번호, 이름, 휴대폰 번호, 상호명, 대표자명, 주소, 문의 담당자 휴대폰 번호, 사업자등록번호, 사업자등록증 사본

포인트 충전 시
결제 관련 정보(PG사 연동)

환불 시
입금 계좌, 예금주명, 이름

수집 및 이용 목적
- 파트너 식별 및 본인 확인
- 사업자 검증
- 서비스 제공 및 계약 이행
- 고충 처리 및 분쟁 조정을 위한 기록 보존
- 고지사항 전달
- 캠페인 진행 및 결제 처리
- 정산 및 세무 관련 처리
- 부정 이용 방지 및 보안 관리

개인정보 보유 기간
원칙적으로 회원 탈퇴 시 또는 이용 목적 달성 시 즉시 파기합니다.
다만, 다음의 경우에는 예외로 보관합니다.
사업자등록증: 계약 종료 후 5년(세무 관련 법령 준수)
결제 관련 정보: 결제 완료 후 5년(전자상거래법 준수)
부정 이용 기록: 3년`;

const PARTNER_THIRD_PARTY_ITEMS = [
  {
    recipient: "리뷰어",
    purpose: "캠페인 제안, 신청자 관리, 캠페인 진행",
    items: "캠페인 정보, 문의 담당자 정보",
    retention: "서비스 완료 후 파기",
  },
  {
    recipient: "배송업체",
    purpose: "배송형 캠페인 물품 배송",
    items: "배송정보",
    retention: "배송 완료 후 1개월",
  },
  {
    recipient: "문자 및 이메일 발송 서비스 업체",
    purpose: "알림톡, SMS, 이메일 발송",
    items: "휴대폰번호, 이메일주소, 기본 회원정보",
    retention: "목적 달성 시까지",
  },
  {
    recipient: "PG사",
    purpose: "포인트 충전 결제 처리",
    items: "결제 수단 정보, 회원 ID, 결제 금액",
    retention: "결제 완료 후 5년",
  },
  {
    recipient: "세무당국",
    purpose: "세무 관련 처리",
    items: "사업자 정보, 정산 내역",
    retention: "관련 법령에서 정한 기간",
  },
];

const PARTNER_ADVERTISING_CONTENT = `공정거래위원회 규정 준수
파트너가 캠페인을 등록할 때는 공정거래위원회 규정을 준수해야 합니다.

필수 준수 사항
- 캠페인 정보는 실제 제공 내용과 일치해야 합니다.
- 허위 또는 과장된 정보를 게재할 수 없습니다.
- 리뷰어의 의무 사항을 명확히 안내해야 합니다.
- 보상 및 포인트 지급 조건을 명확히 표시해야 합니다.

금지 사항 및 위반 결과
- 허위 캠페인 정보 등록
- 보상 미지급 또는 지연 지급
- 리뷰어에게 부당한 요구
- 리뷰어 명예 훼손
- 기타 공정거래법 위반 행위

위반 시 회사는 다음과 같은 조치를 취할 수 있습니다.
- 캠페인 중단
- 경고 또는 주의 조치
- 캠페인 등록 제한
- 포인트 환수
- 서비스 이용 제한 또는 해지`;

const PARTNER_MARKETING_CONTENT = {
  purposes: [
    "신규 서비스 및 기능 안내",
    "맞춤형 캠페인 추천",
    "프로모션 및 할인 정보 제공",
    "통계 및 트렌드 정보 제공",
  ],
  channels: "이메일, 문자 메시지, 카카오톡, 서비스 내 알림",
  retention:
    "동의가 유효한 동안 보유되며, 동의 철회 시 즉시 파기됩니다.",
};

const TITLES: Record<NonNullable<PartnerTermsViewModalType>, string> = {
  partner_service_terms: "서비스 이용 약관 동의",
  partner_privacy: "개인정보 수집 및 이용 동의",
  partner_third_party: "개인정보 제3자 제공 동의",
  partner_advertising: "광고 · 홍보 관련 준수 사항 동의",
  partner_marketing: "마케팅 목적의 개인정보 수집 및 이용 동의",
  partner_third_party_marketing: "제3자 정보 제공 (마케팅/프로모션 목적) 동의",
};

function is_partner_terms_heading(line: string): boolean {
  if (!line.trim()) return false;
  if (/^제\d+조/.test(line.trim())) return true;
  if (/^\d+\.\s/.test(line.trim())) return true;
  if (line.trim() === "계정 및 개인정보 관련") return true;
  if (line.trim() === "캠페인 등록 및 진행 관련") return true;
  return false;
}

function is_partner_privacy_heading(line: string): boolean {
  if (!line.trim()) return false;
  const headings = [
    "수집하는 개인정보",
    "회원가입 시(필수)",
    "포인트 충전 시",
    "환불 시",
    "수집 및 이용 목적",
    "개인정보 보유 기간",
  ];
  return headings.includes(line.trim());
}

function is_partner_advertising_heading(line: string): boolean {
  if (!line.trim()) return false;
  const headings = [
    "공정거래위원회 규정 준수",
    "필수 준수 사항",
    "금지 사항 및 위반 결과",
    "위반 시 회사는 다음과 같은 조치를 취할 수 있습니다.",
  ];
  return headings.includes(line.trim());
}

export default function PartnerTermsViewModal({
  is_open,
  on_close,
  type,
}: PartnerTermsViewModalProps) {
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
      aria-labelledby="partner_terms_view_modal_title"
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
              id="partner_terms_view_modal_title"
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
              {type === "partner_service_terms" && (
                <div className={modalStyles.terms_modal_body_inner}>
                  {PARTNER_SERVICE_TERMS_CONTENT.split("\n").map((line, i) => {
                    if (line === "") return <br key={i} />;
                    if (is_partner_terms_heading(line)) {
                      return (
                        <div
                          key={i}
                          className={modalStyles.terms_modal_heading}
                        >
                          {line}
                        </div>
                      );
                    }
                    return <div key={i}>{line}</div>;
                  })}
                </div>
              )}

              {type === "partner_privacy" && (
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
              )}

              {type === "partner_third_party" && (
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
                  <p className={modalStyles.terms_modal_heading}>
                    주요 안내사항
                  </p>
                  <p>
                    회사는 파트너의 개인정보를 동의 없이 제3자에게 제공하지
                    않습니다.
                  </p>
                </div>
              )}

              {type === "partner_advertising" && (
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
              )}

              {type === "partner_marketing" && (
                <div className={modalStyles.terms_modal_body_inner}>
                  <p className={modalStyles.terms_modal_heading}>
                    마케팅 정보 제공 목적
                  </p>
                  {PARTNER_MARKETING_CONTENT.purposes.map((text, i) => (
                    <p key={i}>- {text}</p>
                  ))}
                  <br />
                  <p className={modalStyles.terms_modal_heading}>
                    정보 전달 수단
                  </p>
                  <p>{PARTNER_MARKETING_CONTENT.channels}</p>
                  <br />
                  <p className={modalStyles.terms_modal_heading}>
                    보유 기간
                  </p>
                  <p>{PARTNER_MARKETING_CONTENT.retention}</p>
                </div>
              )}

              {type === "partner_third_party_marketing" && (
                <div className={modalStyles.terms_modal_body_inner}>
                  <p className={modalStyles.terms_modal_heading}>
                    정보 제공 목적
                  </p>
                  <p>- 맞춤형 광고 제공 및 광고 성과 측정</p>
                  <p>- 마케팅 캠페인 분석 및 최적화</p>
                  <p>- 서비스 개선을 위한 분석 및 통계</p>
                  <br />
                  <p className={modalStyles.terms_modal_heading}>
                    정보 제공 대상
                  </p>
                  <p>Google LLC 및 Google Ireland Limited, 기타 공식 제휴사</p>
                  <br />
                  <p className={modalStyles.terms_modal_heading}>
                    제공 정보
                  </p>
                  <p>- 광고 식별자 (ADID, IDFA)</p>
                  <p>- 앱 사용 정보</p>
                  <p>- 기기 정보</p>
                  <p>- IP 주소</p>
                  <p>- 광고 클릭 및 노출 정보</p>
                  <br />
                  <p className={modalStyles.terms_modal_heading}>
                    보유 기간
                  </p>
                  <p>
                    동의가 유효한 동안 정보가 제공되며, 동의 철회 시 신규 정보
                    제공은 중단됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
