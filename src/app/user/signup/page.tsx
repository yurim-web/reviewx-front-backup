/* ========================================
   유저 회원가입 페이지
   ======================================== */

/**
 * UserSignupPage
 *
 * 목적: 소셜 로그인(카카오/네이버) 기반으로 신규 리뷰어가 회원가입하는 페이지
 *
 * 사용 페이지:
 * - /user/signup (리뷰어 회원가입)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import TermsAgreement from "@/components/user/signup/TermsAgreement";
import SNSLoginModal from "@/components/common/find_account/modal/SNSLoginModal";
import { useTermsAgreement } from "@/hooks/user/signup/useTermsAgreement";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import {
  validateSignupForm,
  type SignupFormErrors,
} from "@/components/user/signup/utils/formValidation";
import PageTitle from "@/components/fragments/PageTitle";
import { checkTestPhoneNumber } from "@/data/signup/testVerificationData";
import commonStyles from "@/styles/common/signup/signup.module.css";
import styles from "@/styles/user/signup/user_signup.module.css";

type SocialLoginType = "kakao" | "naver";

export default function UserSignupPage() {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const check = () => {
      setHasScroll(document.documentElement.scrollHeight > window.innerHeight);
    };
    check();
    requestAnimationFrame(check);
    window.addEventListener("resize", check);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", check);
    };
  }, [isMobile]);

  const [email] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [showExistingAccountModal, setShowExistingAccountModal] = useState<boolean>(false);
  const [existingAccountSocialType, setExistingAccountSocialType] =
    useState<SocialLoginType>("kakao");

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
    handlePhoneChange: handlePhoneChangeHook,
    handleVerificationRequest,
    handleVerificationCodeChange,
    handleVerifyCode,
    resetVerification,
  } = usePhoneVerification();

  const handlePhoneChange = (newPhone: string) => {
    handlePhoneChangeHook(newPhone);
    if (newPhone === "" || isPhoneVerified || isVerificationRequested) {
      resetVerification();
      setErrors((prev) => ({ ...prev, phone: undefined, verificationCode: undefined }));
    }
  };

  const handleVerificationRequestClick = async () => {
    setErrors((prev) => ({ ...prev, verificationCode: undefined }));
    await handleVerificationRequest();
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleVerifyClick = () => {
    handleVerifyCode();
    if (verificationCodeError) {
      setErrors((prev) => ({ ...prev, verificationCode: verificationCodeError }));
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));

      const testPhoneInfo = checkTestPhoneNumber(phone);
      if (testPhoneInfo?.type === "existing_kakao") {
        resetVerification();
        setExistingAccountSocialType("kakao");
        setShowExistingAccountModal(true);
      } else if (testPhoneInfo?.type === "existing_naver") {
        resetVerification();
        setExistingAccountSocialType("naver");
        setShowExistingAccountModal(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateSignupForm({
      email,
      name,
      phone,
      isPhoneVerified,
      termsAgreed,
      privacyAgreed,
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const testPhoneInfo = checkTestPhoneNumber(phone);

    if (testPhoneInfo?.type === "normal") {
      resetVerification();
      setExistingAccountSocialType("kakao");
      setShowExistingAccountModal(true);
      return;
    }

    if (testPhoneInfo?.type === "duplicate") {
      setErrors((prev) => ({ ...prev, phone: "이미 사용 중인 휴대폰 번호입니다." }));
      return;
    }

    if (testPhoneInfo?.type === "blocked") {
      setErrors((prev) => ({ ...prev, phone: "정지되었거나 탈퇴된 계정입니다." }));
      return;
    }

    // TODO: 실제 API 호출
    const displayName = name.trim() || "회원";
    router.push(`/user/signup/complete?nickname=${encodeURIComponent(displayName)}`);
  };

  return (
    <div
      className={`${styles.signup_page_container} ${isMobile && hasScroll ? styles.has_scroll : ""}`.trim()}
    >
      {!isMobile && <SubHeader title="리뷰어 회원가입" showBackButton={true} />}

      <PageTitle title="리뷰어 회원가입" />

      <main className={styles.signup_main}>
        <form className={styles.signup_form} onSubmit={handleSubmit}>
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="email">
              아이디(이메일)
            </label>
            <input
              id="email"
              type="email"
              className={`${commonStyles.input_field} ${errors.email ? commonStyles.input_error : ""}`}
              placeholder="{SNS에 등록한 이메일}"
              value={email}
              readOnly
              onInvalid={(e) => e.preventDefault()}
            />
          </div>

          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              className={`${commonStyles.input_field} ${errors.name ? commonStyles.input_error : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              onInvalid={(e) => e.preventDefault()}
            />
          </div>

          <PhoneVerification
            phone={phone}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            isPhoneVerified={isPhoneVerified}
            timer={timer}
            error={phoneError || errors.phone}
            verificationCodeError={verificationCodeError || errors.verificationCode}
            onPhoneChange={handlePhoneChange}
            onVerificationRequest={handleVerificationRequestClick}
            onResend={handleVerificationRequestClick}
            onVerify={handleVerifyClick}
            onVerificationCodeChange={(code) => {
              handleVerificationCodeChange(code);
              setErrors((prev) => ({ ...prev, verificationCode: undefined }));
            }}
          />

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

          <button
            type="submit"
            className={`${commonStyles.submit_button} ${styles.submit_button} ${
              name.trim() && isPhoneVerified && termsAgreed && privacyAgreed
                ? ""
                : commonStyles.submit_button_disabled
            }`}
            disabled={!name.trim() || !isPhoneVerified || !termsAgreed || !privacyAgreed}
          >
            회원가입
          </button>
        </form>
      </main>

      <SNSLoginModal
        isOpen={showExistingAccountModal}
        onClose={() => setShowExistingAccountModal(false)}
        socialType={existingAccountSocialType}
        onKakaoLogin={() => {
          // TODO: 카카오 로그인 처리
          setShowExistingAccountModal(false);
        }}
        onNaverLogin={() => {
          // TODO: 네이버 로그인 처리
          setShowExistingAccountModal(false);
        }}
      />
    </div>
  );
}
