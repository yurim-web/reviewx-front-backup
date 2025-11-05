/* ========================================
   📱 휴대폰 번호 인증 입력 컴포넌트
   ======================================== */

/**
 * 휴대폰 번호 인증 입력 컴포넌트
 *
 * 목적: 휴대폰 번호를 입력하고 인증번호를 받을 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 휴대폰 번호 입력 (자동 하이픈 포맷팅)
 * - 인증번호 요청 버튼
 * - 인증 완료 상태 표시
 * - 휴대폰 번호 유효성 검사
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import Image from "next/image";
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

/**
 * 휴대폰 번호 인증 입력 컴포넌트
 */
export default function PhoneVerificationInput({
  phone,
  onPhoneChange,
  isVerified,
  onVerificationRequest,
}: PhoneVerificationInputProps) {
  /**
   * 휴대폰 번호 입력 핸들러
   * 숫자만 입력받고 자동으로 하이픈(-) 추가
   */
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    let formatted = "";
    if (numbersOnly.length >= 1) {
      formatted = numbersOnly.slice(0, 3);
      if (numbersOnly.length >= 4) {
        formatted += "-" + numbersOnly.slice(3, 7);
        if (numbersOnly.length >= 8) {
          formatted += "-" + numbersOnly.slice(7, 11);
        }
      }
    }
    onPhoneChange(formatted);
  };

  return (
    <article className={styles.field_article}>
      <label className={styles.field_label} htmlFor="phone">
        휴대폰 번호<span className={styles.required_asterisk}>*</span>
      </label>
      <div className={styles.input_with_button}>
        <div className={styles.phone_input_container}>
          <input
            id="phone"
            name="phone"
            className={styles.input_field}
            value={phone}
            onChange={handlePhoneInputChange}
            placeholder="010-0000-0000"
          />
          {/* 인증 완료 시 체크 아이콘 표시 */}
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
        <button
          className={styles.verification_button}
          onClick={onVerificationRequest}
        >
          인증번호 받기
        </button>
      </div>
    </article>
  );
}

