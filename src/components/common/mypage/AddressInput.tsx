/**
 * 주소 입력 컴포넌트
 *
 * 우편번호, 기본 주소, 상세 주소를 입력할 수 있는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 * - /partner/signup (파트너 회원가입 - variant="signup")
 */

"use client";

import FormField from "./FormField";
import InputWithButton from "./InputWithButton";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import signupCommonStyles from "@/styles/common/signup/signup.module.css";
import partnerSignupStyles from "@/styles/partner/signup/partner_signup.module.css";

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
  /** 라벨 표시 여부 (기본값: true) */
  showLabel?: boolean;
  /** 렌더링 변형 (기본값: "mypage") */
  variant?: "mypage" | "signup";
  /** 우편번호 오류 상태 (signup 변형에서 사용) */
  postalCodeError?: string;
  /** 기본 주소 오류 상태 (signup 변형에서 사용) */
  addressError?: string;
  /** 상세 주소 오류 상태 (signup 변형에서 사용) */
  detailAddressError?: string;
}

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
  showLabel = true,
  variant = "mypage",
  postalCodeError,
  addressError,
  detailAddressError,
}: AddressInputProps) {
  // signup 변형: 회원가입 페이지 스타일 사용
  if (variant === "signup") {
    return (
      <div className={signupCommonStyles.form_field}>
        <label className={signupCommonStyles.field_label} htmlFor="address">
          주소
        </label>

        {/* 우편번호 */}
        <div className={partnerSignupStyles.address_postal_code_wrapper}>
          <input
            id="postal-code"
            type="text"
            className={`${signupCommonStyles.input_field} ${partnerSignupStyles.postal_code_input} ${
              postalCodeError !== undefined ? signupCommonStyles.input_error : ""
            }`}
            placeholder="우편번호"
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            onInvalid={(e) => e.preventDefault()}
          />
          {onPostalCodeSearch && (
            <button
              type="button"
              className={partnerSignupStyles.postal_code_search_button}
              onClick={onPostalCodeSearch}
            >
              우편번호 찾기
            </button>
          )}
        </div>

        {/* 기본 주소 */}
        <input
          id="address"
          type="text"
          className={`${signupCommonStyles.input_field} ${
            addressError !== undefined ? signupCommonStyles.input_error : ""
          }`}
          placeholder="기본 주소"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          onInvalid={(e) => e.preventDefault()}
        />

        {/* 상세 주소 */}
        <input
          id="detail-address"
          type="text"
          className={`${signupCommonStyles.input_field} ${
            detailAddressError !== undefined ? signupCommonStyles.input_error : ""
          }`}
          placeholder="상세 주소 입력"
          value={detailAddress}
          onChange={(e) => onDetailAddressChange(e.target.value)}
          onInvalid={(e) => e.preventDefault()}
        />
      </div>
    );
  }

  /** 주소 입력 필드 렌더링 헬퍼 함수 (mypage 변형) */
  const renderAddressField = (
    id: string,
    name: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => (
    <div className={layoutStyles.field_group}>
      <input
        type="text"
        id={id}
        name={name}
        className={inputStyles.input_field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  // 라벨을 표시하지 않는 경우 직접 렌더링
  if (!showLabel) {
    return (
      <div className={layoutStyles.field_article}>
        <InputWithButton
          input={
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className={inputStyles.input_field}
              value={postalCode}
              onChange={(e) => onPostalCodeChange(e.target.value)}
              readOnly={postalCodeReadOnly}
              placeholder="우편번호"
            />
          }
          button={
            onPostalCodeSearch ? (
              <button
                type="button"
                className={verificationStyles.postal_button}
                onClick={onPostalCodeSearch}
              >
                우편번호 찾기
              </button>
            ) : undefined
          }
        />

        {renderAddressField("address", "address", address, onAddressChange, "기본 주소")}
        {renderAddressField(
          "detailAddress",
          "detailAddress",
          detailAddress,
          onDetailAddressChange,
          "상세 주소 입력"
        )}
      </div>
    );
  }

  return (
    <FormField label="주소" htmlFor="postalCode" required={showRequiredAsterisk}>
      <InputWithButton
        input={
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            className={inputStyles.input_field}
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            readOnly={postalCodeReadOnly}
            placeholder="우편번호"
          />
        }
        button={
          onPostalCodeSearch ? (
            <button
              type="button"
              className={verificationStyles.postal_button}
              onClick={onPostalCodeSearch}
            >
              우편번호 찾기
            </button>
          ) : undefined
        }
      />

      {renderAddressField("address", "address", address, onAddressChange, "기본 주소")}
      {renderAddressField(
        "detailAddress",
        "detailAddress",
        detailAddress,
        onDetailAddressChange,
        "상세 주소 입력"
      )}
    </FormField>
  );
}
