/* ========================================
   📍 주소 입력 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 우편번호 찾기 및 주소 입력 UI
 * - 우편번호, 기본 주소, 상세 주소 입력
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 주소 입력에 사용)
 */

'use client';

import styles from '@/styles/partner/signup/signup.module.css';

interface AddressInputProps {
  postalCode: string;
  address: string;
  detailAddress: string;
  postalCodeError?: string;
  addressError?: string;
  detailAddressError?: string;
  onPostalCodeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDetailAddressChange: (value: string) => void;
  onPostalCodeSearch: () => void;
}

export default function AddressInput({
  postalCode,
  address,
  detailAddress,
  postalCodeError,
  addressError,
  detailAddressError,
  onPostalCodeChange,
  onAddressChange,
  onDetailAddressChange,
  onPostalCodeSearch,
}: AddressInputProps) {
  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="address">
        주소
      </label>

      {/* 우편번호 */}
      <div className={styles.address_postal_code_wrapper}>
        <input
          id="postal-code"
          type="text"
          className={`${styles.input_field} ${styles.postal_code_input} ${
            postalCodeError !== undefined ? styles.input_error : ''
          }`}
          placeholder="우편번호"
          value={postalCode}
          onChange={(e) => onPostalCodeChange(e.target.value)}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
        <button
          type="button"
          className={styles.postal_code_search_button}
          onClick={onPostalCodeSearch}
        >
          우편번호 찾기
        </button>
      </div>

      {/* 기본 주소 */}
      <input
        id="address"
        type="text"
        className={`${styles.input_field} ${
          addressError !== undefined ? styles.input_error : ''
        }`}
        placeholder="기본 주소"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        onInvalid={(e) => {
          e.preventDefault();
        }}
      />

      {/* 상세 주소 */}
      <input
        id="detail-address"
        type="text"
        className={`${styles.input_field} ${
          detailAddressError !== undefined ? styles.input_error : ''
        }`}
        placeholder="상세 주소 입력"
        value={detailAddress}
        onChange={(e) => onDetailAddressChange(e.target.value)}
        onInvalid={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
}
