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
 * 주요 기능:
 * - 아이디(이메일) 입력
 * - 비밀번호 입력 및 확인
 * - 이름 입력
 * - 휴대폰 번호 인증
 * - 상호명, 대표자명, 사업자등록번호 입력
 * - 사업자등록증 파일 업로드
 * - 주소 입력 (우편번호 찾기)
 * - 약관 동의
 * - 회원가입
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/fragments/Header';
import PhoneVerification from '@/components/user/signup/PhoneVerification';
import PartnerTermsAgreement from '@/components/partner/signup/PartnerTermsAgreement';
import BusinessRegistrationUpload from '@/components/partner/signup/BusinessRegistrationUpload';
import AddressInput from '@/components/partner/signup/AddressInput';
import FileUploadAlert from '@/components/partner/signup/FileUploadAlert';
import PasswordInput from '@/components/user/signup/PasswordInput';
import PasswordConfirmInput from '@/components/user/signup/PasswordConfirmInput';
import { usePartnerTermsAgreement } from '@/components/partner/signup/hooks/usePartnerTermsAgreement';
import { usePhoneVerification } from '@/components/user/signup/hooks/usePhoneVerification';
import {
  validatePartnerSignupForm,
  type PartnerSignupFormErrors,
} from '@/components/partner/signup/utils/formValidation';
import { formatBusinessNumber } from '@/components/partner/signup/utils/businessNumberUtils';
import styles from '@/styles/partner/signup/signup.module.css';

/**
 * 파트너 회원가입 페이지 컴포넌트
 *
 * @returns JSX.Element - 파트너 회원가입 페이지 UI
 */
