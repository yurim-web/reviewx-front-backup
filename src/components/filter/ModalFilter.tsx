"use client";

import React from "react";
import styles from "../../styles/filter/filter_bar.module.css";

interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sectionTitle?: string; // 섹션 제목 (카테고리, 채널 등)
  options: string[];
  selectedValues: string | string[];
  onOptionChange: (option: string) => void;
  onApply: () => void;
  onReset: () => void;
  type?: "checkbox" | "radio";
  showReset?: boolean;
  layout?: "grid" | "vertical";
}

export default function ModalFilter({
  isOpen,
  onClose,
  title,
  sectionTitle,
  options,
  selectedValues,
  onOptionChange,
  onApply,
  onReset,
  type = "checkbox",
  showReset = true,
  layout = "grid",
}: ModalFilterProps) {
  if (!isOpen) return null;

  const isSelected = (option: string) => {
    if (Array.isArray(selectedValues)) {
      if (option === "전체") {
        return (
          selectedValues.length ===
          options.filter((opt) => opt !== "전체").length
        );
      }
      return selectedValues.includes(option);
    }
    return selectedValues === option;
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
          {/* 섹션 제목 */}
          {sectionTitle && (
            <h4 className={styles.region_section_title}>{sectionTitle}</h4>
          )}

          <div
            className={
              layout === "vertical"
                ? styles.options_vertical
                : styles.options_grid
            }
          >
            {options.map((option) => (
              <label key={option} className={styles.option_item}>
                <input
                  type={type}
                  name={type === "radio" ? "modal-option" : undefined}
                  value={option}
                  checked={isSelected(option)}
                  onChange={() => onOptionChange(option)}
                  className={styles.option_checkbox}
                />
                <span className={styles.option_label}>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button className={styles.apply_button} onClick={onApply}>
            필터 적용하기
          </button>
          {showReset && (
            <button className={styles.reset_button} onClick={onReset}>
              <div className={styles.reset_icon}></div>
              선택 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
