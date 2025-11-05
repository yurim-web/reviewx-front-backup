/* ========================================
   🏠 주소 입력 컴포넌트 (공용)
   ======================================== */

/**
 * 주소 입력 컴포넌트 (공용)
 *
 * 목적: 우편번호, 기본 주소, 상세 주소를 입력할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 우편번호 입력 (읽기 전용 또는 편집 가능)
 * - 기본 주소 입력
 * - 상세 주소 입력
 * - 우편번호 찾기 버튼 (선택적)
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import styles from "@/styles/user/mypage/edit_profile.module.css";

interface AddressInputProps {
  /** 우편번호 */
  postalCode: string;
  /** 기본 주소 */
  address: string;
  /** 상세 주소 */
  detailAddress: string;
  /** 우편번호 변경 핸들러 */
  onPostalCodeChange: (value: string) => void;
  /** 기본 주소 변경 핸들러 */
  onAddressChange: (value: string) => void;
  /** 상세 주소 변경 핸들러 */
  onDetailAddressChange: (value: string) => void;
  /** 우편번호 찾기 핸들러 (선택적) */
  onPostalCodeSearch?: () => void;
  /** 우편번호 읽기 전용 여부 (기본값: false) */
  postalCodeReadOnly?: boolean;
  /** 라벨에 필수 표시(*) 여부 (기본값: false) */
  showRequiredAsterisk?: boolean;
}

/**
 * 주소 입력 컴포넌트 (공용)
 */
export default function AddressInput({
  postalCode,
  address,
  detailAddress,
  onPostalCodeChange,
  onAddressChange,
  onDetailAddressChange,
  onPostalCodeSearch,
  postalCodeReadOnly = false,
  showRequiredAsterisk = false,
}: AddressInputProps) {
  return (
    <article className={styles.field_article}>
      <label className={styles.field_label} htmlFor="postalCode">
        주소{showRequiredAsterisk && <span className={styles.required_asterisk}>*</span>}
      </label>

      {/* 우편번호 */}
      <div className={styles.input_with_button}>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          className={styles.input_field}
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          readOnly={postalCodeReadOnly}
          placeholder="우편번호"
        />
        {/* 우편번호 찾기 버튼이 있으면 표시 */}
        {onPostalCodeSearch && (
          <button
            className={styles.postal_button}
            onClick={onPostalCodeSearch}
          >
            우편번호 찾기
          </button>
        )}
      </div>

      {/* 기본 주소 */}
      <div className={styles.field_group}>
        <input
          type="text"
          id="address"
          name="address"
          className={styles.input_field}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="기본 주소"
        />
      </div>

      {/* 상세 주소 */}
      <div className={styles.field_group}>
        <input
          type="text"
          id="detailAddress"
          name="detailAddress"
          className={styles.input_field}
          value={detailAddress}
          onChange={(e) => onDetailAddressChange(e.target.value)}
          placeholder="상세 주소 입력"
        />
      </div>
    </article>
  );
}

