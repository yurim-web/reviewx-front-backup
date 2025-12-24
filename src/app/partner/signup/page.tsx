/* ========================================
   📝 파트너 회원가입 페이지
   ======================================== */

/**
 * 파트너 회원가입 페이지
 *
 * 목적: 새로운 파트너가 회원가입을 할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/signup
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import PartnerTermsAgreement from "@/components/partner/signup/PartnerTermsAgreement";
import BusinessDocumentUpload from "@/components/partner/mypage/BusinessDocumentUpload";
import AddressInput from "@/components/partner/signup/AddressInput";
import BaseModal from "@/components/common/modal/BaseModal";
import ErrorText from "@/components/common/error_text/ErrorText";
import PasswordField from "@/components/common/signup/PasswordField";
import { usePartnerTermsAgreement } from "@/hooks/partner/signup/usePartnerTermsAgreement";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import {
  validatePartnerSignupForm,
  type PartnerSignupFormErrors,
} from "@/components/partner/signup/utils/formValidation";
import { formatBusinessNumber } from "@/components/partner/signup/utils/businessNumberUtils";
import { formatPhoneNumber } from "@/utils/signup/phoneUtils";
import PageTitle from "@/components/fragments/PageTitle";
import { getAccountsByType } from "@/data/login/unifiedAccountData";
import commonStyles from "@/styles/common/signup/signup.module.css";
import styles from "@/styles/partner/signup/partner_signup.module.css";

/**
 * 파트너 회원가입 페이지 컴포넌트
 *
 * @returns JSX.Element - 파트너 회원가입 페이지 UI
 *
 * ================================================================================================
 * 📋 에러 메시지 표시 경우의 수 정리 (Error Message Display Cases)
 * ================================================================================================
 *
 * 이 페이지에서 표시되는 에러 메시지는 ErrorText 컴포넌트로 표시됩니다.
 * input 필드의 테두리는 빨간색으로 변하지 않으며, 에러 메시지만 표시됩니다.
 *
 * 1️⃣ 이메일 (아이디) 필드 (실시간 검증)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 형식 오류: "올바른 이메일 형식을 입력해주세요." (입력 시 실시간 표시)
 *    - 중복 체크: "이미 사용 중인 아이디입니다." (실시간 체크, 이메일 형식이 유효할 때만)
 *
 * 2️⃣ 비밀번호 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 형식 오류: "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요."
 *
 * 3️⃣ 비밀번호 확인 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 불일치: "비밀번호가 일치하지 않습니다."
 *
 * 4️⃣ 이름 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 5️⃣ 휴대폰 번호 필드 (PhoneVerification 컴포넌트)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 형식 오류: "올바른 휴대폰 번호 형식을 입력해주세요." (인증번호 받기 버튼 클릭 시)
 *    - 인증 미완료: "휴대폰 인증을 완료해주세요." (폼 제출 시)
 *    - 중복 체크: "이미 가입된 휴대폰 번호입니다." (인증 완료 후)
 *    - 요청 횟수 초과: "인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요."
 *                     (인증번호 입력 영역에 표시, 휴대폰 번호 필드 아래 아님)
 *
 * 6️⃣ 인증번호 필드 (PhoneVerification 컴포넌트)
 *    - 빈 필드 또는 형식 오류: "인증번호 6자리를 입력해주세요." (인증 버튼 클릭 시)
 *    - 불일치: "인증번호가 일치하지 않습니다." (인증 버튼 클릭 시)
 *    - 시간 초과: "인증번호 입력 시간을 초과했습니다." (타이머 0이 되었을 때 자동)
 *
 * 7️⃣ 상호명 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 8️⃣ 대표자명 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 9️⃣ 사업자등록번호 필드
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 형식 오류: "올바른 사업자등록번호 형식을 입력해주세요." (형식: XXX-XX-XXXXX)
 *
 * 🔟 사업자등록증 업로드 (BusinessDocumentUpload 컴포넌트 - 모달로 표시)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리, 폼 제출 시만 검증)
 *    - 파일 크기 오류: "10mb 이하의 파일만 업로드할 수 있습니다." (BaseModal)
 *    - 파일 확장자 오류: "지정된 확장자(PDF, JPG, PNG)만<br>업로드할 수 있습니다." (BaseModal)
 *
 * 1️⃣1️⃣ 우편번호 필드 (AddressInput 컴포넌트)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 1️⃣2️⃣ 주소 필드 (AddressInput 컴포넌트)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 1️⃣3️⃣ 상세 주소 필드 (AddressInput 컴포넌트)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *
 * 1️⃣4️⃣ 문의 담당자 휴대폰 번호 필드 (실시간 검증)
 *    - 빈 필드: 에러 메시지 없음 (빈 문자열로 처리)
 *    - 형식 오류: "올바른 휴대폰 번호 형식을 입력해주세요. (010-0000-0000)" (입력 시 실시간 표시)
 *
 * 1️⃣5️⃣ 약관 동의 (PartnerTermsAgreement 컴포넌트)
 *    - 미동의: "이용 약관에 동의해 주세요."
 *
 * ⚠️ 주의사항:
 *    - 빈 필드는 폼 제출 시에만 검증되며, 에러 메시지는 표시되지 않습니다 (빈 문자열 처리).
 *    - 모든 에러 메시지는 ErrorText 컴포넌트로 표시되며, input 테두리는 빨간색으로 변하지 않습니다.
 *    - 사업자등록증 업로드 에러는 BaseModal로 표시됩니다 (ErrorText 아님).
 *    - 휴대폰 인증 관련 에러는 PhoneVerification 컴포넌트 내부에서 관리됩니다.
 */
