/* ========================================
   📝 유저 회원가입 페이지
   ======================================== */

/**
 * 유저 회원가입 페이지
 *
 * 목적: 새로운 유저가 회원가입을 할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/signup
 *
 * 주요 기능:
 * - 아이디(이메일) 입력
 * - 이름 입력
 * - 휴대폰 번호 인증
 * - 약관 동의
 * - 회원가입 (소셜 로그인 기반)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/fragments/Header";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import TermsAgreement from "@/components/user/signup/TermsAgreement";
import ExistingAccountModal, {
  type SocialLoginType,
} from "@/components/user/signup/ExistingAccountModal";
import { useTermsAgreement } from "@/hooks/user/signup/useTermsAgreement";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import {
  validateSignupForm,
  type SignupFormErrors,
} from "@/components/user/signup/utils/formValidation";
import PageTitle from "@/components/fragments/PageTitle";
import {
  TEST_VERIFICATION_CODES,
  TEST_PHONE_NUMBERS,
  checkTestVerificationCode,
  checkTestPhoneNumber,
} from "@/data/signup/testVerificationData";
import commonStyles from "@/styles/common/signup/signup.module.css";
import styles from "@/styles/user/signup/user_signup.module.css";

/**
 * 유저 회원가입 페이지 컴포넌트
 *
 * @returns JSX.Element - 유저 회원가입 페이지 UI
 */
