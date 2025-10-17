/* ========================================
   📊 정렬 모달 필터 컴포넌트
   ======================================== */

/**
 * 정렬 모달 필터 컴포넌트
 *
 * 목적: FilterBar에서 사용되는 정렬 전용 모달 컴포넌트로, 라디오 버튼 방식의 정렬 선택을 제공합니다.
 *
 * 사용 페이지:
 * - FilterBar 컴포넌트에서 정렬 필터로 사용
 *
 * 주요 기능:
 * - 라디오 버튼 방식 정렬 선택 (단일 선택)
 * - 세로 레이아웃 지원
 * - 정렬 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 * - 정렬 전용 UI 및 스타일링
 */

"use client";

import React from "react";
import styles from "../../../styles/filter/filter_bar.module.css";

interface SortModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[] | { value: string; label: string }[];
  selectedValue: string;
  onOptionChange: (option: string | { value: string; label: string }) => void;
  showReset?: boolean;
  defaultSort?: string; // 기본 정렬값 (초기화 시 사용)
}

export default function SortModalFilter({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onOptionChange,
  showReset = true,
  defaultSort = "최신순",
}: SortModalFilterProps) {
  if (!isOpen) return null;

  const isSelected = (option: string | { value: string; label: string }) => {
    const optionValue = typeof option === "string" ? option : option.value;
    return selectedValue === optionValue;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal_content}
        style={{ gap: "32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>{title}</h3>
          <button className={styles.modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          <div className={styles.options_vertical}>
            {options.map((option, index) => (
              <label
                key={
                  typeof option === "object" ? option.value || index : option
                }
                className={styles.option_item}
              >
                <input
                  type="radio"
                  name="sort-option"
                  value={typeof option === "object" ? option.value : option}
                  checked={isSelected(option)}
                  onChange={() => onOptionChange(option)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>
                  {typeof option === "object" ? option.label : option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