export default function PartnerSignupPage() {
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  // 폼 데이터
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [representativeName, setRepresentativeName] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [businessRegistrationFile, setBusinessRegistrationFile] =
    useState<File | null>(null);
  const [businessRegistrationFileName, setBusinessRegistrationFileName] =
    useState<string | null>(null);
  const [postalCode, setPostalCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>('');

  // 에러 메시지
  const [errors, setErrors] = useState<PartnerSignupFormErrors>({});

  // 파일 업로드 얼럿
  const [fileUploadAlert, setFileUploadAlert] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

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
    setPhone,
    setVerificationCode,
    handleVerificationRequest,
    handleVerify,
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
    setPhone(newPhone);

    if (newPhone === '' || isPhoneVerified || isVerificationRequested) {
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
  const handleVerificationRequestClick = () => {
    const error = handleVerificationRequest();
    if (error) {
      setErrors((prev) => ({ ...prev, phone: error }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  /**
   * ========================================
   * 인증 확인 핸들러
   * ========================================
   */
  const handleVerifyClick = () => {
    const error = handleVerify();
    if (error) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: error,
      }));
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: undefined }));
    }
  };

  /**
   * ========================================
   * 사업자등록번호 변경 핸들러
   * ========================================
   */
  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
   * 파일 업로드 에러 핸들러
   * ========================================
   */
  const handleFileUploadError = (error: string) => {
    // 빈 문자열이 아닐 때만 모달 표시
    if (error && error.trim().length > 0) {
      setFileUploadAlert({ show: true, message: error });
    } else {
      // 에러가 없으면 모달 닫기
      setFileUploadAlert({ show: false, message: '' });
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
    alert('우편번호 찾기 기능은 준비 중입니다.');
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
      serviceTermsAgreed,
      privacyAgreed,
      thirdPartyAgreed,
      advertisingAgreed,
    });

    setErrors(newErrors);

    // 에러가 있으면 제출 중단 (빈 문자열도 에러로 간주)
    const hasErrors = Object.keys(newErrors).some(
      (key) => newErrors[key as keyof typeof newErrors] !== undefined,
    );
    if (hasErrors) {
      return;
    }

    // 회원가입 처리
    console.log('파트너 회원가입 시도:', {
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
      <Header />

      {/* 서브 헤더 */}
      <div className={styles.sub_header}>
        <h1 className={styles.sub_header_title}>파트너 회원가입</h1>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.signup_main}>
        {/* 로고 섹션 */}
        <div className={styles.logo_section}>
          <h2 className={styles.logo_text}>VX.</h2>
        </div>

        {/* 회원가입 폼 */}
        <form className={styles.signup_form} onSubmit={handleSubmit}>
          {/* 아이디(이메일) 입력 */}
          <div className={styles.form_field}>
            <label className={styles.field_label} htmlFor="email">
              아이디(이메일)
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input_field} ${
                errors.email !== undefined ? styles.input_error : ''
              }`}
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
          </div>

          {/* 비밀번호 입력 */}
          <PasswordInput
            value={password}
            error={errors.password}
            onValueChange={(value) => {
              setPassword(value);
            }}
            onErrorChange={(error) => {
              setErrors((prev) => ({ ...prev, password: error }));
            }}
            onPasswordConfirmValidate={(newPassword) => {
              if (passwordConfirm && passwordConfirm !== newPassword) {
                setErrors((prev) => ({
                  ...prev,
                  passwordConfirm: '비밀번호가 일치하지 않습니다.',
                }));
              } else if (passwordConfirm && passwordConfirm === newPassword) {
                setErrors((prev) => ({
                  ...prev,
                  passwordConfirm: undefined,
                }));
              }
            }}
            passwordConfirm={passwordConfirm}
          />

          {/* 비밀번호 확인 입력 */}
          <PasswordConfirmInput
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
          <div className={styles.form_field}>
            <label className={styles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.input_field} ${
                errors.name !== undefined ? styles.input_error : ''
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

          {/* 휴대폰 번호 입력 및 인증 */}
          <PhoneVerification
            phone={phone}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            isPhoneVerified={isPhoneVerified}
            timer={timer}
            error={errors.phone}
            verificationCodeError={errors.verificationCode}
            onPhoneChange={handlePhoneChange}
            onVerificationRequest={handleVerificationRequestClick}
            onResend={handleVerificationRequestClick}
            onVerify={handleVerifyClick}
            onVerificationCodeChange={(code) => {
              setVerificationCode(code);
              setErrors((prev) => ({
                ...prev,
                verificationCode: undefined,
              }));
            }}
          />

          {/* 상호명 입력 */}
          <div className={styles.form_field}>
            <label className={styles.field_label} htmlFor="company-name">
              상호명
            </label>
            <input
              id="company-name"
              type="text"
              className={`${styles.input_field} ${
                errors.companyName !== undefined ? styles.input_error : ''
              }`}
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, companyName: undefined }));
              }}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
          </div>

          {/* 대표자명 입력 */}
          <div className={styles.form_field}>
            <label className={styles.field_label} htmlFor="representative-name">
              대표자명
            </label>
            <input
              id="representative-name"
              type="text"
              className={`${styles.input_field} ${
                errors.representativeName !== undefined
                  ? styles.input_error
                  : ''
              }`}
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
          </div>

          {/* 사업자등록번호 입력 */}
          <div className={styles.form_field}>
            <label className={styles.field_label} htmlFor="business-number">
              사업자등록번호
            </label>
            <input
              id="business-number"
              type="text"
              className={`${styles.input_field} ${
                errors.businessNumber !== undefined ? styles.input_error : ''
              }`}
              placeholder="- 제외 입력"
              value={businessNumber}
              onChange={handleBusinessNumberChange}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
          </div>

          {/* 사업자등록증 업로드 */}
          <BusinessRegistrationUpload
            fileName={businessRegistrationFileName}
            error={errors.businessRegistration}
            onFileSelect={handleBusinessRegistrationFileSelect}
            onError={handleFileUploadError}
          />

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
          <button type="submit" className={styles.submit_button}>
            회원가입
          </button>
        </form>
      </main>

      {/* 파일 업로드 얼럿 모달 */}
      {fileUploadAlert.show && (
        <FileUploadAlert
          message={fileUploadAlert.message}
          onClose={() => setFileUploadAlert({ show: false, message: '' })}
        />
      )}
    </div>
  );
}
