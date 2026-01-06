/* ========================================
   💰 포인트 관리 섹션 공통 컴포넌트
   ======================================== */

/**
 * 포인트 관리 섹션 공통 컴포넌트
 *
 * 목적: 보유 포인트, 차감 포인트, 추가 지급 포인트를 한 번에 관리하는 UI를 제공합니다.
 *
 * 주요 기능:
 * - 보유 포인트 표시 (읽기 전용)
 * - 차감 포인트 계산 및 표시 (읽기 전용)
 * - 추가 지급 포인트 입력
 * - 포인트 충전 버튼
 * - 포인트 부족 시 경고 메시지
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import {
  formatNumberWithComma,
  handleNumericInput,
  handleNumericChange,
} from "../utils/formUtils";
import ErrorText from "@/components/common/error_text/ErrorText";

/**
 * 포인트 관리 섹션 Props
 *
 * 설명:
 * - currentPoints: 현재 보유 포인트
 * - additionalPoints: 추가 지급 포인트 값 (숫자 문자열, 쉼표 없음)
 * - deductedPoints: 차감될 포인트 (계산된 값)
 * - onAdditionalPointsChange: 추가 지급 포인트 변경 시 호출되는 콜백 함수
 * - onChargeClick: 포인트 충전 버튼 클릭 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditable: 추가 지급 포인트 편집 가능 여부
 * - showInsufficientPointsWarning: 포인트 부족 경고 표시 여부
 */
interface PointsManagementSectionProps {
  /** 현재 보유 포인트 */
  currentPoints: string | number;
  /** 추가 지급 포인트 값 (숫자 문자열, 쉼표 없음) */
  additionalPoints: string | number;
  /** 차감될 포인트 (계산된 값) */
  deductedPoints: string | number;
  /** 추가 지급 포인트 변경 시 호출되는 콜백 함수 */
  onAdditionalPointsChange: (value: string) => void;
  /** 포인트 충전 버튼 클릭 시 호출되는 콜백 함수 */
  onChargeClick?: () => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 추가 지급 포인트 편집 가능 여부 */
  isEditable?: boolean;
  /** 포인트 부족 경고 표시 여부 */
  showInsufficientPointsWarning?: boolean;
}

/**
 * 포인트 관리 섹션 컴포넌트
 *
 * 설명:
 * - 보유 포인트, 차감 포인트, 추가 지급 포인트를 표시합니다.
 * - 포인트가 부족하면 경고 메시지를 표시합니다.
 * - 포인트 충전 버튼을 제공합니다.
 */
export function PointsManagementSection({
  currentPoints,
  additionalPoints,
  deductedPoints,
  onAdditionalPointsChange,
  onChargeClick,
  isEditMode = false,
  isEditable = true,
  showInsufficientPointsWarning = false,
}: PointsManagementSectionProps) {
  /**
   * 추가 지급 포인트 변경 핸들러
   */
  const handleAdditionalPointsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleNumericChange(e, onAdditionalPointsChange);
  };

  /**
   * 추가 지급 포인트 키 입력 핸들러
   */
  const handleAdditionalPointsKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    handleNumericInput(e);
  };

  return (
    <>
      {/* 추가 지급 포인트 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>추가 지급 포인트</label>
        <div className={infoStyles.points_input_group}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={infoStyles.form_input}
              value={formatNumberWithComma(additionalPoints)}
              onChange={handleAdditionalPointsChange}
              onKeyDown={handleAdditionalPointsKeyDown}
              placeholder="캠페인 수행에 대한 추가 지급 포인트"
              readOnly={isEditMode && !isEditable}
            />
            <span className={infoStyles.points_unit}>P</span>
          </div>
        </div>
      </article>

      {/* 차감 포인트 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>차감 포인트</label>
        <div className={infoStyles.points_input_group}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={infoStyles.form_input}
              value={formatNumberWithComma(deductedPoints)}
              readOnly
            />
            <span className={infoStyles.points_unit}>P</span>
          </div>
        </div>
      </article>

      {/* 보유 포인트 및 충전 버튼 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>보유 포인트</label>
        <div className={infoStyles.points_input_group}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className={infoStyles.form_input}
              value={formatNumberWithComma(currentPoints)}
              readOnly
            />
            <span className={infoStyles.points_unit}>P</span>
          </div>
          <button
            type="button"
            className={infoStyles.charge_button}
            onClick={onChargeClick}
          >
            포인트 충전하기
          </button>
        </div>
      </article>

      {/* 포인트 부족 경고 메시지 */}
      {showInsufficientPointsWarning && (
        <article className={infoStyles.form_group}>
          <ErrorText
            message="보유 포인트가 부족합니다. 포인트를 충전한 후 다시 시도해 주세요."
            style={{ marginTop: "-8px" }}
          />
        </article>
      )}
    </>
  );
}
