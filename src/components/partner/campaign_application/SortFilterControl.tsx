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
 */

"use client";

import { useState } from "react";
import sort_dropdown_styles from "@/styles/partner/campaign_application/sort_dropdown.module.css";
import PartnerSortModalFilter from "./PartnerSortModalFilter";

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
}

export default function SortFilterControl({
  options,
  value,
  onChange,
  defaultSort = "latest",
  triggerAriaLabel = "정렬 선택",
}: SortFilterControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    options.find((opt) => opt.value === value)?.label ||
    options.find((opt) => opt.value === defaultSort)?.label ||
    "최신순";

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

      {/* 모달 */}
      <PartnerSortModalFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="정렬"
        options={options}
        selectedValue={value}
        onOptionChange={(opt) => {
          onChange(opt);
          setIsOpen(false);
        }}
        showReset={false}
        defaultSort={defaultSort}
      />
    </>
  );
}
