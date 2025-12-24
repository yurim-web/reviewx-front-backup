/**
 * 폼 필드 래퍼 컴포넌트
 *
 * field_article + label + required asterisk 패턴을 재사용하는 컴포넌트입니다.
 *
 * 사용처:
 * - src/components/common/mypage/AddressInput.tsx
 * - src/components/common/mypage/ProfilePhotoUpload.tsx
 * - src/components/common/phone_verification/PhoneVerification.tsx (마이페이지 스타일)
 */

"use client";

import styles from "@/styles/user/mypage/edit_profile.module.css";

interface FormFieldProps {
  /** 라벨 텍스트 */
  label: string;
  /** 라벨 htmlFor 속성 */
  htmlFor?: string;
  /** 필수 표시(*) 여부 */
  required?: boolean;
  /** 자식 요소 */
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <article className={styles.field_article}>
      <label className={styles.field_label} htmlFor={htmlFor}>
        {label}
        {required && <span className={styles.required_asterisk}>*</span>}
      </label>
      {children}
    </article>
  );
}
