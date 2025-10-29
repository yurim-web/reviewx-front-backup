/* ========================================
   📊 파트너 정렬 모달 필터 컴포넌트
   ======================================== */

/**
 * 파트너 정렬 모달 필터 컴포넌트
 *
 * 목적: 파트너 페이지에서 사용되는 정렬 전용 모달 컴포넌트로, 라디오 버튼 방식의 정렬 선택을 제공합니다.
 *
 * 사용 페이지:
 * - 파트너 캠페인 신청내역 페이지에서 정렬 필터로 사용
 *
 * 주요 기능:
 * - 라디오 버튼 방식 정렬 선택 (단일 선택)
 * - 세로 레이아웃 지원
 * - 정렬 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 * - 파트너 전용 UI 및 스타일링
 */

"use client";

import React from "react";
import styles from "../../../styles/partner/campaign_application/sort_dropdown.module.css";

interface PartnerSortModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onOptionChange: (option: { value: string; label: string }) => void;
  showReset?: boolean;
  defaultSort?: string; // 기본 정렬값 (초기화 시 사용)
}

export default function PartnerSortModalFilter({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onOptionChange,
  showReset = true,
  defaultSort = "최신순",
}: PartnerSortModalFilterProps) {
  if (!isOpen) return null;

  const isSelected = (option: { value: string; label: string }) => {
    return selectedValue === option.value;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReset = () => {
    const defaultOption = options.find(
      (option) => option.value === defaultSort
    );
    if (defaultOption) {
      onOptionChange(defaultOption);
    }
  };

  return (
    <div className={styles.sort_modal_overlay} onClick={handleBackdropClick}>
      <div
        className={styles.sort_modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.sort_modal_header}>
          <h3 className={styles.sort_modal_title}>{title}</h3>
          <button className={styles.sort_modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.sort_modal_body}>
          <div className={styles.sort_options_vertical}>
            {options.map((option, index) => (
              <label
                key={option.value || index}
                className={styles.sort_option_item}
              >
                <input
                  type="radio"
                  name="sort-option"
                  value={option.value}
                  checked={isSelected(option)}
                  onChange={() => onOptionChange(option)}
                  className={styles.sort_option_radio}
                />
                <span className={styles.sort_option_label}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
