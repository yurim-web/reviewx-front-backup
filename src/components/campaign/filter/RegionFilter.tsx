/* ========================================
   지역 필터 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * RegionFilter
 *
 * 목적: 계층적 지역 구조(시/도 > 세부 지역) 지원 필터 컴포넌트
 *
 * 사용 페이지:
 * - /campaign/visit (방문형 캠페인 목록 - FilterBar 내부)
 */

"use client";

import Image from "next/image";
import { regionData } from "@/data/campaign/regions";
import { useRegionSelection } from "@/hooks/common/campaign/useRegionSelection";
import modalStyles from "../../../styles/filter/filter_bar/modal.module.css";
import optionsStyles from "../../../styles/filter/filter_bar/modal_options.module.css";
import footerStyles from "../../../styles/filter/filter_bar/modal_footer.module.css";
import regionStyles from "../../../styles/filter/filter_bar/region.module.css";

// ========================================
// 타입 정의
// ========================================

interface RegionFilterProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedRegions: string[];
  onRegionChange: (regions: string[]) => void;
  onApply: (regions?: string[]) => void;
  onReset: () => void;
}

// ========================================
// 지역 필터 컴포넌트
// ========================================

export default function RegionFilter({
  isOpen,
  onClose,
  title,
  selectedRegions,
  onRegionChange,
  onApply,
  onReset,
}: RegionFilterProps) {
  const {
    selectedMainRegion,
    tempSelectedRegions,
    currentSubRegions,
    isRegionAllSelected,
    isRegionPartiallySelected,
    subRegionsRef,
    hasScroll,
    getRegionAllKey,
    handleMainRegionClick,
    handleSubRegionToggle,
    handleApply,
    handleReset,
  } = useRegionSelection({ isOpen, selectedRegions, onRegionChange, onApply, onReset });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={`${modalStyles.modal_content} ${regionStyles.region_modal_content}`}
        onClick={(e) => e.stopPropagation()}
      >
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
          {/* 지역 섹션 제목 */}
          <h4 className={regionStyles.region_section_title}>지역</h4>

          {/* 메인 지역 탭들 */}
          <div className={regionStyles.region_tabs}>
            {regionData.mainRegions.map((region) => (
              <button
                key={region}
                className={`${regionStyles.region_tab} ${
                  selectedMainRegion === region ? regionStyles.region_tab_active : ""
                }`}
                onClick={() => handleMainRegionClick(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 세부 지역 목록 */}
          {currentSubRegions.length > 0 && (
            <div ref={subRegionsRef} className={regionStyles.sub_regions_container}>
              <div className={optionsStyles.options_grid}>
                {currentSubRegions.map((fullRegionName) => {
                  const isRegionAll =
                    selectedMainRegion !== "전체" &&
                    fullRegionName === getRegionAllKey(selectedMainRegion);
                  const isSelected = isRegionAll
                    ? isRegionAllSelected
                    : tempSelectedRegions.includes(fullRegionName) || isRegionAllSelected;

                  return (
                    <label key={fullRegionName} className={optionsStyles.option_item}>
                      <input
                        type="checkbox"
                        ref={(el) => {
                          if (el && isRegionAll) {
                            el.indeterminate = isRegionPartiallySelected;
                          }
                        }}
                        checked={isSelected}
                        onChange={() => handleSubRegionToggle(fullRegionName)}
                        className={optionsStyles.option_checkbox}
                      />
                      <span className={optionsStyles.option_label}>
                        {fullRegionName.split(" > ").map((part, index) => (
                          <span
                            key={index}
                            style={{ display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            {part}
                            {index < fullRegionName.split(" > ").length - 1 && (
                              <img
                                src="/images/filter/region_arrow.svg"
                                alt=">"
                                className={optionsStyles.region_arrow}
                              />
                            )}
                          </span>
                        ))}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className={footerStyles.modal_footer}>
          <button className={footerStyles.apply_button} onClick={handleApply}>
            필터 적용하기
          </button>
          <button className={footerStyles.reset_button} onClick={handleReset}>
            <Image
              src="/images/icons/reset_icon.svg"
              alt="초기화"
              width={16}
              height={16}
              className={footerStyles.reset_icon}
            />
            선택 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
