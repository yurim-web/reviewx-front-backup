/* ========================================
   💰 포인트 입력 섹션 공통 컴포넌트
   ======================================== */

/**
 * 포인트 입력 섹션 공통 컴포넌트
 *
 * 목적: 보유 포인트, 추가 지급 포인트 등 포인트 관련 입력 필드를 재사용 가능하게 만듭니다.
 *
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";

/**
 * 포인트 입력 섹션 Props
 *
 * 설명:
 * - label: 필드 라벨 텍스트
 * - required: 필수 필드 여부
 * - value: 포인트 값 (숫자 문자열, 쉼표 없음)
 * - displayValue: 화면에 표시할 값 (쉼표 포함)
 * - onChange: 값 변경 시 호출되는 콜백 함수
 * - onKeyDown: 키 입력 시 호출되는 콜백 함수
 * - placeholder: 플레이스홀더 텍스트
 * - readOnly: 읽기 전용 여부
 * - showChargeButton: 포인트 충전 버튼 표시 여부 (보유 포인트용)
 */
interface PointsInputSectionProps {
  /** 필드 라벨 텍스트 */
  label: string;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 포인트 값 (숫자 문자열, 쉼표 없음) */
  value: string;
  /** 화면에 표시할 값 (쉼표 포함) */
  displayValue: string;
  /** 값 변경 시 호출되는 콜백 함수 */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 키 입력 시 호출되는 콜백 함수 */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 읽기 전용 여부 */
  readOnly?: boolean;
  /** 포인트 충전 버튼 표시 여부 */
  showChargeButton?: boolean;
}

/**
 * 포인트 입력 섹션 컴포넌트
 *
 * 설명:
 * - 포인트 입력 필드와 단위(P)를 표시합니다.
 * - 보유 포인트일 경우 포인트 충전 버튼을 표시합니다.
 */
export function PointsInputSection({
  label,
  required = false,
  value: _value,
  displayValue,
  onChange,
  onKeyDown,
  placeholder,
  readOnly = false,
  showChargeButton = false,
}: PointsInputSectionProps) {
  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        {label}
        {required && <span className={infoStyles.required}>*</span>}
      </label>
      <div className={infoStyles.points_input_group}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            className={infoStyles.form_input}
            value={displayValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
          />
          <span className={infoStyles.points_unit}>P</span>
        </div>
        {showChargeButton && (
          <button type="button" className={infoStyles.charge_button}>
            포인트 충전하기
          </button>
        )}
      </div>
    </article>
  );
}
