/* ========================================
   ✅ 약관 동의 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 이용약관 및 개인정보 동의 체크박스 UI
 * - 전체 동의 및 개별 동의 관리
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 약관 동의에 사용)
 */

"use client";

import { useState } from "react";
import commonStyles from "@/styles/common/signup/signup.module.css";
import TermsViewModal, {
  type TermsViewModalType,
} from "@/components/user/signup/TermsViewModal";

interface TermsAgreementProps {
  allAgreed: boolean;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  error?: string;
  onAllAgreedChange: (checked: boolean) => void;
  onTermsAgreedChange: (checked: boolean) => void;
  onPrivacyAgreedChange: (checked: boolean) => void;
  onMarketingAgreedChange: (checked: boolean) => void;
}

export default function TermsAgreement({
  allAgreed,
  termsAgreed,
  privacyAgreed,
  marketingAgreed,
  error,
  onAllAgreedChange,
  onTermsAgreedChange,
  onPrivacyAgreedChange,
  onMarketingAgreedChange,
}: TermsAgreementProps) {
  const [terms_modal_type, set_terms_modal_type] =
    useState<TermsViewModalType>(null);

  return (
    <>
      <TermsViewModal
        is_open={terms_modal_type !== null}
        on_close={() => set_terms_modal_type(null)}
        type={terms_modal_type}
      />
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

        <div className={commonStyles.terms_group}>
          <div className={commonStyles.terms_item}>
            <input
              id="terms-agree"
              type="checkbox"
              className={commonStyles.checkbox}
              checked={termsAgreed}
              onChange={(e) => onTermsAgreedChange(e.target.checked)}
            />
            <div className={commonStyles.terms_label_row}>
              <label
                htmlFor="terms-agree"
                className={commonStyles.checkbox_label}
              >
                [필수] 이용약관 및 개인정보 관련 동의
              </label>
              <button
                type="button"
                className={commonStyles.terms_view_link}
                onClick={() => set_terms_modal_type("terms")}
              >
                보기
              </button>
            </div>
          </div>

          <div className={commonStyles.terms_sub_items}>
            <p>- 서비스 이용 약관</p>
            <p>- 개인정보 수집 및 이용</p>
            <p>- 개인정보 처리 위탁</p>
            <p>- 고유 식별 정보 및 금융 정보 수집</p>
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
              [필수] 개인정보 제3자 제공 동의
            </label>
            <button
              type="button"
              className={commonStyles.terms_view_link}
              onClick={() => set_terms_modal_type("privacy")}
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
              className={commonStyles.terms_view_link}
              onClick={() => set_terms_modal_type("marketing")}
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
