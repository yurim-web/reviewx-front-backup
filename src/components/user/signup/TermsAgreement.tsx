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

'use client';

import Link from 'next/link';
import styles from '@/styles/user/signup/signup.module.css';

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

        <div className={styles.terms_group}>
          <div className={styles.terms_item}>
            <input
              id="terms-agree"
              type="checkbox"
              className={styles.checkbox}
              checked={termsAgreed}
              onChange={(e) => onTermsAgreedChange(e.target.checked)}
            />
            <label htmlFor="terms-agree" className={styles.checkbox_label}>
              [필수] 이용약관 및 개인정보 관련 동의
            </label>
            <Link href="/terms" className={styles.terms_view_link}>
              보기
            </Link>
          </div>

          <div className={styles.terms_sub_items}>
            <p>- 서비스 이용 약관</p>
            <p>- 개인정보 수집 및 이용</p>
            <p>- 개인정보 처리 위탁</p>
            <p>- 고유 식별 정보 및 금융 정보 수집</p>
          </div>
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
            [필수] 개인정보 제3자 제공 동의
          </label>
          <Link href="/privacy" className={styles.terms_view_link}>
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
      </div>

      {error && (
        <div className={styles.error_message}>
          <span className={styles.error_text}>{error}</span>
        </div>
      )}
    </>
  );
}