export default function UserSignupPage() {
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  // 폼 데이터
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  // 에러 메시지
  const [errors, setErrors] = useState<SignupFormErrors>({});

  // 모달 상태
  const [showExistingAccountModal, setShowExistingAccountModal] =
    useState<boolean>(false);
  // 기존 계정의 소셜 로그인 타입 (카카오 또는 네이버)
  const [existingAccountSocialType, setExistingAccountSocialType] =
    useState<SocialLoginType>("kakao");

  // 커스텀 훅 사용
  const {
    allAgreed,
    termsAgreed,
    privacyAgreed,
    marketingAgreed,
    setTermsAgreed,
    setPrivacyAgreed,
    setMarketingAgreed,
    handleAllAgreedChange,
  } = useTermsAgreement();

  const {
    phone,
    verificationCode,
    isVerificationRequested,
    isPhoneVerified,
    timer,
    phoneError,
    verificationCodeError,
    setPhone,
    setVerificationCode,
    handlePhoneChange: handlePhoneChangeHook,
    handleVerificationRequest,
    handleVerificationCodeChange,
    handleVerifyCode,
    resetVerification,
  } = usePhoneVerification();

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * ========================================
   * 휴대폰 번호 변경 핸들러
   * ========================================
   * 기능: 휴대폰 번호 변경 시 인증 상태 초기화
   */
  const handlePhoneChange = (newPhone: string) => {
    // 훅의 handlePhoneChange를 사용하여 phoneError 자동 초기화
    handlePhoneChangeHook(newPhone);

    // 휴대폰 번호 변경 시 인증 상태 초기화
    if (newPhone === "" || isPhoneVerified || isVerificationRequested) {
      resetVerification();
      setErrors((prev) => ({
        ...prev,
        phone: undefined,
        verificationCode: undefined,
      }));
    }
  };

  /**
   * ========================================
   * 인증번호 받기 핸들러
   * ========================================
   * 기능: 휴대폰 번호 인증번호 요청
   */
  const handleVerificationRequestClick = async () => {
    await handleVerificationRequest();
    // 에러는 훅 내부에서 phoneError로 관리됨
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  /**
   * ========================================
   * 인증 확인 핸들러
   * ========================================
   * 기능: 인증번호 확인 및 인증 완료 처리
   */
  const handleVerifyClick = () => {
    handleVerifyCode();
    // 에러는 훅 내부에서 verificationCodeError로 관리됨
    if (verificationCodeError) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: verificationCodeError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));

      // 인증 완료 후 해당 휴대폰 번호로 가입된 계정이 있는지 확인
      // TODO: 실제 API 호출
      // const response = await checkExistingAccount(phone);
      // if (response.hasExistingAccount) {
      //   setExistingAccountSocialType(response.socialLoginType); // 'kakao' 또는 'naver'
      //   setShowExistingAccountModal(true);
      //   return;
      // }

      // 테스트용: 특정 휴대폰 번호로 이미 가입된 계정이 있는지 확인
      const testPhoneInfo = checkTestPhoneNumber(phone);

      if (testPhoneInfo?.type === "existing_kakao") {
        // 기존 계정이 있으면 인증 상태 초기화 후 모달 표시
        resetVerification();
        setExistingAccountSocialType("kakao");
        setShowExistingAccountModal(true);
      } else if (testPhoneInfo?.type === "existing_naver") {
        // 기존 계정이 있으면 인증 상태 초기화 후 모달 표시
        resetVerification();
        setExistingAccountSocialType("naver");
        setShowExistingAccountModal(true);
      }
    }
  };

  /**
   * ========================================
   * 회원가입 폼 제출 핸들러
   * ========================================
   * 기능: 회원가입 폼 유효성 검증 및 제출 처리
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 폼 유효성 검증
    const newErrors = validateSignupForm({
      email,
      name,
      phone,
      isPhoneVerified,
      termsAgreed,
      privacyAgreed,
    });

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // 회원가입 처리
    console.log("회원가입 시도:", {
      email,
      name,
      phone,
      marketingAgreed,
    });

    // TODO: 실제 API 호출
    // const response = await signupAPI({ email, password, name, phone, marketingAgreed });
    // if (response.success) {
    //   router.push('/user/login');
    // }

    // 테스트용: 성공 시 회원가입 완료 페이지로 이동
    router.push(`/user/signup/complete?nickname=${encodeURIComponent(name)}`);
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <div className={styles.signup_page_container}>
      {/* ========================================
          메인 헤더
          ========================================
          기능: 상단 네비게이션 헤더 표시
      */}
      <Header />

      {/* 서브 헤더 */}
      <PageTitle title="리뷰어 회원가입" />

      {/* ========================================
          메인 콘텐츠 영역
          ========================================
          기능: 회원가입 폼이 표시되는 메인 영역
      */}
      <main className={styles.signup_main}>
        {/* ========================================
            회원가입 폼
            ========================================
            기능: 회원가입 입력 폼
            - 아이디(이메일), 이름, 휴대폰 번호 입력
            - 약관 동의 체크박스
            - 회원가입 제출 버튼
        */}
        <form className={styles.signup_form} onSubmit={handleSubmit}>
          {/* ========================================
              아이디(이메일) 입력 필드
              ========================================
              기능: 이메일 형식의 아이디 입력
              - 이메일 형식 검증
              - 에러 시 빨간색 테두리 표시
          */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="email">
              아이디(이메일)
            </label>
            <input
              id="email"
              type="email"
              className={`${commonStyles.input_field} ${
                errors.email ? commonStyles.input_error : ""
              }`}
              placeholder="{SNS에 등록한 이메일}"
              value={email}
              readOnly
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
          </div>

          {/* ========================================
              이름 입력 필드
              ========================================
              기능: 사용자 이름 입력
              - 필수 입력 필드
              - 에러 시 빨간색 테두리 표시
          */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              className={`${commonStyles.input_field} ${
                errors.name ? commonStyles.input_error : ""
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
          </div>

          {/* ========================================
              휴대폰 번호 입력 및 인증
              ========================================
              기능: 휴대폰 번호 입력 및 SMS 인증
          */}
          <PhoneVerification
            phone={phone}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            isPhoneVerified={isPhoneVerified}
            timer={timer}
            error={phoneError || errors.phone}
            verificationCodeError={
              verificationCodeError || errors.verificationCode
            }
            onPhoneChange={handlePhoneChange}
            onVerificationRequest={handleVerificationRequestClick}
            onResend={handleVerificationRequestClick}
            onVerify={handleVerifyClick}
            onVerificationCodeChange={(code) => {
              handleVerificationCodeChange(code);
              // 로컬 에러 상태도 초기화
              setErrors((prev) => ({
                ...prev,
                verificationCode: undefined,
              }));
            }}
          />

          {/* ========================================
              약관 동의 섹션
              ========================================
              기능: 이용약관 및 개인정보 동의
          */}
          <TermsAgreement
            allAgreed={allAgreed}
            termsAgreed={termsAgreed}
            privacyAgreed={privacyAgreed}
            marketingAgreed={marketingAgreed}
            error={errors.terms}
            onAllAgreedChange={handleAllAgreedChange}
            onTermsAgreedChange={setTermsAgreed}
            onPrivacyAgreedChange={setPrivacyAgreed}
            onMarketingAgreedChange={setMarketingAgreed}
          />

          {/* ========================================
              회원가입 제출 버튼
              ========================================
              기능: 회원가입 폼 제출
              - 모든 유효성 검증 통과 시 제출
              - 성공 시 로그인 페이지로 이동
              - 활성화 조건: 이름 입력 + 휴대폰 인증 완료 + 필수 동의 완료
          */}
          <button
            type="submit"
            className={`${commonStyles.submit_button} ${styles.submit_button} ${
              name.trim() && isPhoneVerified && termsAgreed && privacyAgreed
                ? ""
                : commonStyles.submit_button_disabled
            }`}
            disabled={
              !name.trim() || !isPhoneVerified || !termsAgreed || !privacyAgreed
            }
          >
            회원가입
          </button>
        </form>
      </main>

      {/* ========================================
          기존 계정 모달
          ========================================
          기능: 해당 휴대폰 번호로 가입된 계정이 있을 때 표시
          - 카카오 로그인하기 버튼
          - 닫기 버튼
      */}
      {showExistingAccountModal && (
        <ExistingAccountModal
          onClose={() => setShowExistingAccountModal(false)}
          socialLoginType={existingAccountSocialType}
          onKakaoLogin={() => {
            // TODO: 카카오 로그인 처리
            console.log("카카오 로그인");
            setShowExistingAccountModal(false);
            // router.push('/user/sns_login?provider=kakao');
          }}
          onNaverLogin={() => {
            // TODO: 네이버 로그인 처리
            console.log("네이버 로그인");
            setShowExistingAccountModal(false);
            // router.push('/user/sns_login?provider=naver');
          }}
        />
      )}
    </div>
  );
}