export default function PartnerSignupPage() {
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  // 폼 데이터
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [representativeName, setRepresentativeName] = useState<string>("");
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [businessRegistrationFile, setBusinessRegistrationFile] =
    useState<File | null>(null);
  const [businessRegistrationFileName, setBusinessRegistrationFileName] =
    useState<string | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  // 에러 메시지
  const [errors, setErrors] = useState<PartnerSignupFormErrors>({});

  // 파일 업로드 얼럿

  // 커스텀 훅 사용
  const {
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
  } = usePartnerTermsAgreement();

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
   */
  const handlePhoneChange = (newPhone: string) => {
    // 훅의 handlePhoneChange를 사용하여 phoneError 자동 초기화
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

  /**
   * ========================================
   * 인증번호 받기 핸들러
   * ========================================
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
   */
  const handleVerifyClick = async () => {
    handleVerifyCode();
    // 에러는 훅 내부에서 verificationCodeError로 관리됨
    if (verificationCodeError) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: verificationCodeError,
      }));
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));

      // 인증 완료 후 해당 휴대폰 번호로 이미 가입된 계정이 있는지 확인
      // TODO: 실제 API 호출
      // const response = await checkPartnerPhoneDuplicate(phone);
      // if (response.isDuplicate) {
      //   setErrors((prev) => ({
      //     ...prev,
      //     phone: "이미 가입된 휴대폰 번호입니다.",
      //   }));
      //   resetVerification();
      //   return;
      // }

      // 테스트용: 파트너 계정 데이터에서 휴대폰 번호 중복 체크
      // 실제 구현 시 API 호출로 교체 필요
      const partnerAccounts = getAccountsByType("partner");
      const normalizedPhone = phone.replace(/-/g, "");
      const isDuplicate = partnerAccounts.some(
        (account) => account.phone.replace(/-/g, "") === normalizedPhone
      );
      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          phone: "이미 가입된 휴대폰 번호입니다.",
        }));
        resetVerification();
      }
    }
  };

  /**
   * ========================================
   * 사업자등록번호 변경 핸들러
   * ========================================
   */
  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatBusinessNumber(e.target.value);
    setBusinessNumber(formatted);
    setErrors((prev) => ({ ...prev, businessNumber: undefined }));
  };

  /**
   * ========================================
   * 사업자등록증 파일 선택 핸들러
   * ========================================
   */
  const handleBusinessRegistrationFileSelect = (file: File | null) => {
    if (file) {
      setBusinessRegistrationFile(file);
      setBusinessRegistrationFileName(file.name);
      setErrors((prev) => ({ ...prev, businessRegistration: undefined }));
    } else {
      setBusinessRegistrationFile(null);
      setBusinessRegistrationFileName(null);
    }
  };

  /**
   * ========================================
   * 우편번호 찾기 핸들러
   * ========================================
   */
  const handlePostalCodeSearch = () => {
    // TODO: 실제 우편번호 찾기 API 연동
    // 현재는 임시로 alert 표시
    alert("우편번호 찾기 기능은 준비 중입니다.");
  };

  /**
   * ========================================
   * 회원가입 폼 제출 핸들러
   * ========================================
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 폼 유효성 검증
    const newErrors = validatePartnerSignupForm({
      email,
      password,
      passwordConfirm,
      name,
      phone,
      isPhoneVerified,
      companyName,
      representativeName,
      businessNumber,
      businessRegistrationFile,
      postalCode,
      address,
      detailAddress,
      contactPhone,
      serviceTermsAgreed,
      privacyAgreed,
      thirdPartyAgreed,
      advertisingAgreed,
    });

    setErrors(newErrors);

    // 에러가 있으면 제출 중단 (빈 문자열도 에러로 간주)
    const hasErrors = Object.keys(newErrors).some(
      (key) => newErrors[key as keyof typeof newErrors] !== undefined
    );
    if (hasErrors) {
      return;
    }

    // 회원가입 처리
    console.log("파트너 회원가입 시도:", {
      email,
      password,
      name,
      phone,
      companyName,
      representativeName,
      businessNumber,
      businessRegistrationFile: businessRegistrationFileName,
      postalCode,
      address,
      detailAddress,
      contactPhone,
      marketingAgreed,
      thirdPartyMarketingAgreed,
    });

    // TODO: 실제 API 호출
    // const response = await partnerSignupAPI({ ... });
    // if (response.success) {
    //   router.push('/partner/login');
    // }

    // 테스트용: 성공 시 회원가입 완료 페이지로 이동
    router.push(`/partner/signup/complete?name=${encodeURIComponent(name)}`);
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <div className={styles.signup_page_container}>
      {/* 메인 헤더 */}
      <PartnerHeader />

      {/* 서브 헤더 */}

      <PageTitle title="파트너 회원가입" />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.signup_main}>
        {/* 회원가입 폼 */}
        <form className={styles.signup_form} onSubmit={handleSubmit}>
          {/* 아이디(이메일) 입력 */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="email">
              아이디(이메일)
            </label>
            <input
              id="email"
              type="email"
              className={commonStyles.input_field}
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);

                // 실시간 이메일 형식 검증
                if (newEmail.trim() === "") {
                  // 빈 필드: 에러 초기화
                  setErrors((prev) => ({ ...prev, email: undefined }));
                } else {
                  // 이메일 형식 검증
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(newEmail)) {
                    // 형식 오류: 실시간으로 에러 메시지 표시
                    setErrors((prev) => ({
                      ...prev,
                      email: "올바른 이메일 형식을 입력해주세요.",
                    }));
                  } else {
                    // 형식이 유효한 경우: 중복 체크 수행
                    // TODO: 실제 API 호출 (debounce 적용 권장)
                    // const checkEmailDuplicate = async () => {
                    //   const response = await checkPartnerEmailDuplicate(newEmail);
                    //   if (response.isDuplicate) {
                    //     setErrors((prev) => ({
                    //       ...prev,
                    //       email: "이미 사용 중인 아이디입니다.",
                    //     }));
                    //   }
                    // };
                    // checkEmailDuplicate();

                    // 테스트용: 파트너 계정 데이터에서 이메일 중복 체크
                    // 실제 구현 시 API 호출로 교체 필요
                    const partnerAccounts = getAccountsByType("partner");
                    const isDuplicate = partnerAccounts.some(
                      (account) => account.email === newEmail
                    );
                    if (isDuplicate) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "이미 사용 중인 아이디입니다.",
                      }));
                    } else {
                      // 중복이 없으면 에러 초기화
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }
                }
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            {/* 이메일 에러 메시지 표시 */}
            <ErrorText message={errors.email} />
          </div>

          {/* 비밀번호 입력 */}
          <PasswordField
            type="password"
            value={password}
            error={errors.password}
            onValueChange={(value) => {
              setPassword(value);
              // 비밀번호가 변경되면 비밀번호 확인도 재검증
              if (passwordConfirm) {
                if (passwordConfirm !== value) {
                  setErrors((prev) => ({
                    ...prev,
                    passwordConfirm: "비밀번호가 일치하지 않습니다.",
                  }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    passwordConfirm: undefined,
                  }));
                }
              }
            }}
            onErrorChange={(error) => {
              setErrors((prev) => ({ ...prev, password: error }));
            }}
          />

          {/* 비밀번호 확인 입력 */}
          <PasswordField
            type="confirm"
            value={passwordConfirm}
            password={password}
            error={errors.passwordConfirm}
            onValueChange={(value) => {
              setPasswordConfirm(value);
            }}
            onErrorChange={(error) => {
              setErrors((prev) => ({
                ...prev,
                passwordConfirm: error,
              }));
            }}
          />

          {/* 이름 입력 */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              className={commonStyles.input_field}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={errors.name} />
          </div>

          {/* 휴대폰 번호 입력 및 인증 */}
          <PhoneVerification
            phone={phone}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            isPhoneVerified={isPhoneVerified}
            timer={timer}
            error={
              phoneError ||
              (errors.phone && errors.phone !== "이미 가입된 휴대폰 번호입니다."
                ? errors.phone
                : undefined)
            }
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
          {/* 휴대폰 번호 중복 에러 메시지 표시 (인증 완료 후) */}
          {errors.phone === "이미 가입된 휴대폰 번호입니다." && (
            <ErrorText message={errors.phone} />
          )}

          {/* 상호명 입력 */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="company-name">
              상호명
            </label>
            <input
              id="company-name"
              type="text"
              className={commonStyles.input_field}
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, companyName: undefined }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={errors.companyName} />
          </div>

          {/* 대표자명 입력 */}
          <div className={commonStyles.form_field}>
            <label
              className={commonStyles.field_label}
              htmlFor="representative-name"
            >
              대표자명
            </label>
            <input
              id="representative-name"
              type="text"
              className={commonStyles.input_field}
              value={representativeName}
              onChange={(e) => {
                setRepresentativeName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  representativeName: undefined,
                }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={errors.representativeName} />
          </div>

          {/* 사업자등록번호 입력 */}
          <div className={commonStyles.form_field}>
            <label
              className={commonStyles.field_label}
              htmlFor="business-number"
            >
              사업자등록번호
            </label>
            <input
              id="business-number"
              type="text"
              className={commonStyles.input_field}
              placeholder="- 제외 입력"
              value={businessNumber}
              onChange={handleBusinessNumberChange}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={errors.businessNumber} />
          </div>

          {/* 사업자등록증 업로드 */}
          <BusinessDocumentUpload
            fileName={businessRegistrationFileName}
            onFileSelect={handleBusinessRegistrationFileSelect}
            customStyles={styles}
          />
          <ErrorText message={errors.businessRegistration} />

          {/* 주소 입력 */}
          <AddressInput
            postalCode={postalCode}
            address={address}
            detailAddress={detailAddress}
            postalCodeError={errors.postalCode}
            addressError={errors.address}
            detailAddressError={errors.detailAddress}
            onPostalCodeChange={(value) => {
              setPostalCode(value);
              setErrors((prev) => ({ ...prev, postalCode: undefined }));
            }}
            onAddressChange={(value) => {
              setAddress(value);
              setErrors((prev) => ({ ...prev, address: undefined }));
            }}
            onDetailAddressChange={(value) => {
              setDetailAddress(value);
              setErrors((prev) => ({ ...prev, detailAddress: undefined }));
            }}
            onPostalCodeSearch={handlePostalCodeSearch}
          />

          {/* 문의 담당자 휴대폰 번호 입력 */}
          <div className={commonStyles.form_field}>
            <label className={commonStyles.field_label} htmlFor="contact-phone">
              문의 담당자 휴대폰 번호
            </label>
            <input
              id="contact-phone"
              type="tel"
              className={commonStyles.input_field}
              placeholder="- 제외 입력"
              value={contactPhone}
              onChange={(e) => {
                // 휴대폰 번호 포맷팅 유틸리티 사용
                const formatted = formatPhoneNumber(e.target.value);
                setContactPhone(formatted);

                // 실시간 휴대폰 번호 형식 검증
                if (formatted.trim() === "") {
                  // 빈 필드: 에러 초기화
                  setErrors((prev) => ({ ...prev, contactPhone: undefined }));
                } else {
                  // 휴대폰 번호 형식 검증 (010-1234-5678 형식)
                  const phoneRegex = /^010-\d{4}-\d{4}$/;
                  if (!phoneRegex.test(formatted)) {
                    // 형식 오류: 실시간으로 에러 메시지 표시
                    setErrors((prev) => ({
                      ...prev,
                      contactPhone: "올바른 휴대폰 번호 형식을 입력해주세요.",
                    }));
                  } else {
                    // 형식이 유효한 경우: 에러 초기화
                    setErrors((prev) => ({
                      ...prev,
                      contactPhone: undefined,
                    }));
                  }
                }
              }}
              maxLength={13}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={errors.contactPhone} />
          </div>

          {/* 약관 동의 섹션 */}
          <PartnerTermsAgreement
            allAgreed={allAgreed}
            serviceTermsAgreed={serviceTermsAgreed}
            privacyAgreed={privacyAgreed}
            thirdPartyAgreed={thirdPartyAgreed}
            advertisingAgreed={advertisingAgreed}
            marketingAgreed={marketingAgreed}
            thirdPartyMarketingAgreed={thirdPartyMarketingAgreed}
            error={errors.terms}
            onAllAgreedChange={handleAllAgreedChange}
            onServiceTermsAgreedChange={setServiceTermsAgreed}
            onPrivacyAgreedChange={setPrivacyAgreed}
            onThirdPartyAgreedChange={setThirdPartyAgreed}
            onAdvertisingAgreedChange={setAdvertisingAgreed}
            onMarketingAgreedChange={setMarketingAgreed}
            onThirdPartyMarketingAgreedChange={setThirdPartyMarketingAgreed}
          />

          {/* 회원가입 제출 버튼 */}
          <button
            type="submit"
            className={`${commonStyles.submit_button} ${styles.submit_button} ${
              email.trim() &&
              password.trim() &&
              passwordConfirm.trim() &&
              name.trim() &&
              isPhoneVerified &&
              companyName.trim() &&
              representativeName.trim() &&
              businessNumber.trim() &&
              businessRegistrationFile &&
              postalCode.trim() &&
              address.trim() &&
              detailAddress.trim() &&
              contactPhone.trim() &&
              serviceTermsAgreed &&
              privacyAgreed &&
              thirdPartyAgreed &&
              advertisingAgreed &&
              !Object.keys(errors).some(
                (key) => errors[key as keyof typeof errors] !== undefined
              )
                ? ""
                : commonStyles.submit_button_disabled
            }`}
            disabled={
              !email.trim() ||
              !password.trim() ||
              !passwordConfirm.trim() ||
              !name.trim() ||
              !isPhoneVerified ||
              !companyName.trim() ||
              !representativeName.trim() ||
              !businessNumber.trim() ||
              !businessRegistrationFile ||
              !postalCode.trim() ||
              !address.trim() ||
              !detailAddress.trim() ||
              !contactPhone.trim() ||
              !serviceTermsAgreed ||
              !privacyAgreed ||
              !thirdPartyAgreed ||
              !advertisingAgreed ||
              Object.keys(errors).some(
                (key) => errors[key as keyof typeof errors] !== undefined
              )
            }
          >
            회원가입
          </button>
        </form>
      </main>
    </div>
  );
}
