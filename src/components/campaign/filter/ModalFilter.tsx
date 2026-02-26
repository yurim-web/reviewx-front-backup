/* ========================================
   📋 모달 필터 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 모달 필터 컴포넌트
 *
 * 목적: FilterBar에서 사용되는 범용 모달 필터 컴포넌트로, 체크박스/라디오 버튼 방식의 필터링을 제공합니다.
 *
 * 사용 페이지:
 * - FilterBar 컴포넌트에서 카테고리/채널 필터로 사용
 * - /campaign/delivery (배송형 캠페인 목록)
 * - /campaign/visit (방문형 캠페인 목록)
 * - /campaign/review (구매평 캠페인 목록)
 * - /campaign/mission (미션형 캠페인 목록)
 * - /campaign/reporter (기자단 캠페인 목록)
 *
 * 참고: ModalFilter는 FilterBar 컴포넌트 내부에서 사용되며,
 * 위 페이지들은 CampaignListPage를 통해 FilterBar를 간접적으로 사용합니다.
 *
 * 주요 기능:
 * - 체크박스/라디오 버튼 방식 필터링
 * - 그리드/세로 레이아웃 지원
 * - 다중 선택/단일 선택 지원
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 */

"use client";

import React, { useRef } from "react";
import { useHasScroll } from "../../../hooks/common/useHasScroll";
import modalStyles from "../../../styles/filter/filter_bar/modal.module.css";
import optionsStyles from "../../../styles/filter/filter_bar/modal_options.module.css";
import footerStyles from "../../../styles/filter/filter_bar/modal_footer.module.css";
import regionStyles from "../../../styles/filter/filter_bar/region.module.css";

interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sectionTitle?: string; // 섹션 제목 (카테고리, 채널 등)
  options: string[] | { value: string; label: string }[];
  selectedValues: string | string[];
  onOptionChange: (option: string | { value: string; label: string }) => void;
  onApply: () => void;
  onReset: () => void;
  type?: "checkbox" | "radio";
  showReset?: boolean;
  showApply?: boolean; // "필터 적용하기" 버튼 표시 여부 (기본값: true)
  layout?: "grid" | "vertical";
  noScroll?: boolean; // 스크롤바 숨김 여부 (기본값: false, 정렬 모달 등에 사용)
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
  showApply = true, // 기본값: true (필터 적용하기 버튼 표시)
  layout = "grid",
  noScroll = false, // 기본값: false (스크롤 표시)
}: ModalFilterProps) {
  const optionsRef = useRef<HTMLDivElement>(null);
  const hasScroll = useHasScroll(optionsRef, isOpen, [options]);

  if (!isOpen) return null;

  const isSelected = (option: string | { value: string; label: string }) => {
    const optionValue = typeof option === "string" ? option : option.value;
    if (Array.isArray(selectedValues)) {
      if (optionValue === "전체") {
        return (
          selectedValues.length ===
          options.filter((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            return optValue !== "전체";
          }).length
        );
      }
      return selectedValues.includes(optionValue);
    }
    return selectedValues === optionValue;
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
        <div
          className={`${modalStyles.modal_body} ${!hasScroll ? modalStyles.modal_body_no_margin : ""}`}
        >
          {/* 섹션 제목 */}
          {sectionTitle && <h4 className={regionStyles.region_section_title}>{sectionTitle}</h4>}

          <div
            ref={optionsRef}
            className={`${
              layout === "vertical" ? optionsStyles.options_vertical : optionsStyles.options_grid
            } ${noScroll && layout === "vertical" ? optionsStyles.no_scroll : ""}`}
          >
            {options.map((option, index) => (
              <label
                key={typeof option === "object" ? option.value || index : option}
                className={optionsStyles.option_item}
              >
                <input
                  type={type}
                  name={type === "radio" ? "modal-option" : undefined}
                  value={typeof option === "object" ? option.value : option}
                  checked={isSelected(option)}
                  onChange={() => onOptionChange(option)}
                  className={
                    type === "radio" ? optionsStyles.option_radio : optionsStyles.option_checkbox
                  }
                />
                <span className={optionsStyles.option_label}>
                  {typeof option === "object" ? option.label : option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={footerStyles.modal_footer}>
          {showApply && (
            <button className={footerStyles.apply_button} onClick={onApply}>
              필터 적용
            </button>
          )}
          {showReset && (
            <button className={footerStyles.reset_button} onClick={onReset}>
              <img
                src="/images/icons/reset_icon.svg"
                alt="초기화"
                className={footerStyles.reset_icon}
              />
              선택 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
