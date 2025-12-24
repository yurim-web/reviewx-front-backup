"use client";

/**
 * 금액 입력 필드 컴포넌트
 *
 * 사용처:
 * - src/app/user/point/withdrawal_request/page.tsx
 *
 * 목적: 금액 입력 시 숫자만 입력 가능하고 천 단위 구분 기호(쉼표)를 자동으로 추가하는 재사용 가능한 입력 필드
 *
 * 주요 기능:
 * - 숫자만 입력 가능 (자동 필터링)
 * - 천 단위 구분 기호(쉼표) 자동 추가
 * - 유효성 검사 및 에러 메시지 표시
 * - 커스텀 스타일 및 클래스명 지원
 *
 * Props:
 * - value: 입력된 금액 값 (포맷된 문자열)
 * - onChange: 금액 변경 핸들러 (포맷된 문자열을 반환)
 * - onValidationChange: 유효성 검사 결과 변경 핸들러 (선택적)
 * - minAmount: 최소 금액 (기본값: 0)
 * - maxAmount: 최대 금액 (기본값: 무제한)
 * - availablePoints: 보유 포인트 (선택적, 보유 포인트 체크 시 사용)
 * - placeholder: 플레이스홀더 텍스트
 * - label: 라벨 텍스트
 * - errorMessage: 에러 메시지 (외부에서 설정 가능)
 * - className: 추가 CSS 클래스명
 * - inputClassName: input 요소에 적용할 CSS 클래스명
 * - disabled: 비활성화 여부
 * - id: input 요소의 id
 */

import React from "react";
import ErrorText from "@/components/common/error_text/ErrorText";
import {
  extractNumericValue,
  formatAmountWithComma,
  parseFormattedAmount,
  validateAmount,
} from "@/utils/point/amountFormatter";

interface AmountInputProps {
  value: string;
  onChange: (formattedValue: string) => void;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
  minAmount?: number;
  maxAmount?: number;
  availablePoints?: number;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  id?: string;
}

export default function AmountInput({
  value,
  onChange,
  onValidationChange,
  minAmount = 0,
  maxAmount = Infinity,
  availablePoints,
  placeholder,
  label,
  errorMessage: externalErrorMessage,
  className = "",
  labelClassName = "",
  inputClassName = "",
  disabled = false,
  id,
}: AmountInputProps) {
  /**
   * 금액 입력 변경 핸들러
   *
   * 기능:
   * - 숫자만 입력 가능하도록 필터링
   * - 천 단위 구분 기호(쉼표) 자동 추가
   * - 유효성 검사 수행 및 에러 메시지 설정
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = extractNumericValue(inputValue);
    const formattedValue = formatAmountWithComma(numericValue);

    onChange(formattedValue);

    if (onValidationChange) {
      const amount = parseFormattedAmount(formattedValue);
      const validation = validateAmount(
        amount,
        minAmount,
        maxAmount,
        availablePoints
      );
      onValidationChange(validation.isValid, validation.errorMessage);
    }
  };

  const displayErrorMessage = externalErrorMessage;

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      {label && <label className={labelClassName || ""}>{label}</label>}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        className={inputClassName}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {displayErrorMessage && <ErrorText message={displayErrorMessage} />}
    </div>
  );
}
