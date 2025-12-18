/* ========================================
   🎣 약관 동의 관리 커스텀 훅 (사용자)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 약관 동의 체크박스 상태 관리
 * - 전체 동의와 개별 동의 간 동기화 로직
 * - 전체 동의 직접 변경과 개별 변경 구분
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 약관 동의 체크박스 상태 관리에 사용)
 *
 * 📌 훅 위치:
 * - src/hooks/user/signup/useTermsAgreement.ts
 */

import { useState, useEffect, useRef } from 'react';

/**
 * 약관 동의 관리 커스텀 훅
 *
 * @returns {Object} 약관 동의 상태 및 제어 함수
 */
export function useTermsAgreement() {
  const [allAgreed, setAllAgreed] = useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [marketingAgreed, setMarketingAgreed] = useState<boolean>(false);
  const isAllAgreedDirectChange = useRef<boolean>(false);

  // 전체 동의가 직접 변경될 때만 하위 체크박스 업데이트
  useEffect(() => {
    if (isAllAgreedDirectChange.current) {
      if (allAgreed) {
        setTermsAgreed(true);
        setPrivacyAgreed(true);
        setMarketingAgreed(true);
      } else {
        setTermsAgreed(false);
        setPrivacyAgreed(false);
        setMarketingAgreed(false);
      }
      isAllAgreedDirectChange.current = false;
    }
  }, [allAgreed]);

  // 하위 체크박스 변경 시 전체 동의 상태만 업데이트
  useEffect(() => {
    if (!isAllAgreedDirectChange.current) {
      if (termsAgreed && privacyAgreed && marketingAgreed) {
        setAllAgreed(true);
      } else {
        setAllAgreed(false);
      }
    }
  }, [termsAgreed, privacyAgreed, marketingAgreed]);

  const handleAllAgreedChange = (checked: boolean) => {
    isAllAgreedDirectChange.current = true;
    setAllAgreed(checked);
  };

  return {
    allAgreed,
    termsAgreed,
    privacyAgreed,
    marketingAgreed,
    setTermsAgreed,
    setPrivacyAgreed,
    setMarketingAgreed,
    handleAllAgreedChange,
  };
}
