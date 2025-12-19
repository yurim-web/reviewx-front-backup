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
 * - src/app/find-account/page.tsx
 * - src/app/partner/find-account/page.tsx
 */

"use client";

import Image from "next/image";
import { formatPhoneNumber } from "@/utils/signup/phoneUtils";
import { formatTimer } from "@/utils/signup/timerUtils";
import styles from "@/styles/user/signup/signup.module.css";

interface PhoneVerificationProps {
  phone: string;
  verificationCode: string;
  isVerificationRequested: boolean;
  isPhoneVerified: boolean;
  timer: number;
  error?: string;
  verificationCodeError?: string;
  accountNotFoundError?: string; // 계정 없음 에러 (input 테두리 변경 없이 메시지만 표시)
  onPhoneChange: (phone: string) => void;
  onVerificationRequest: () => void;
  onResend?: () => void;
  onVerify: () => void;
  onVerificationCodeChange: (code: string) => void;
}

/**
 * 휴대폰 인증 컴포넌트
 */
export default function PhoneVerification({
  phone,
  verificationCode,
  isVerificationRequested,
  isPhoneVerified,
  timer,
  error,
  verificationCodeError,
  accountNotFoundError,
  onPhoneChange,
  onVerificationRequest,
  onResend,
  onVerify,
  onVerificationCodeChange,
}: PhoneVerificationProps) {
  /** 휴대폰 번호 입력 핸들러 - 자동 포맷팅 후 부모에 전달 */
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onPhoneChange(formatted);
  };

  /** 인증번호 입력 핸들러 - 숫자만 입력, 최대 6자리 */
  const handleVerificationCodeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    onVerificationCodeChange(value);
  };

  /** 에러 메시지 공통 렌더링 */
  const renderErrorMessage = (errorMessage?: string) => {
    if (!errorMessage) return null;
    return (
      <div className={styles.error_message}>
        <span className={styles.error_text}>{errorMessage}</span>
      </div>
    );
  };

  /** 휴대폰 번호 에러 텍스트 매핑
   *
   * - MAX_VERIFICATION_REQUEST_EXCEEDED 는
   *   인증번호 영역에서만 보여줘야 하므로 여기서는 숨김
   */
  const phoneErrorText =
    error === "MAX_VERIFICATION_REQUEST_EXCEEDED" ? undefined : error;

  /** 인증번호 에러 텍스트 매핑 */
  const verificationCodeErrorText = verificationCodeError
    ? verificationCodeError === "인증번호 6자리를 입력해주세요."
      ? "인증번호 6자리를 입력해주세요."
      : "인증번호가 일치하지 않습니다."
    : undefined;

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
              error !== undefined ? styles.input_error : ""
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
            onClick={onResend || onVerificationRequest}
          >
            재전송
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.verification_button} ${
              isPhoneVerified ? styles.verification_button_completed : ""
            }`}
            onClick={onVerificationRequest}
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
        <div className={styles.error_message}>
          <span className={styles.error_text}>{accountNotFoundError}</span>
        </div>
      )}

      {/* 인증번호 입력 필드 */}
      {isVerificationRequested && !isPhoneVerified && (
        <div className={styles.verification_code_section}>
          <div className={styles.verification_code_wrapper}>
            <div className={styles.verification_code_input_wrapper}>
              <input
                type="text"
                className={`${styles.input_field} ${
                  styles.verification_code_input
                } ${
                  verificationCodeError !== undefined ? styles.input_error : ""
                }`}
                placeholder="인증번호 6자리 입력"
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
              onClick={onVerify}
            >
              인증
            </button>
          </div>
          {/* 인증번호 에러 (길이 부족 / 일치하지 않음 등) */}
          {renderErrorMessage(verificationCodeErrorText)}
          {/* 인증번호 5회 초과 에러 */}
          {error === "MAX_VERIFICATION_REQUEST_EXCEEDED" && (
            <div className={styles.error_message}>
              <span className={styles.error_text}>
                인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해
                주세요.
              </span>
            </div>
          )}
          {timer <= 0 && !isPhoneVerified && (
            <div className={styles.error_message}>
              <span className={styles.error_text}>
                인증번호 입력 시간을 초과했습니다.
              </span>
            </div>
          )}
          <div className={styles.verification_help_text}>
            인증번호를 받지 못하셨나요?
          </div>
        </div>
      )}
    </div>
  );
}
