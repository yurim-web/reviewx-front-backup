/* ========================================
   🎣 파트너 약관 동의 관리 커스텀 훅
   ======================================== */

/**
 * 모듈 목적
 *
 * - 파트너 약관 동의 체크박스 상태 관리
 * - 전체 동의와 개별 동의 간 동기화 로직
 * - 전체 동의 직접 변경과 개별 변경 구분
 */

import { useState, useEffect, useRef } from 'react';

/**
 * 파트너 약관 동의 관리 커스텀 훅
 *
 * @returns {Object} 약관 동의 상태 및 제어 함수
 */
export function usePartnerTermsAgreement() {
  const [allAgreed, setAllAgreed] = useState<boolean>(false);
  const [serviceTermsAgreed, setServiceTermsAgreed] = useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [thirdPartyAgreed, setThirdPartyAgreed] = useState<boolean>(false);
  const [advertisingAgreed, setAdvertisingAgreed] = useState<boolean>(false);
  const [marketingAgreed, setMarketingAgreed] = useState<boolean>(false);
  const [thirdPartyMarketingAgreed, setThirdPartyMarketingAgreed] =
    useState<boolean>(false);
  const isAllAgreedDirectChange = useRef<boolean>(false);

  // 전체 동의가 직접 변경될 때만 하위 체크박스 업데이트
  useEffect(() => {
    if (isAllAgreedDirectChange.current) {
      if (allAgreed) {
        setServiceTermsAgreed(true);
        setPrivacyAgreed(true);
        setThirdPartyAgreed(true);
        setAdvertisingAgreed(true);
        setMarketingAgreed(true);
        setThirdPartyMarketingAgreed(true);
      } else {
        setServiceTermsAgreed(false);
        setPrivacyAgreed(false);
        setThirdPartyAgreed(false);
        setAdvertisingAgreed(false);
        setMarketingAgreed(false);
        setThirdPartyMarketingAgreed(false);
      }
      isAllAgreedDirectChange.current = false;
    }
  }, [allAgreed]);

  // 하위 체크박스 변경 시 전체 동의 상태만 업데이트
  useEffect(() => {
    if (!isAllAgreedDirectChange.current) {
      if (
        serviceTermsAgreed &&
        privacyAgreed &&
        thirdPartyAgreed &&
        advertisingAgreed &&
        marketingAgreed &&
        thirdPartyMarketingAgreed
      ) {
        setAllAgreed(true);
      } else {
        setAllAgreed(false);
      }
    }
  }, [
    serviceTermsAgreed,
    privacyAgreed,
    thirdPartyAgreed,
    advertisingAgreed,
    marketingAgreed,
    thirdPartyMarketingAgreed,
  ]);

  const handleAllAgreedChange = (checked: boolean) => {
    isAllAgreedDirectChange.current = true;
    setAllAgreed(checked);
  };

  return {
    allAgreed,
    serviceTermsAgreed,
    privacyAgreed,
    thirdPartyAgreed,
    advertisingAgreed,
    marketingAgreed,
    thirdPartyMarketingAgreed,
    setServiceTermsAgreed,
    setPrivacyAgreed,
    setThirdPartyAgreed,
    setAdvertisingAgreed,
    setMarketingAgreed,
    setThirdPartyMarketingAgreed,
    handleAllAgreedChange,
  };
}

