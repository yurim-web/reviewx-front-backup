/* ========================================
   ✅ 파트너 약관 동의 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 회원가입용 약관 동의 체크박스 UI
 * - 전체 동의 및 개별 동의 관리
 * - 파트너 전용 약관 항목 포함
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 약관 동의에 사용)
 */

"use client";

import commonStyles from "@/styles/common/signup/signup.module.css";
import styles from "@/styles/partner/signup/partner_signup.module.css";

interface PartnerTermsAgreementProps {
  allAgreed: boolean;
  serviceTermsAgreed: boolean;
  privacyAgreed: boolean;
  thirdPartyAgreed: boolean;
  advertisingAgreed: boolean;
  marketingAgreed: boolean;
  thirdPartyMarketingAgreed: boolean;
  error?: string;
  onAllAgreedChange: (checked: boolean) => void;
  onServiceTermsAgreedChange: (checked: boolean) => void;
  onPrivacyAgreedChange: (checked: boolean) => void;
  onThirdPartyAgreedChange: (checked: boolean) => void;
  onAdvertisingAgreedChange: (checked: boolean) => void;
  onMarketingAgreedChange: (checked: boolean) => void;
  onThirdPartyMarketingAgreedChange: (checked: boolean) => void;
}

export default function PartnerTermsAgreement({
  allAgreed,
  serviceTermsAgreed,
  privacyAgreed,
  thirdPartyAgreed,
  advertisingAgreed,
  marketingAgreed,
  thirdPartyMarketingAgreed,
  error,
  onAllAgreedChange,
  onServiceTermsAgreedChange,
  onPrivacyAgreedChange,
  onThirdPartyAgreedChange,
  onAdvertisingAgreedChange,
  onMarketingAgreedChange,
  onThirdPartyMarketingAgreedChange,
}: PartnerTermsAgreementProps) {
  /**
   * 약관 보기 클릭 핸들러
   *
   * 현재는 alert를 띄우지만, 추후 모달로 교체 예정입니다.
   *
   * @param termsType - 약관 타입 (서비스 이용, 개인정보 수집 등)
   */
  const handle_terms_view_click = (termsType: string) => {
    // 기본 동작 방지 (링크 이동 방지)
    // TODO: 추후 모달 컴포넌트로 교체 예정
    alert(`${termsType} 약관을 확인합니다.\n\n(추후 모달로 교체 예정)`);
  };
  return (
    <>
      <div className={commonStyles.terms_section}>
        <div className={commonStyles.terms_all_agree}>
          <input
            id="all-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={allAgreed}
            onChange={(e) => onAllAgreedChange(e.target.checked)}
          />
          <label htmlFor="all-agree" className={commonStyles.checkbox_label}>
            전체 동의
          </label>
        </div>

        <div className={commonStyles.terms_divider}></div>

        <div className={commonStyles.terms_item}>
          <input
            id="service-terms-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={serviceTermsAgreed}
            onChange={(e) => onServiceTermsAgreedChange(e.target.checked)}
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="service-terms-agree"
              className={commonStyles.checkbox_label}
            >
              [필수] 서비스 이용 약관 동의
            </label>
            <button
              type="button"
              onClick={() => handle_terms_view_click("서비스 이용")}
              className={commonStyles.terms_view_link}
              aria-label="서비스 이용 약관 보기"
            >
              보기
            </button>
          </div>
        </div>

        <div className={commonStyles.terms_item}>
          <input
            id="privacy-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={privacyAgreed}
            onChange={(e) => onPrivacyAgreedChange(e.target.checked)}
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="privacy-agree"
              className={commonStyles.checkbox_label}
            >
              [필수] 개인정보 수집 및 이용 동의
            </label>
            <button
              type="button"
              onClick={() => handle_terms_view_click("개인정보 수집 및 이용")}
              className={commonStyles.terms_view_link}
              aria-label="개인정보 수집 및 이용 약관 보기"
            >
              보기
            </button>
          </div>
        </div>

        <div className={commonStyles.terms_item}>
          <input
            id="third-party-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={thirdPartyAgreed}
            onChange={(e) => onThirdPartyAgreedChange(e.target.checked)}
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="third-party-agree"
              className={commonStyles.checkbox_label}
            >
              [필수] 개인정보 제3자 제공 동의
            </label>
            <button
              type="button"
              onClick={() => handle_terms_view_click("개인정보 제3자 제공")}
              className={commonStyles.terms_view_link}
              aria-label="개인정보 제3자 제공 약관 보기"
            >
              보기
            </button>
          </div>
        </div>

        <div className={commonStyles.terms_item}>
          <input
            id="advertising-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={advertisingAgreed}
            onChange={(e) => onAdvertisingAgreedChange(e.target.checked)}
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="advertising-agree"
              className={commonStyles.checkbox_label}
            >
              [필수] 광고 · 홍보 관련 준수 사항 동의
            </label>
            <button
              type="button"
              onClick={() =>
                handle_terms_view_click("광고 · 홍보 관련 준수 사항")
              }
              className={commonStyles.terms_view_link}
              aria-label="광고 · 홍보 관련 준수 사항 약관 보기"
            >
              보기
            </button>
          </div>
        </div>

        <div className={commonStyles.terms_item}>
          <input
            id="marketing-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={marketingAgreed}
            onChange={(e) => onMarketingAgreedChange(e.target.checked)}
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="marketing-agree"
              className={commonStyles.checkbox_label}
            >
              [선택] 마케팅 목적의 개인정보 수집 및 이용 동의
            </label>
            <button
              type="button"
              onClick={() =>
                handle_terms_view_click("마케팅 목적의 개인정보 수집 및 이용")
              }
              className={commonStyles.terms_view_link}
              aria-label="마케팅 목적의 개인정보 수집 및 이용 약관 보기"
            >
              보기
            </button>
          </div>
        </div>

        <div className={commonStyles.terms_item}>
          <input
            id="third-party-marketing-agree"
            type="checkbox"
            className={commonStyles.checkbox}
            checked={thirdPartyMarketingAgreed}
            onChange={(e) =>
              onThirdPartyMarketingAgreedChange(e.target.checked)
            }
          />
          <div className={commonStyles.terms_label_row}>
            <label
              htmlFor="third-party-marketing-agree"
              className={commonStyles.checkbox_label}
            >
              [선택] 제3자 정보 제공(마케팅/프로모션 목적) 동의
            </label>
            <button
              type="button"
              onClick={() =>
                handle_terms_view_click("제3자 정보 제공(마케팅/프로모션 목적)")
              }
              className={commonStyles.terms_view_link}
              aria-label="제3자 정보 제공(마케팅/프로모션 목적) 약관 보기"
            >
              보기
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className={commonStyles.error_message}>{error}</div>
      )}
    </>
  );
}
