/**
 * 휴대폰 번호 인증 입력 컴포넌트
 *
 * 휴대폰 번호를 입력하고 인증번호를 받을 수 있는 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import Image from "next/image";
import FormField from "./FormField";
import InputWithButton from "./InputWithButton";
import styles from "@/styles/user/mypage/edit_profile.module.css";

interface PhoneVerificationInputProps {
  /** 현재 휴대폰 번호 */
  phone: string;
  /** 휴대폰 번호 변경 핸들러 */
  onPhoneChange: (phone: string) => void;
  /** 인증 완료 여부 */
  isVerified: boolean;
  /** 인증번호 요청 핸들러 */
  onVerificationRequest: () => void;
}

/** 휴대폰 번호 포맷팅 - 숫자만 입력받고 자동으로 하이픈(-) 추가 */
const formatPhoneNumber = (value: string): string => {
  const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 11);
  if (numbersOnly.length === 0) return "";

  let formatted = numbersOnly.slice(0, 3);
  if (numbersOnly.length >= 4) {
    formatted += "-" + numbersOnly.slice(3, 7);
    if (numbersOnly.length >= 8) {
      formatted += "-" + numbersOnly.slice(7, 11);
    }
  }
  return formatted;
};

export default function PhoneVerificationInput({
  phone,
  onPhoneChange,
  isVerified,
  onVerificationRequest,
}: PhoneVerificationInputProps) {
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onPhoneChange(formatted);
  };

  return (
    <FormField label="휴대폰 번호" htmlFor="phone" required>
      <InputWithButton
        input={
          <div className={styles.phone_input_container}>
            <input
              id="phone"
              name="phone"
              className={styles.input_field}
              value={phone}
              onChange={handlePhoneInputChange}
              placeholder="010-0000-0000"
            />
            {isVerified && (
              <div className={styles.phone_check_icon}>
                <Image
                  src="/images/icons/phone_verified.svg"
                  alt="인증 완료"
                  width={16}
                  height={16}
                />
              </div>
            )}
          </div>
        }
        button={
          <button
            type="button"
            className={styles.verification_button}
            onClick={onVerificationRequest}
          >
            인증번호 받기
          </button>
        }
      />
    </FormField>
  );
}
