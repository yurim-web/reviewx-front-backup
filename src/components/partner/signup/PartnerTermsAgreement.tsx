/* ========================================
   ✅ 파트너 약관 동의 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 회원가입용 약관 동의 체크박스 UI
 * - 전체 동의 및 개별 동의 관리
 * - 파트너 전용 약관 항목 포함
 */

'use client';

import Link from 'next/link';
import styles from '@/styles/partner/signup/signup.module.css';

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
  return (
    <>
      <div className={styles.terms_section}>
        <div className={styles.terms_all_agree}>
          <input
            id="all-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={allAgreed}
            onChange={(e) => onAllAgreedChange(e.target.checked)}
          />
          <label htmlFor="all-agree" className={styles.checkbox_label}>
            전체 동의
          </label>
        </div>

        <div className={styles.terms_divider}></div>

        <div className={styles.terms_item}>
          <input
            id="service-terms-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={serviceTermsAgreed}
            onChange={(e) => onServiceTermsAgreedChange(e.target.checked)}
          />
          <label
            htmlFor="service-terms-agree"
            className={styles.checkbox_label}
          >
            [필수] 서비스 이용 약관 동의
          </label>
          <Link href="/terms" className={styles.terms_view_link}>
            보기
          </Link>
        </div>

        <div className={styles.terms_item}>
          <input
            id="privacy-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={privacyAgreed}
            onChange={(e) => onPrivacyAgreedChange(e.target.checked)}
          />
          <label htmlFor="privacy-agree" className={styles.checkbox_label}>
            [필수] 개인정보 수집 및 이용 동의
          </label>
          <Link href="/privacy" className={styles.terms_view_link}>
            보기
          </Link>
        </div>

        <div className={styles.terms_item}>
          <input
            id="third-party-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={thirdPartyAgreed}
            onChange={(e) => onThirdPartyAgreedChange(e.target.checked)}
          />
          <label htmlFor="third-party-agree" className={styles.checkbox_label}>
            [필수] 개인정보 제3자 제공 동의
          </label>
          <Link href="/third-party" className={styles.terms_view_link}>
            보기
          </Link>
        </div>

        <div className={styles.terms_item}>
          <input
            id="advertising-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={advertisingAgreed}
            onChange={(e) => onAdvertisingAgreedChange(e.target.checked)}
          />
          <label htmlFor="advertising-agree" className={styles.checkbox_label}>
            [필수] 광고 · 홍보 관련 준수 사항 동의
          </label>
          <Link href="/advertising" className={styles.terms_view_link}>
            보기
          </Link>
        </div>

        <div className={styles.terms_item}>
          <input
            id="marketing-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={marketingAgreed}
            onChange={(e) => onMarketingAgreedChange(e.target.checked)}
          />
          <label htmlFor="marketing-agree" className={styles.checkbox_label}>
            [선택] 마케팅 목적의 개인정보 수집 및 이용 동의
          </label>
          <Link href="/marketing" className={styles.terms_view_link}>
            보기
          </Link>
        </div>

        <div className={styles.terms_item}>
          <input
            id="third-party-marketing-agree"
            type="checkbox"
            className={styles.checkbox}
            checked={thirdPartyMarketingAgreed}
            onChange={(e) =>
              onThirdPartyMarketingAgreedChange(e.target.checked)
            }
          />
          <label
            htmlFor="third-party-marketing-agree"
            className={styles.checkbox_label}
          >
            [선택] 제3자 정보 제공(마케팅/프로모션 목적) 동의
          </label>
          <Link href="/third-party-marketing" className={styles.terms_view_link}>
            보기
          </Link>
        </div>
      </div>

      {error && (
        <div className={styles.error_message}>
          <span className={styles.error_text}>{error}</span>
        </div>
      )}
    </>
  );
}

