/* ========================================
   📄 영수증/계산서 발행 드롭다운 컴포넌트
   ======================================== */

/**
 * 영수증/계산서 발행 드롭다운 컴포넌트
 *
 * 목적: 영수증/계산서 발행 옵션을 선택하는 드롭다운
 *
 * 사용 위치:
 * - /partner/point/charge
 */

import { RefObject } from "react";
import customDropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

export type InvoiceType = "none" | "cash_income" | "cash_expense" | "tax_invoice";

interface InvoiceTypeDropdownProps {
  id: string;
  selectedType: InvoiceType;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (type: InvoiceType) => void;
  dropdownRef?: RefObject<HTMLDivElement>;
}

const INVOICE_OPTIONS: { value: InvoiceType; label: string }[] = [
  { value: "none", label: "미발행" },
  { value: "cash_income", label: "현금영수증 (소득공제)" },
  { value: "cash_expense", label: "현금영수증 (지출증빙)" },
  { value: "tax_invoice", label: "세금계산서" },
];

function getInvoiceLabel(type: InvoiceType): string {
  return INVOICE_OPTIONS.find((opt) => opt.value === type)?.label || "옵션 선택";
}

export default function InvoiceTypeDropdown({
  id,
  selectedType,
  isOpen,
  onToggle,
  onSelect,
  dropdownRef,
}: InvoiceTypeDropdownProps) {
  return (
    <div className={customDropdownStyles.custom_dropdown} ref={dropdownRef}>
      <button
        id={id}
        type="button"
        className={customDropdownStyles.dropdown_button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span
          className={customDropdownStyles.dropdown_text}
          data-placeholder="옵션 선택"
        >
          {getInvoiceLabel(selectedType)}
        </span>
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt=""
          className={`${customDropdownStyles.dropdown_arrow} ${
            isOpen ? customDropdownStyles.rotated : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={customDropdownStyles.dropdown_options}
          role="listbox"
          aria-label="영수증/계산서 발행 옵션"
        >
          {INVOICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selectedType === option.value}
              className={customDropdownStyles.dropdown_option}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
