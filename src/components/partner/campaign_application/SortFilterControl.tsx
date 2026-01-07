/* ========================================
   🧩 정렬 트리거 + 모달 통합 컴포넌트
   ======================================== */

/**
 * 정렬 버튼(트리거)과 정렬 모달을 하나로 묶은 재사용 컴포넌트
 *
 * 목적:
 * - 페이지에서 정렬 트리거 버튼과 모달을 간단히 한 줄로 사용
 * - 내부에서 모달 열기/닫기 상태를 관리하여 코드 중복 제거
 *
 * 사용법 예시:
 * <SortFilterControl
 *   options={[{ value: "latest", label: "최신순" }, ...]}
 *   value={sortOrder}
 *   onChange={(opt) => setSortOrder(opt.value as SortOrder)}
 *   defaultSort="latest"
 * />
 *
 * 📍 사용처:
 * 1. src/components/partner/campaign_application/CampaignApplicationLayout.tsx
 *    - 파트너 신청 내역 페이지에서 정렬 기능 제공 (2곳 사용)
 *    - 신청 내역 탭과 선정 내역 탭의 정렬 컨트롤로 사용
 *
 * 2. src/components/partner/campaign_contents/CampaignContentsLayout.tsx
 *    - 파트너 캠페인 콘텐츠 관리 페이지에서 정렬 기능 제공
 *    - 콘텐츠 내역(대기/확인/완료) 정렬 컨트롤로 사용
 *
 * 3. src/components/manager/common/campaign/progress/layout/CampaignProgressDetailLayout.tsx
 *    - 매니저 캠페인 진행 상세 페이지에서 정렬 기능 제공
 *    - 캠페인 신청 내역 정렬 컨트롤로 사용
 *
 * 4. src/components/manager/common/campaign/progress/CampaignApplicationLayout.tsx
 *    - 매니저 신청 내역 레이아웃에서 정렬 기능 제공 (2곳 사용)
 *    - 신청 내역과 선정 내역 정렬 컨트롤로 사용
 *
 * 📍 정렬 옵션 정의 위치:
 * 1. src/hooks/partner/campaign_application/useCampaignApplication.ts (147줄)
 *    - 신청 내역 페이지용 정렬 옵션
 *    - 옵션: 최신순, 등록순, 추천순
 *
 * 2. src/hooks/partner/campaign_contents/useCampaignContents.ts (132줄)
 *    - 콘텐츠 내역 페이지용 정렬 옵션
 *    - 옵션: 최신순, 인기순, 마감임박순, 포인트순
 *
 * 3. src/data/campaign/campaignFilterOptions.ts
 *    - 각 캠페인 유형별 정렬 옵션 정의 (배송형, 방문형, 미션형, 구매평, 기자단)
 *    - 주로 메인 페이지나 검색 페이지에서 사용
 */

"use client";

import { useMemo, useState } from "react";
import sort_dropdown_styles from "@/styles/partner/campaign_application/sort_dropdown.module.css";

export interface SortOptionItem {
  value: string;
  label: string;
}

interface SortFilterControlProps {
  options: SortOptionItem[];
  value: string;
  onChange: (option: SortOptionItem) => void;
  defaultSort?: string;
  triggerAriaLabel?: string;
  modalTitle?: string;
}

export default function SortFilterControl({
  options,
  value,
  onChange,
  defaultSort = "latest",
  triggerAriaLabel = "정렬 선택",
  modalTitle = "정렬",
}: SortFilterControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultOptionLabel = useMemo(() => {
    return options.find((opt) => opt.value === defaultSort)?.label;
  }, [options, defaultSort]);

  const currentLabel =
    options.find((opt) => opt.value === value)?.label ||
    defaultOptionLabel ||
    "최신순";

  const modalAriaLabel = `${modalTitle} 옵션 선택`;

  const handleOptionChange = (option: SortOptionItem) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        type="button"
        aria-label={triggerAriaLabel}
        className={`${sort_dropdown_styles.sort_modal_trigger} ${
          isOpen ? sort_dropdown_styles.sort_modal_trigger_open : ""
        }`}
        onClick={() => setIsOpen(true)}
      >
        <span className={sort_dropdown_styles.sort_trigger_text}>
          {currentLabel}
        </span>
        <img
          src="/images/filter/part_dropdown_arrow.svg"
          alt="정렬 선택"
          className={sort_dropdown_styles.sort_trigger_arrow}
        />
      </button>

      {/* 모달: 라디오 버튼 기반 정렬 선택 UI */}
      {isOpen && (
        <div
          className={sort_dropdown_styles.sort_modal_overlay}
          role="dialog"
          aria-modal="true"
          aria-label={modalAriaLabel}
          onClick={handleOverlayClick}
        >
          <div
            className={sort_dropdown_styles.sort_modal_content}
            onClick={(event) => event.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className={sort_dropdown_styles.sort_modal_header}>
              <h3 className={sort_dropdown_styles.sort_modal_title}>
                {modalTitle}
              </h3>
              <button
                type="button"
                className={sort_dropdown_styles.sort_modal_close_button}
                onClick={() => setIsOpen(false)}
                aria-label="모달 닫기"
              >
                <img src="/images/filter/x_icon.svg" alt="닫기" />
              </button>
            </div>

            {/* 모달 본문: 정렬 옵션 목록 */}
            <div className={sort_dropdown_styles.sort_modal_body}>
              <div className={sort_dropdown_styles.sort_options_vertical}>
                {options.map((option) => (
                  <label
                    key={option.value}
                    className={sort_dropdown_styles.sort_option_item}
                  >
                    <input
                      type="radio"
                      name="sort-option"
                      value={option.value}
                      checked={value === option.value}
                      onChange={() => handleOptionChange(option)}
                      className={sort_dropdown_styles.sort_option_radio}
                    />
                    <span className={sort_dropdown_styles.sort_option_label}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
