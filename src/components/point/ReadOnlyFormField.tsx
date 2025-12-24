"use client";

/**
 * 읽기 전용 폼 필드 컴포넌트
 *
 * 사용처:
 * - src/app/user/point/withdrawal_request/page.tsx
 *
 * 목적: 읽기 전용(disabled) 입력 필드를 일관된 형식으로 표시하는 재사용 가능한 컴포넌트
 *
 * Props:
 * - label: 라벨 텍스트
 * - value: 입력 필드 값
 * - className: 컨테이너 CSS 클래스명 (form_group)
 * - labelClassName: 라벨 CSS 클래스명
 * - inputClassName: input 요소 CSS 클래스명
 * - id: input 요소의 id (선택적)
 */

import React from "react";

interface ReadOnlyFormFieldProps {
  label: string;
  value: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  id?: string;
}

export default function ReadOnlyFormField({
  label,
  value,
  className = "",
  labelClassName = "",
  inputClassName = "",
  id,
}: ReadOnlyFormFieldProps) {
  return (
    <div className={className}>
      <label className={labelClassName}>{label}</label>
      <input
        id={id}
        type="text"
        className={inputClassName}
        value={value}
        disabled
      />
    </div>
  );
}
