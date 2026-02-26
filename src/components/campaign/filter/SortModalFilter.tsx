/* ========================================
   정렬 모달 필터 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * SortModalFilter
 *
 * 목적: FilterBar에서 사용하는 라디오 버튼 방식 정렬 선택 모달
 *
 * 사용 페이지:
 * - /campaign/delivery, /campaign/visit, /campaign/review,
 *   /campaign/mission, /campaign/reporter (CampaignListPage 공통)
 */

"use client";

import React from "react";
import modalStyles from "../../../styles/filter/filter_bar/modal.module.css";
import optionsStyles from "../../../styles/filter/filter_bar/modal_options.module.css";

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
  showReset: _showReset = true,
  defaultSort: _defaultSort = "최신순",
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
    <div className={modalStyles.modal_overlay} onClick={handleBackdropClick}>
      <div className={modalStyles.modal_content} onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className={modalStyles.modal_header}>
          <h3 className={modalStyles.modal_title}>{title}</h3>
          <button className={modalStyles.modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={`${modalStyles.modal_body} ${modalStyles.modal_body_no_margin}`}>
          <div className={optionsStyles.options_vertical}>
            {options.map((option, index) => (
              <label
                key={typeof option === "object" ? option.value || index : option}
                className={optionsStyles.option_item}
              >
                <input
                  type="radio"
                  name="sort-option"
                  value={typeof option === "object" ? option.value : option}
                  checked={isSelected(option)}
                  onChange={() => onOptionChange(option)}
                  className={optionsStyles.option_radio}
                />
                <span className={optionsStyles.option_label}>
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
