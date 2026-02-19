/* ========================================
   📱 휴대폰 인증 컴포넌트 (공통)
   ======================================== */

/**
 * 휴대폰 인증 컴포넌트
 *
 * 휴대폰 번호 입력 및 SMS 인증 UI, 인증번호 받기, 인증번호 입력, 타이머 표시
 *
 * 사용 페이지:
 * - src/app/user/signup/page.tsx
 * - src/app/partner/signup/page.tsx
 * - src/app/user/find-account/page.tsx
 * - src/app/user/mypage/edit/page.tsx
 * - src/app/partner/mypage/edit/page.tsx
 * - src/components/common/find_account/page/FindAccountPage.tsx
 *   (공용 컴포넌트로 /find-account와 /partner/find-account에서 사용)
 *
 * ================================================================================================
 * 📋 에러 메시지 표시 경우의 수 정리 (Error Message Display Cases)
 * ================================================================================================
 *
 * 이 컴포넌트에서 표시되는 에러 메시지는 총 4가지 영역에 나뉩니다:
 *
 * 1️⃣ 휴대폰 번호 입력 필드 아래 (phoneErrorText)
 *    - 표시 조건: error prop이 전달되고 "MAX_VERIFICATION_REQUEST_EXCEEDED"가 아닐 때
 *    - 에러 종류:
 *      ✅ "올바른 휴대폰 번호 형식을 입력해주세요."
 *         → 발생 시점: "인증번호 받기" 버튼 클릭 시 휴대폰 번호 형식 검증 실패
 *         → 표시 위치: 휴대폰 번호 입력 필드 바로 아래
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 * 2️⃣ 휴대폰 번호 입력 필드 아래 (accountNotFoundError)
 *    - 표시 조건: accountNotFoundError prop이 전달될 때
 *    - 에러 종류:
 *      ✅ "입력하신 정보와 일치하는 계정을 찾을 수 없습니다."
 *         → 발생 시점: 계정 찾기 페이지에서 "다음" 버튼 클릭 후 계정을 찾지 못했을 때
 *         → 표시 위치: 휴대폰 번호 입력 필드 아래 (phoneErrorText 아래)
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 * 2️⃣-2 휴대폰 번호 입력 필드 아래 (blockedAccountError)
 *    - 표시 조건: blockedAccountError prop이 전달될 때
 *    - 에러 종류:
 *      ✅ "정지되었거나 탈퇴된 계정입니다."
 *         → 발생 시점: 계정 찾기 페이지에서 "다음" 버튼 클릭 후 정지/탈퇴된 계정을 찾았을 때
 *         → 표시 위치: 휴대폰 번호 입력 필드 아래 (accountNotFoundError 아래)
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 * 3️⃣ 인증번호 입력 필드 아래 (verificationCodeErrorText)
 *    - 표시 조건: verificationCodeError prop이 전달될 때
 *    - 에러 종류:
 *      ✅ "인증번호 6자리를 입력해 주세요."
 *         → 발생 시점: "인증" 버튼 클릭 시 인증번호가 비어있거나 6자리가 아닐 때
 *         → 표시 위치: 인증번호 입력 필드 바로 아래
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 *      ✅ "인증번호가 일치하지 않습니다."
 *         → 발생 시점: "인증" 버튼 클릭 시 입력한 인증번호가 서버 인증번호와 불일치할 때
 *         → 표시 위치: 인증번호 입력 필드 바로 아래
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 *      ✅ "인증번호 입력 시간을 초과했습니다."
 *         → 발생 시점: 타이머가 0이 되고 인증이 완료되지 않았을 때 (자동 설정)
 *         → 표시 위치: 인증번호 입력 필드 바로 아래
 *         → 특징: input 테두리 색상 변경 없이 메시지만 표시
 *
 * 4️⃣ 인증번호 입력 영역 (MAX_VERIFICATION_REQUEST_EXCEEDED)
 *    - 표시 조건: error prop이 "MAX_VERIFICATION_REQUEST_EXCEEDED"일 때
 *    - 에러 종류:
 *      ✅ "인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요."
 *         → 발생 시점: "인증번호 받기" 또는 "재전송" 버튼 클릭 시 요청 횟수가 5회 초과했을 때
 *         → 표시 위치: 인증번호 입력 영역 내부 (verificationCodeErrorText 아래)
 *         → 특징: 휴대폰 번호 입력 필드 아래에는 표시되지 않음
 *
 * ⚠️ 주의사항:
 *    - 모든 에러 메시지는 사용자가 입력 필드를 변경하면 자동으로 사라집니다.
 *    - 모든 에러 메시지는 input 테두리 색상 변경 없이 메시지만 표시됩니다.
 *    - 휴대폰 번호 및 인증번호 검증은 이 컴포넌트 내부에서 수행되며, 에러 메시지도 내부에서 관리됩니다.
 *    - 외부에서 전달되는 error, verificationCodeError props는 하위 호환성을 위해 유지되지만, 내부 에러가 우선적으로 표시됩니다.
 *    - accountNotFoundError와 blockedAccountError는 useFindAccount 훅에서 관리됩니다.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPhoneNumber } from "@/utils/formatting/phone";
import { formatTimer } from "@/utils/formatting/date";
import { validatePhone, validateVerificationCode } from "@/utils/validation";
import signupStyles from "@/styles/common/signup/signup.module.css";
import inputsStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import FormField from "@/components/common/mypage/FormField";
import InputWithButton from "@/components/common/mypage/InputWithButton";
import ErrorText from "@/components/common/error_text/ErrorText";
import VerificationHelpModal from "@/components/common/phone_verification/VerificationHelpModal";

interface PhoneVerificationProps {
  phone: string;
  verificationCode?: string; // 마이페이지에서는 선택적
  isVerificationRequested?: boolean; // 마이페이지에서는 선택적
  isPhoneVerified: boolean;
  timer?: number; // 마이페이지에서는 선택적
  error?: string; // 외부에서 전달되는 에러 (하위 호환성 유지)
  verificationCodeError?: string; // 외부에서 전달되는 에러 (하위 호환성 유지)
  accountNotFoundError?: string; // 계정 없음 에러 (input 테두리 변경 없이 메시지만 표시)
  blockedAccountError?: string; // 정지/탈퇴 계정 에러 (input 테두리 변경 없이 메시지만 표시)
  onPhoneChange: (phone: string) => void;
  onVerificationRequest: () => void | Promise<void>;
  onResend?: () => void;
  onVerify?: () => void; // 마이페이지에서는 선택적
  onVerificationCodeChange?: (code: string) => void; // 마이페이지에서는 선택적
  /** 마이페이지 스타일 사용 여부 (기본값: false) */
  useMyPageStyle?: boolean;
  /** 인증번호 입력 필드 표시 여부 (기본값: true) */
  showVerificationCode?: boolean;
  /**
   * 인증 완료 배지 표시 여부 (마이페이지 전용)
   * - true: 인증 완료 시 "인증 완료" 버튼 표시 (인증 직후에만)
   * - false: 인증된 상태에서도 "인증번호 받기" 버튼 표시 (재인증 가능)
   */
  showVerifiedBadge?: boolean;
}

