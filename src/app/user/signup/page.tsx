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
 *
 * 호출 API:
 * - GET /reviewer/sign-up?signupToken={token} (prefill 데이터 로드)
 * - POST /api/v1/auth/phone/verify/request (인증번호 요청)
 * - POST /api/v1/auth/phone/verify/confirm (인증번호 확인)
 * - POST /api/v1/reviewer/sign-up (회원가입 완료)
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import TermsAgreement from "@/components/user/signup/TermsAgreement";
import SNSLoginModal from "@/components/common/find_account/modal/SNSLoginModal";
import { useTermsAgreement } from "@/hooks/user/signup/useTermsAgreement";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useSignupPage, useReviewerSignup } from "@/hooks/user/signup/useReviewerSignup";
import { startSocialLogin } from "@/lib/api/userAuth";
import {
  validateSignupForm,
  type SignupFormErrors,
} from "@/components/user/signup/utils/formValidation";
import PageTitle from "@/components/fragments/PageTitle";
import Loading from "@/app/loading";
import commonStyles from "@/styles/common/signup/signup.module.css";
import styles from "@/styles/user/signup/user_signup.module.css";

type SocialLoginType = "kakao" | "naver";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 signupToken, provider 추출
  const signupToken = searchParams.get("signupToken") ?? "";
  const providerParam = searchParams.get("provider") ?? "";

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

  // signupToken 검증 + prefill 데이터
  const { data: signupData, isError: isSignupTokenError } = useSignupPage(signupToken);

  // signupToken 없거나 유효하지 않으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!signupToken || isSignupTokenError) {
      router.replace("/user/login");
    }
  }, [signupToken, isSignupTokenError, router]);

  // prefill 이메일 (API 응답 또는 빈 값)
  const email = signupData?.email ?? "";

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

  // 회원가입 완료 mutation
  const signupMutation = useReviewerSignup();

  // phoneError에서 ALREADY_REGISTERED 감지 → A_M1 모달
  useEffect(() => {
    if (phoneError === "ALREADY_REGISTERED") {
      resetVerification();
      // provider에 따라 기존 SNS 타입 설정
      const socialType = providerParam === "KAKAO" ? "naver" : "kakao";
      setExistingAccountSocialType(socialType);
      setShowExistingAccountModal(true);
    }
  }, [phoneError, providerParam, resetVerification]);

  const handlePhoneChange = (newPhone: string) => {
    handlePhoneChangeHook(newPhone);
    if (newPhone === "" || isPhoneVerified || isVerificationRequested) {
      resetVerification();
      setErrors((prev) => ({
        ...prev,
        phone: undefined,
        verificationCode: undefined,
      }));
    }
  };

  const handleVerificationRequestClick = async () => {
    setErrors((prev) => ({ ...prev, verificationCode: undefined }));
    await handleVerificationRequest();
    if (phoneError && phoneError !== "ALREADY_REGISTERED") {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleVerifyClick = () => {
    handleVerifyCode();
    if (verificationCodeError) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: verificationCodeError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));
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

    // 실제 회원가입 API 호출
    signupMutation.mutate({
      signupToken,
      email,
      name: name.trim(),
      phoneNum: phone.replace(/-/g, ""),
      agreements: {
        termsServicePrivacyAgreed: termsAgreed,
        privacyThirdPartyAgreed: privacyAgreed,
        marketingPrivacyAgreed: marketingAgreed,
      },
    });
  };

  // 회원가입 에러 처리
  useEffect(() => {
    if (!signupMutation.error) return;
    const axiosErr = signupMutation.error as {
      response?: { data?: { errorCode?: string } };
    };
    const errCode = axiosErr?.response?.data?.errorCode;

    if (errCode === "INVALID_SIGNUP_TOKEN") {
      alert("회원가입 토큰이 만료되었습니다. 다시 로그인해 주세요.");
      router.replace("/user/login");
    } else if (errCode === "ALREADY_REGISTERED") {
      setShowExistingAccountModal(true);
    } else {
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [signupMutation.error, router]);

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
            error={phoneError && phoneError !== "ALREADY_REGISTERED" ? phoneError : errors.phone}
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
            disabled={
              !name.trim() ||
              !isPhoneVerified ||
              !termsAgreed ||
              !privacyAgreed ||
              signupMutation.isPending
            }
          >
            {signupMutation.isPending ? "처리 중..." : "회원가입"}
          </button>
        </form>
      </main>

      {/* A_M1: 이미 가입된 번호 → 기존 SNS 로그인 유도 모달 */}
      <SNSLoginModal
        isOpen={showExistingAccountModal}
        onClose={() => setShowExistingAccountModal(false)}
        socialType={existingAccountSocialType}
        onKakaoLogin={() => {
          setShowExistingAccountModal(false);
          startSocialLogin("kakao");
        }}
        onNaverLogin={() => {
          setShowExistingAccountModal(false);
          startSocialLogin("naver");
        }}
      />
    </div>
  );
}

export default function UserSignupPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupContent />
    </Suspense>
  );
}