/**
 * 휴대폰 인증 컴포넌트
 */
export default function PhoneVerification({
  phone,
  verificationCode = "",
  isVerificationRequested = false,
  isPhoneVerified,
  timer = 0,
  error,
  verificationCodeError,
  accountNotFoundError,
  blockedAccountError,
  onPhoneChange,
  onVerificationRequest,
  onResend,
  onVerify,
  onVerificationCodeChange,
  useMyPageStyle = false,
  showVerificationCode = true,
  showVerifiedBadge = false,
}: PhoneVerificationProps) {
  // 스타일 선택: mypage인 경우 분리된 CSS 모듈들을 조합, 아니면 signupStyles 사용
  const styles = useMyPageStyle
    ? {
        // inputs.module.css에서 가져온 클래스
        field_label: inputsStyles.field_label,
        input_field: inputsStyles.input_field,
        // verification.module.css에서 가져온 클래스
        verification_button: verificationStyles.verification_button,
        verification_button_completed:
          verificationStyles.verification_button_completed,
        phone_verification_block_mypage:
          verificationStyles.phone_verification_block_mypage,
        verification_code_section_mypage:
          verificationStyles.verification_code_section_mypage,
        // signup.module.css에서 가져온 클래스 (분리된 파일에 없는 것들)
        error_message: signupStyles.error_message,
        form_field: signupStyles.form_field,
        phone_verification_wrapper: signupStyles.phone_verification_wrapper,
        phone_input_wrapper: signupStyles.phone_input_wrapper,
        phone_input: signupStyles.phone_input,
        phone_input_verified: signupStyles.phone_input_verified,
        verification_complete_icon: signupStyles.verification_complete_icon,
        resend_button: signupStyles.resend_button,
        verification_code_section: signupStyles.verification_code_section,
        verification_code_wrapper: signupStyles.verification_code_wrapper,
        verification_code_input_wrapper:
          signupStyles.verification_code_input_wrapper,
        verification_code_input: signupStyles.verification_code_input,
        timer_text: signupStyles.timer_text,
        verify_button: signupStyles.verify_button,
        verification_help_text: signupStyles.verification_help_text,
        input_error: signupStyles.input_error,
      }
    : signupStyles;

  // 컴포넌트 내부 에러 상태 관리
  const [internalPhoneError, setInternalPhoneError] = useState<
    string | undefined
  >(undefined);
  const [internalVerificationCodeError, setInternalVerificationCodeError] =
    useState<string | undefined>(undefined);
  /** 인증번호 도움말 모달 ("인증번호를 받지 못 하셨나요?" 클릭 시) */
  const [is_verification_help_modal_open, set_is_verification_help_modal_open] =
    useState(false);

  /** 휴대폰 번호 입력 핸들러 - 자동 포맷팅 후 부모에 전달 */
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    // 휴대폰 번호 변경 시 내부 에러 초기화
    setInternalPhoneError(undefined);
    onPhoneChange(formatted);
  };

  /** 인증번호 입력 핸들러 - 숫자만 입력, 최대 6자리 */
  const handleVerificationCodeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    // 인증번호 변경 시 내부 에러 초기화
    setInternalVerificationCodeError(undefined);
    onVerificationCodeChange?.(value);
  };

  /** 인증번호 요청 핸들러 - 내부에서 검증 수행 */
  const handleVerificationRequestInternal = async () => {
    // 휴대폰 번호 형식 검증
    if (!validatePhone(phone)) {
      setInternalPhoneError("올바른 휴대폰 번호 형식을 입력해주세요.");
      return;
    }

    // 검증 통과 시 내부 에러 초기화
    setInternalPhoneError(undefined);

    // 부모의 onVerificationRequest 호출
    await onVerificationRequest();
  };

  /** 인증번호 확인 핸들러 - 내부에서 검증 수행 */
  const handleVerifyInternal = () => {
    // 인증번호 형식 검증
    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setInternalVerificationCodeError("인증번호 6자리를 입력해 주세요.");
      return;
    }

    // 검증 통과 시 내부 에러 초기화
    setInternalVerificationCodeError(undefined);

    // 부모의 onVerify 호출
    onVerify?.();
  };

  /** 재전송 클릭 핸들러 - 인증번호 에러 초기화 후 재전송 */
  const handleResendClick = async () => {
    setInternalVerificationCodeError(undefined);
    if (onResend) {
      await onResend();
    } else {
      await handleVerificationRequestInternal();
    }
  };

  /** 에러 메시지 공통 렌더링 (헬프 메시지와 동일하게 div 단일 구조) */
  const renderErrorMessage = (errorMessage?: string) => {
    if (!errorMessage) return null;
    return <div className={styles.error_message}>{errorMessage}</div>;
  };

  /** 에러 메시지 매핑 함수 (공통)
   *
   * 기능: 에러 코드나 메시지를 UI에 표시할 메시지로 변환
   *
   * @param errorValue - 에러 값 (string | undefined)
   * @param errorType - 에러 타입 ("phone" | "verificationCode")
   * @returns UI에 표시할 에러 메시지 (string | undefined)
   */
  const mapErrorMessage = (
    errorValue: string | undefined,
    errorType: "phone" | "verificationCode",
  ): string | undefined => {
    if (!errorValue) return undefined;

    // 휴대폰 번호 에러 처리
    if (errorType === "phone") {
      // MAX_VERIFICATION_REQUEST_EXCEEDED는 인증번호 영역에서만 표시하므로 여기서는 숨김
      if (errorValue === "MAX_VERIFICATION_REQUEST_EXCEEDED") {
        return undefined;
      }
      return errorValue; // 그 외의 휴대폰 번호 에러는 그대로 반환
    }

    // 인증번호 에러 처리
    if (errorType === "verificationCode") {
      if (errorValue === "인증번호 6자리를 입력해 주세요.") {
        return "인증번호 6자리를 입력해 주세요.";
      }
      if (errorValue === "인증번호 입력 시간을 초과했습니다.") {
        return "인증번호 입력 시간을 초과했습니다.";
      }
      // 그 외의 인증번호 에러 (예: "인증번호가 일치하지 않습니다.")
      return "인증번호가 일치하지 않습니다.";
    }

    return undefined;
  };

  /** 휴대폰 번호 에러 텍스트 - 내부 에러 우선, 외부 에러는 하위 호환성 유지 */
  const phoneErrorText = mapErrorMessage(internalPhoneError || error, "phone");

  /** 인증번호 에러 텍스트 - 내부 에러 우선, 외부 에러는 하위 호환성 유지 */
  const verificationCodeErrorText = mapErrorMessage(
    internalVerificationCodeError || verificationCodeError,
    "verificationCode",
  );

  /** 휴대폰 번호 input 테두리 에러 스타일 적용 여부
   *
   * - 모든 에러 메시지에서 input 테두리 색상이 변경되지 않도록 항상 false
   * - accountNotFoundError와 동일하게 메시지만 표시하고 테두리는 변경하지 않음
   */
  const shouldShowPhoneInputError = false;

  // 마이페이지 스타일인 경우 FormField 사용, 내 정보 수정 페이지에서만 간격 12px
  if (useMyPageStyle) {
    return (
      <div className={styles.phone_verification_block_mypage}>
        <FormField
          label="휴대폰 번호"
          htmlFor="phone"
          required={!useMyPageStyle}
        >
          <div className={styles.phone_verification_wrapper}>
            <div className={styles.phone_input_wrapper}>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`${styles.input_field} ${styles.phone_input} ${
                  isPhoneVerified && phone.trim() !== ""
                    ? styles.phone_input_verified
                    : ""
                }`}
                value={phone}
                onChange={handlePhoneInputChange}
                placeholder="- 제외 입력"
                maxLength={13}
                onInvalid={(e) => {
                  e.preventDefault();
                }}
              />
              {isPhoneVerified && phone.trim() !== "" && (
                <div className={styles.verification_complete_icon}>
                  <Image
                    src="/images/icons/sign_ok.svg"
                    alt="인증 완료"
                    width={16}
                    height={16}
                  />
                </div>
              )}
            </div>
            {isVerificationRequested && !isPhoneVerified ? (
              <button
                type="button"
                className={styles.resend_button}
                onClick={handleResendClick}
              >
                재전송
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.verification_button} ${
                  isPhoneVerified && phone.trim() !== "" && showVerifiedBadge
                    ? styles.verification_button_completed
                    : ""
                }`}
                onClick={handleVerificationRequestInternal}
                disabled={
                  isPhoneVerified && phone.trim() !== "" && showVerifiedBadge
                }
              >
                {isPhoneVerified && phone.trim() !== "" && showVerifiedBadge
                  ? "인증 완료"
                  : "인증번호 받기"}
              </button>
            )}
          </div>
        </FormField>
        {/* 휴대폰 번호 에러 메시지 */}
        <ErrorText message={phoneErrorText} />
        {/* 인증번호 입력 필드 */}
        {showVerificationCode &&
          isVerificationRequested &&
          !isPhoneVerified && (
            <div
              className={`${styles.verification_code_section} ${styles.verification_code_section_mypage}`}
            >
              <div className={styles.verification_code_wrapper}>
                <div className={styles.verification_code_input_wrapper}>
                  <input
                    type="text"
                    className={`${styles.input_field} ${styles.verification_code_input}`}
                    placeholder="인증번호 입력"
                    value={verificationCode}
                    onChange={handleVerificationCodeInputChange}
                    maxLength={6}
                  />
                  {timer > 0 && (
                    <span className={styles.timer_text}>
                      {formatTimer(timer)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.verify_button}
                  onClick={handleVerifyInternal}
                >
                  인증
                </button>
              </div>
              {/* 인증번호 에러 (길이 부족 / 일치하지 않음 / 시간 초과 등) */}
              <ErrorText message={verificationCodeErrorText} />
              {/* 인증번호 5회 초과 에러 */}
              {error === "MAX_VERIFICATION_REQUEST_EXCEEDED" && (
                <ErrorText message="인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요." />
              )}
              {!verificationCodeErrorText && (
                <button
                  type="button"
                  className={styles.verification_help_text}
                  onClick={() => set_is_verification_help_modal_open(true)}
                >
                  인증번호를 받지 못 하셨나요?
                </button>
              )}
            </div>
          )}
        <VerificationHelpModal
          is_open={is_verification_help_modal_open}
          on_close={() => set_is_verification_help_modal_open(false)}
          on_resend={handleResendClick}
          on_change_phone={() => {
            onPhoneChange("");
            set_is_verification_help_modal_open(false);
          }}
        />
      </div>
    );
  }

  // 회원가입/계정찾기 스타일 (기존 코드)
  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="phone">
        휴대폰 번호
      </label>
      <div className={styles.phone_verification_wrapper}>
        <div className={styles.phone_input_wrapper}>
          <input
            id="phone"
            type="text"
            className={`${styles.input_field} ${styles.phone_input} ${
              shouldShowPhoneInputError ? styles.input_error : ""
            } ${isPhoneVerified ? styles.phone_input_verified : ""}`}
            placeholder="- 제외 입력"
            value={phone}
            onChange={handlePhoneInputChange}
            onInvalid={(e) => {
              e.preventDefault();
            }}
          />
          {isPhoneVerified && (
            <div className={styles.verification_complete_icon}>
              <Image
                src="/images/icons/sign_ok.svg"
                alt="인증 완료"
                width={16}
                height={16}
              />
            </div>
          )}
        </div>
        {isVerificationRequested && !isPhoneVerified ? (
          <button
            type="button"
            className={styles.resend_button}
            onClick={handleResendClick}
          >
            재전송
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.verification_button} ${
              isPhoneVerified ? styles.verification_button_completed : ""
            }`}
            onClick={handleVerificationRequestInternal}
            disabled={isPhoneVerified}
          >
            {isPhoneVerified ? "인증 완료" : "인증번호 받기"}
          </button>
        )}
      </div>

      {/* 휴대폰 번호 에러 메시지 */}
      {renderErrorMessage(phoneErrorText)}

      {/* 계정 없음 에러 메시지 (input 테두리 변경 없이 메시지만 표시) */}
      {/* 인증 완료 후에도 표시되어야 하므로 인증번호 입력 필드 밖에 위치 */}
      {accountNotFoundError && (
        <div className={styles.error_message}>{accountNotFoundError}</div>
      )}

      {/* 정지/탈퇴 계정 에러 메시지 (input 테두리 변경 없이 메시지만 표시) */}
      {/* 인증 완료 후에도 표시되어야 하므로 인증번호 입력 필드 밖에 위치 */}
      {blockedAccountError && (
        <div className={styles.error_message}>{blockedAccountError}</div>
      )}

      {/* 인증번호 입력 필드 */}
      {showVerificationCode && isVerificationRequested && !isPhoneVerified && (
        <div className={styles.verification_code_section}>
          <div className={styles.verification_code_wrapper}>
            <div className={styles.verification_code_input_wrapper}>
              <input
                type="text"
                className={`${styles.input_field} ${styles.verification_code_input}`}
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={handleVerificationCodeInputChange}
                maxLength={6}
              />
              {timer > 0 && (
                <span className={styles.timer_text}>{formatTimer(timer)}</span>
              )}
            </div>
            <button
              type="button"
              className={styles.verify_button}
              onClick={handleVerifyInternal}
            >
              인증
            </button>
          </div>
          {/* 인증번호 에러 (길이 부족 / 일치하지 않음 / 시간 초과 등) */}
          {renderErrorMessage(verificationCodeErrorText)}
          {/* 인증번호 5회 초과 에러 */}
          {error === "MAX_VERIFICATION_REQUEST_EXCEEDED" && (
            <div className={styles.error_message}>
              인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해
              주세요.
            </div>
          )}
          {!verificationCodeErrorText && (
            <button
              type="button"
              className={styles.verification_help_text}
              onClick={() => set_is_verification_help_modal_open(true)}
            >
              인증번호를 받지 못 하셨나요?
            </button>
          )}
        </div>
      )}
      <VerificationHelpModal
        is_open={is_verification_help_modal_open}
        on_close={() => set_is_verification_help_modal_open(false)}
        on_resend={handleResendClick}
        on_change_phone={() => {
          onPhoneChange("");
          set_is_verification_help_modal_open(false);
        }}
      />
    </div>
  );
}
